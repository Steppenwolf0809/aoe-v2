'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loginSchema, registerSchema, forgotPasswordSchema, type LoginInput, type RegisterInput, type ForgotPasswordInput } from '@/lib/validations/auth'
import { headers } from 'next/headers'
import { SITE_URL } from '@/lib/constants'

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Login de usuario con email y password
 */
export async function login(data: LoginInput): Promise<ActionResult> {
  try {
    // Validar con Zod
    const validated = loginSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Datos invalidos',
      }
    }

    const supabase = await createClient()

    // Intentar login
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    })

    if (error) {
      // Mensajes de error amigables
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Credenciales invalidas. Verifica tu email y contrasena.',
        }
      }
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Tu email aun no ha sido verificado. Revisa tu bandeja de entrada.',
        }
      }
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[login]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesion',
    }
  }
}

/**
 * Registro de nuevo usuario
 */
export async function register(data: RegisterInput): Promise<ActionResult> {
  try {
    // Validar con Zod
    const validated = registerSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Datos invalidos',
      }
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_APP_URL || SITE_URL

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: validated.data.fullName,
        },
      },
    })

    if (authError) {
      // Mensajes de error amigables
      if (authError.message.includes('User already registered')) {
        return {
          success: false,
          error: 'Este email ya esta registrado. Intenta iniciar sesion.',
        }
      }
      return {
        success: false,
        error: authError.message,
      }
    }

    // Si el usuario fue creado, crear el perfil
    if (authData.user) {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn(
          '[register] SUPABASE_SERVICE_ROLE_KEY no configurada. Omitiendo creacion de perfil.'
        )
      } else {
        try {
          // Usamos el cliente admin para saltar RLS ya que el usuario
          // aun no tiene sesion activa valida para insertar en profiles
          const admin = createAdminClient()

          const { error: profileError } = await admin
            .from('profiles')
            .upsert(
              {
                id: authData.user.id,
                full_name: validated.data.fullName,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'id',
              }
            )

          if (profileError) {
            console.error('[register] Error creando perfil:', profileError)
            // No devolvemos error al usuario porque el usuario ya fue creado en Auth
            // Solo logueamos el error para debugging
          }
        } catch (profileClientError) {
          console.error('[register] Error creando cliente admin:', profileClientError)
        }
      }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[register]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar usuario',
    }
  }
}

/**
 * Solicitar reset de password
 */
export async function forgotPassword(data: ForgotPasswordInput): Promise<ActionResult> {
  try {
    // Validar con Zod
    const validated = forgotPasswordSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Email invalido',
      }
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_APP_URL || SITE_URL

    const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // IMPORTANTE: Por seguridad, siempre devolvemos éxito aunque el email no exista
    // Esto previene que atacantes descubran qué emails están registrados
    return { success: true, data: undefined }
  } catch (error) {
    console.error('[forgotPassword]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar email de recuperacion',
    }
  }
}

/**
 * Login con Google OAuth
 */
export async function loginWithGoogle(): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient()
    const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_APP_URL || SITE_URL

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.url) {
      return {
        success: false,
        error: 'No se pudo generar la URL de autenticacion',
      }
    }

    // Devolvemos la URL para que el cliente haga el redirect
    return {
      success: true,
      data: data.url,
    }
  } catch (error) {
    console.error('[loginWithGoogle]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesion con Google',
    }
  }
}

/**
 * Logout
 */
export async function logout(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[logout]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cerrar sesion',
    }
  }
}
