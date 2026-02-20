'use server'

import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { getContract, updateContractStatus } from './contracts'
import { ContratoVehicularPdf } from '@/lib/pdf/contrato-vehicular'
import { uploadContractPdf, getContractSignedUrl } from '@/lib/storage'
import { sha256 } from '@/lib/hash'
import { ContratoGeneradoEmail } from '@/emails/contrato-generado'
import { Resend } from 'resend'
import crypto from 'crypto'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Generate contract PDF, upload to storage, and send email
 */
export async function generateContractPdf(
  contractId: string
): Promise<ActionResult<{ pdfUrl: string; downloadToken: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Get contract
    const contractResult = await getContract(contractId)
    if (!contractResult.success) {
      return { success: false, error: contractResult.error }
    }

    const contract = contractResult.data

    // Verify contract is paid (DOWNLOADED also valid — may need token regeneration)
    if (!['PAID', 'GENERATED', 'DOWNLOADED'].includes(contract.status)) {
      return {
        success: false,
        error: `Contrato debe estar pagado. Estado actual: ${contract.status}`,
      }
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      ContratoVehicularPdf({ contrato: contract.data })
    )

    // Calculate hash for integrity
    const pdfHash = sha256(Buffer.from(pdfBuffer))

    // Upload to Supabase Storage
    const { path, publicUrl } = await uploadContractPdf(
      Buffer.from(pdfBuffer),
      contractId
    )

    // Generate download token (valid for 24h)
    const downloadToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Update contract with PDF info
    await updateContractStatus(contractId, {
      status: 'GENERATED',
      pdf_url: publicUrl,
      pdf_hash: pdfHash,
      download_token: downloadToken,
      download_token_expires_at: expiresAt.toISOString(),
    })

    // Send email with PDF attachment
    if (user.email && process.env.RESEND_API_KEY) {
      try {
        const vehicleData = contract.data.vehiculo
        const clientName = contract.data.partes.comprador.nombres

        await resend.emails.send({
          from: 'Abogados Online Ecuador <contratos@abogadosonlineecuador.com>',
          to: user.email,
          subject: `Tu contrato de compraventa - ${vehicleData.placa}`,
          react: ContratoGeneradoEmail({
            clientName,
            vehiclePlaca: vehicleData.placa,
            vehicleMarca: vehicleData.marca,
            vehicleModelo: vehicleData.modelo,
            downloadUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/contracts/${contractId}/download?token=${downloadToken}`,
          }),
          attachments: [
            {
              filename: `contrato-${vehicleData.placa}.pdf`,
              content: pdfBuffer,
            },
          ],
        })
      } catch (emailError) {
        console.error('[generateContractPdf] Email error:', emailError)
        // Don't fail if email fails, PDF was still generated
      }
    }

    return {
      success: true,
      data: {
        pdfUrl: publicUrl,
        downloadToken,
      },
    }
  } catch (error) {
    console.error('[generateContractPdf]', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al generar PDF',
    }
  }
}

/**
 * Generate contract PDF without requiring authentication.
 * Used by the payment callback to generate PDFs for anonymous contracts.
 * Sends email to the delivery_email stored on the contract (no PDF attachment).
 */
export async function generateContractPdfAdmin(
  contractId: string
): Promise<ActionResult<{ pdfUrl: string; downloadToken: string }>> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()

    // Get contract with admin client (bypass RLS)
    const { data: contract, error: fetchError } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()

    if (fetchError || !contract) {
      return { success: false, error: 'Contrato no encontrado' }
    }

    // Verify contract is paid (DOWNLOADED also valid — may need token regeneration)
    if (!['PAID', 'GENERATED', 'DOWNLOADED'].includes(contract.status)) {
      return {
        success: false,
        error: `Contrato debe estar pagado. Estado actual: ${contract.status}`,
      }
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
      ContratoVehicularPdf({ contrato: contract.data })
    )

    // Calculate hash for integrity
    const pdfHash = sha256(Buffer.from(pdfBuffer))

    // Upload to Supabase Storage
    const { publicUrl } = await uploadContractPdf(
      Buffer.from(pdfBuffer),
      contractId
    )

    // Generate download token (valid for 7 days)
    const downloadToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Update contract with PDF info (using admin client)
    const { error: updateError } = await adminSupabase
      .from('contracts')
      .update({
        status: 'GENERATED',
        pdf_url: publicUrl,
        pdf_hash: pdfHash,
        download_token: downloadToken,
        download_token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', contractId)

    if (updateError) {
      console.error('[generateContractPdfAdmin] Update error:', updateError)
      return { success: false, error: `Error actualizando contrato: ${updateError.message}` }
    }

    // Verify the token was saved correctly
    const { data: verifyContract } = await adminSupabase
      .from('contracts')
      .select('download_token, status')
      .eq('id', contractId)
      .single()
    console.log('[generateContractPdfAdmin] Verified contract after update:', JSON.stringify({
      contractId,
      savedToken: verifyContract?.download_token,
      expectedToken: downloadToken,
      status: verifyContract?.status,
      tokensMatch: verifyContract?.download_token === downloadToken,
    }))

    // Send email with download link (no PDF attachment to save bandwidth)
    const deliveryEmail = contract.delivery_email || contract.email
    if (deliveryEmail && process.env.RESEND_API_KEY) {
      try {
        const contractData = contract.data as Record<string, any>
        const vehicleData = contractData?.vehiculo || contractData?.partes?.vehiculo
        const clientName =
          contractData?.partes?.comprador?.nombres ||
          contractData?.comprador?.nombres ||
          'Cliente'
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com').replace(/\/+$/, '')

        await resend.emails.send({
          from: 'Abogados Online Ecuador <contratos@abogadosonlineecuador.com>',
          to: deliveryEmail,
          subject: `Tu contrato de compraventa - ${vehicleData?.placa || 'Vehicular'}`,
          react: ContratoGeneradoEmail({
            clientName,
            vehiclePlaca: vehicleData?.placa || '',
            vehicleMarca: vehicleData?.marca || '',
            vehicleModelo: vehicleData?.modelo || '',
            downloadUrl: `${appUrl}/api/contracts/${contractId}/download?token=${downloadToken}`,
          }),
        })
      } catch (emailError) {
        console.error('[generateContractPdfAdmin] Email error:', emailError)
      }
    }

    return {
      success: true,
      data: { pdfUrl: publicUrl, downloadToken },
    }
  } catch (error) {
    console.error('[generateContractPdfAdmin]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al generar PDF',
    }
  }
}

/**
 * Get signed download URL for contract PDF
 * Validates download token and expiry
 */
export async function getContractDownloadUrl(
  contractId: string,
  downloadToken: string
): Promise<ActionResult<{ signedUrl: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    // Get contract
    const contractResult = await getContract(contractId)
    if (!contractResult.success) {
      return { success: false, error: contractResult.error }
    }

    const contract = contractResult.data

    // Verify contract has PDF
    if (!contract.pdf_url) {
      return { success: false, error: 'Contrato no tiene PDF generado' }
    }

    // Verify download token
    if (contract.download_token !== downloadToken) {
      return { success: false, error: 'Token de descarga inválido' }
    }

    // Verify token not expired
    const expiresAt = new Date(contract.download_token_expires_at)
    if (expiresAt < new Date()) {
      return { success: false, error: 'Token de descarga expirado' }
    }

    // Get signed URL
    const signedUrl = await getContractSignedUrl(contractId)

    // Update status to DOWNLOADED (only if not already)
    if (contract.status === 'GENERATED') {
      await updateContractStatus(contractId, {
        status: 'DOWNLOADED',
      })
    }

    return {
      success: true,
      data: { signedUrl },
    }
  } catch (error) {
    console.error('[getContractDownloadUrl]', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener URL de descarga',
    }
  }
}
