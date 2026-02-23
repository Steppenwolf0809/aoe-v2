'use server'

import crypto from 'crypto'
import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { contratoVehicularSchema } from '@/lib/validations/contract'
import { generateContratoVehicularDocx } from '@/lib/docx/contrato-vehicular-docx'
import { ContratoGeneradoEmail } from '@/emails/contrato-generado'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

function buildDocxDownloadUrl(contractId: string, downloadToken: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com').replace(/\/+$/, '')
  return `${appUrl}/api/contracts/${contractId}/download-docx?token=${downloadToken}`
}

function isTokenExpired(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false
  return new Date(isoDate) < new Date()
}

async function maybeSendDocxReadyEmail(
  contract: Record<string, any>,
  contractId: string,
  downloadToken: string,
): Promise<void> {
  if (!resend) return

  const deliveryEmail = contract.delivery_email || contract.email
  if (!deliveryEmail) return

  const contractData = contract.data as Record<string, any>
  const vehicleData = contractData?.vehiculo || contractData?.partes?.vehiculo || {}
  const clientName =
    contractData?.comprador?.nombres ||
    contractData?.partes?.comprador?.nombres ||
    'Cliente'

  await resend.emails.send({
    from: 'Abogados Online Ecuador <contratos@abogadosonlineecuador.com>',
    to: deliveryEmail,
    subject: `Tu contrato de compraventa - ${vehicleData?.placa || 'Vehicular'}`,
    react: ContratoGeneradoEmail({
      clientName,
      vehiclePlaca: vehicleData?.placa || '',
      vehicleMarca: vehicleData?.marca || '',
      vehicleModelo: vehicleData?.modelo || '',
      downloadUrl: buildDocxDownloadUrl(contractId, downloadToken),
      documentFormat: 'Word (.docx)',
    }),
  })
}

/**
 * Prepares a contract for DOCX download (without generating PDF).
 * Creates or refreshes download token and sends email with DOCX link.
 */
export async function prepareContractDocxDeliveryAdmin(
  contractId: string,
): Promise<ActionResult<{ downloadToken: string }>> {
  try {
    const adminSupabase = createAdminClient()

    const { data: contract, error: fetchError } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()

    if (fetchError || !contract) {
      return { success: false, error: 'Contrato no encontrado' }
    }

    if (!['PAID', 'GENERATED', 'DOWNLOADED'].includes(contract.status)) {
      return {
        success: false,
        error: `Contrato debe estar pagado. Estado actual: ${contract.status}`,
      }
    }

    if (contract.download_token && !isTokenExpired(contract.download_token_expires_at)) {
      if (contract.status === 'PAID') {
        await adminSupabase
          .from('contracts')
          .update({ status: 'GENERATED' })
          .eq('id', contractId)
      }

      return { success: true, data: { downloadToken: contract.download_token } }
    }

    const downloadToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error: updateError } = await adminSupabase
      .from('contracts')
      .update({
        status: 'GENERATED',
        download_token: downloadToken,
        download_token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', contractId)

    if (updateError) {
      return { success: false, error: `Error actualizando contrato: ${updateError.message}` }
    }

    try {
      await maybeSendDocxReadyEmail(contract as Record<string, any>, contractId, downloadToken)
    } catch (emailError) {
      console.error('[prepareContractDocxDeliveryAdmin] Email error:', emailError)
    }

    return { success: true, data: { downloadToken } }
  } catch (error) {
    console.error('[prepareContractDocxDeliveryAdmin]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al preparar descarga DOCX',
    }
  }
}

/**
 * Generate and return a .docx contract file as a base64 string.
 * The client will convert base64 -> Blob -> download trigger.
 */
export async function generateContractDocx(
  contractId: string,
  downloadToken: string,
): Promise<ActionResult<{ base64: string; filename: string }>> {
  try {
    const adminSupabase = createAdminClient()

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

    if (isTokenExpired(contract.download_token_expires_at)) {
      return { success: false, error: 'Token de descarga expirado' }
    }

    const raw = contract.data as Record<string, any>
    const personaDefaults = { sexo: 'M', nacionalidad: 'ecuatoriana', tipoDocumento: 'cedula' }
    const vehiculoDefaults = {
      tipo: '',
      cilindraje: 1,
      carroceria: '',
      clase: '',
      pais: '',
      combustible: '',
      pasajeros: 5,
      servicio: 'USO PARTICULAR',
      tonelaje: '',
    }
    const contractDefaults = {
      tipoAntecedente: 'compraventa',
      formaPago: 'transferencia',
      tieneObservaciones: false,
      observacionesTexto: '',
      cuvNumero: '',
      cuvFecha: '',
      fechaInscripcion: '',
      matriculaVigencia: '',
    }

    const migrated = {
      ...contractDefaults,
      ...raw,
      vehiculo: { ...vehiculoDefaults, ...raw?.vehiculo },
      comprador: { ...personaDefaults, ...raw?.comprador },
      vendedor: { ...personaDefaults, ...raw?.vendedor },
    }

    const validated = contratoVehicularSchema.safeParse(migrated)
    if (!validated.success) {
      console.error('[generateContractDocx] validation errors:', validated.error.issues)
      return { success: false, error: 'Datos del contrato inválidos' }
    }

    const buffer = await generateContratoVehicularDocx(validated.data)
    const base64 = buffer.toString('base64')

    const vendedorApellido = validated.data.vendedor.nombres.split(' ').pop() ?? 'vendedor'
    const compradorApellido = validated.data.comprador.nombres.split(' ').pop() ?? 'comprador'
    const filename = `contrato-compraventa-${vendedorApellido}-${compradorApellido}.docx`.toLowerCase()

    if (contract.status === 'GENERATED') {
      await adminSupabase
        .from('contracts')
        .update({ status: 'DOWNLOADED' })
        .eq('id', contractId)
    }

    return { success: true, data: { base64, filename } }
  } catch (err) {
    console.error('[generateContractDocx]', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error al generar el documento',
    }
  }
}
