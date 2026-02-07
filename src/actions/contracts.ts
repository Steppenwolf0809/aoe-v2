'use server'

import { createClient } from '@/lib/supabase/server'
import { contratoVehicularSchema } from '@/lib/validations/contract'
import { revalidatePath } from 'next/cache'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createContract(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const validated = contratoVehicularSchema.safeParse(formData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        type: 'VEHICLE_CONTRACT',
        data: validated.data,
        status: 'DRAFT',
      })
      .select('id')
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/contratos')
    return { success: true, data: { id: data.id } }
  } catch (error) {
    console.error('[createContract]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
