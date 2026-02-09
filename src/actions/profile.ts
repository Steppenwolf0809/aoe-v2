'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { profileSchema, type ProfileInput } from '@/lib/validations/profile'
import { revalidatePath } from 'next/cache'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function updateProfile(data: ProfileInput): Promise<ActionResult<null>> {
  try {
    const validated = profileSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Datos invalidos',
      }
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: validated.data.fullName,
        phone: validated.data.phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/perfil')
    return { success: true, data: null }
  } catch (error) {
    console.error('[updateProfile]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function deleteAccount(): Promise<ActionResult<null>> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const admin = createAdminClient()

    await admin.from('subscriptions').delete().eq('user_id', user.id)
    await admin.from('contracts').delete().eq('user_id', user.id)
    await admin.from('profiles').delete().eq('id', user.id)

    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) {
      return { success: false, error: error.message }
    }

    await supabase.auth.signOut()

    revalidatePath('/dashboard')
    return { success: true, data: null }
  } catch (error) {
    console.error('[deleteAccount]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
