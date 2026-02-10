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

export async function getContract(
  contractId: string
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: 'Contrato no encontrado' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[getContract]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

export async function updateContractStatus(
  contractId: string,
  updates: {
    status?: string
    payment_id?: string
    amount?: number
    pdf_url?: string
    pdf_hash?: string
    download_token?: string
    download_token_expires_at?: string
  }
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', contractId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/contratos')
    revalidatePath(`/dashboard/contratos/${contractId}`)
    return { success: true, data }
  } catch (error) {
    console.error('[updateContractStatus]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
