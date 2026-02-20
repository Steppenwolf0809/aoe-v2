'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { contratoVehicularSchema } from '@/lib/validations/contract'
import { generateContratoVehicularDocx } from '@/lib/docx/contrato-vehicular-docx'

type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string }

/**
 * Generate and return a .docx contract file as a base64 string.
 * The client will convert base64 → Blob → download trigger.
 */
export async function generateContractDocx(
    contractId: string,
    downloadToken: string,
): Promise<ActionResult<{ base64: string; filename: string }>> {
    try {
        const adminSupabase = createAdminClient()

        // Verify contract and token
        const { data: contract, error } = await adminSupabase
            .from('contracts')
            .select('*')
            .eq('id', contractId)
            .single()

        if (error || !contract) {
            return { success: false, error: 'Contrato no encontrado' }
        }

        if (contract.status !== 'GENERATED' && contract.status !== 'DOWNLOADED') {
            return { success: false, error: 'El contrato no está disponible para descarga' }
        }

        if (contract.download_token !== downloadToken) {
            return { success: false, error: 'Token de descarga inválido' }
        }

        // Parse and validate data
        const validated = contratoVehicularSchema.safeParse(contract.data)
        if (!validated.success) {
            return { success: false, error: 'Datos del contrato inválidos' }
        }

        // Generate DOCX
        const buffer = await generateContratoVehicularDocx(validated.data)
        const base64 = buffer.toString('base64')

        // Build filename using vendedor + comprador names
        const vendedorApellido = validated.data.vendedor.nombres.split(' ').pop() ?? 'vendedor'
        const compradorApellido = validated.data.comprador.nombres.split(' ').pop() ?? 'comprador'
        const filename = `contrato-compraventa-${vendedorApellido}-${compradorApellido}.docx`.toLowerCase()

        return { success: true, data: { base64, filename } }
    } catch (err) {
        console.error('[generateContractDocx]', err)
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Error al generar el documento',
        }
    }
}
