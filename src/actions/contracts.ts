'use server'

import { createClient } from '@/lib/supabase/server'
import { contratoVehicularSchema } from '@/lib/validations/contract'
import { revalidatePath } from 'next/cache'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createContract(
  formData: unknown,
  email?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !email) {
      return { success: false, error: 'Email es requerido para continuar' }
    }

    const validated = contratoVehicularSchema.safeParse(formData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        user_id: user?.id || null,
        email: user ? null : email,
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
  contractId: string,
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
  },
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

/**
 * Claim an anonymous contract after authentication.
 * Associates the contract with the authenticated user and prepares DOCX download.
 */
export async function claimContract(
  contractId: string,
): Promise<ActionResult<{ downloadToken: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()

    const { data: contract, error: fetchError } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()

    if (fetchError || !contract) {
      return { success: false, error: 'Contrato no encontrado' }
    }

    if (contract.user_id) {
      return { success: false, error: 'Este contrato ya pertenece a un usuario' }
    }

    if (contract.status !== 'PAID') {
      return {
        success: false,
        error: `Contrato en estado ${contract.status}, debe estar pagado`,
      }
    }

    await adminSupabase
      .from('contracts')
      .update({
        user_id: user.id,
        email: null,
      })
      .eq('id', contractId)

    const { prepareContractDocxDeliveryAdmin } = await import('./docx')
    const docxResult = await prepareContractDocxDeliveryAdmin(contractId)

    if (!docxResult.success) {
      return {
        success: false,
        error: `Contrato asociado pero falló la preparación del documento Word: ${docxResult.error}`,
      }
    }

    revalidatePath('/dashboard/contratos')
    return { success: true, data: docxResult.data }
  } catch (error) {
    console.error('[claimContract]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
