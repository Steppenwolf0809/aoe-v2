'use server'

import { contactSchema } from '@/lib/validations/contact'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function submitContactForm(
  formData: unknown
): Promise<ActionResult<null>> {
  try {
    const validated = contactSchema.safeParse(formData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    // TODO: enviar email con Resend
    // TODO: guardar como lead en Supabase
    console.log('[submitContactForm]', validated.data)

    return { success: true, data: null }
  } catch (error) {
    console.error('[submitContactForm]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
