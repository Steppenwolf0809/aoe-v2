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

        // Add v2 field defaults for backward compatibility with v1 contracts
        const raw = contract.data as Record<string, any>
        const personaDefaults = { sexo: 'M', nacionalidad: 'ecuatoriana', tipoDocumento: 'cedula' }
        const vehiculoDefaults = {
            tipo: '', cilindraje: 1, carroceria: '', clase: '', pais: '',
            combustible: '', pasajeros: 5, servicio: 'USO PARTICULAR', tonelaje: '', ramv: '',
        }
        const contractDefaults = {
            tipoAntecedente: 'compraventa', formaPago: 'transferencia',
            tieneObservaciones: false, observacionesTexto: '',
            cuvNumero: '', cuvFecha: '', fechaInscripcion: '', matriculaVigencia: '',
        }
        const migrated = {
            ...contractDefaults,
            ...raw,
            vehiculo: { ...vehiculoDefaults, ...raw?.vehiculo },
            comprador: { ...personaDefaults, ...raw?.comprador },
            vendedor: { ...personaDefaults, ...raw?.vendedor },
        }

        // Parse and validate data
        const validated = contratoVehicularSchema.safeParse(migrated)
        if (!validated.success) {
            console.error('[generateContractDocx] validation errors:', validated.error.issues)
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
