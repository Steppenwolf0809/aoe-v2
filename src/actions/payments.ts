'use server'

import { createClient } from '@/lib/supabase/server'
import {
  createPaymentLink,
  checkTransactionStatus,
  generateShortTransactionId,
} from '@/lib/payphone'
import { getContract, updateContractStatus } from './contracts'
import { generateContractPdf } from './pdf'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { isPaymentApproved } from '@/lib/validations/payment'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Initiate payment with PayPhone Links API
 * Returns URL for user to complete payment
 * Works for both authenticated and anonymous contracts
 */
export async function initiatePayment(
  contractIdOrFormData: string | FormData
): Promise<ActionResult<{ paymentUrl: string; clientTransactionId: string }>> {
  try {
    const contractId =
      typeof contractIdOrFormData === 'string'
        ? contractIdOrFormData
        : (contractIdOrFormData.get('contractId') as string | null)

    const deliveryEmail =
      typeof contractIdOrFormData === 'string'
        ? undefined
        : (contractIdOrFormData.get('deliveryEmail') as string | null)

    if (typeof contractId !== 'string' || !contractId) {
      return { success: false, error: 'ID de contrato invalido' }
    }

    const supabase = await createClient()

    // Get contract (works for both auth and anon)
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contractId)
      .single()

    if (fetchError || !contract) {
      return { success: false, error: 'Contrato no encontrado' }
    }

    // Verify contract is in DRAFT status
    if (contract.status !== 'DRAFT') {
      return {
        success: false,
        error: `Contrato en estado ${contract.status}, no se puede pagar`,
      }
    }

    // Generate short transaction ID (max 15 chars for PayPhone Links)
    const clientTransactionId = generateShortTransactionId()

    // Precio incluye IVA 15% → descomponemos base + impuesto
    // Regla PayPhone: amount = amountWithoutTax + amountWithTax + tax + service + tip
    const totalCents = Math.round(PRECIO_CONTRATO_BASICO * 100) // $11.99 → 1199
    const baseCents = Math.floor(totalCents / 1.15) // base imponible
    const taxCents = totalCents - baseCents // IVA

    // NOTE: responseUrl is configured in PayPhone dashboard (app type "Web"),
    // not in the API request body. PayPhone appends ?id=TX&clientTransactionId=AOExx
    const paymentResponse = await createPaymentLink({
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: baseCents,
      tax: taxCents,
      service: 0,
      tip: 0,
      clientTransactionId,
      currency: 'USD',
      reference: 'Contrato Vehicular - AOE',
      oneTime: true,
      expireIn: 24, // Link expira en 24 horas
      additionalData: contractId, // Guardamos el contractId para el callback
    })

    // Store clientTransactionId + delivery email in contract for callback lookup
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()
    await adminSupabase
      .from('contracts')
      .update({
        status: 'PENDING_PAYMENT',
        payment_id: clientTransactionId, // Temporal: se sobreescribe con el ID real de PayPhone al confirmar
        ...(deliveryEmail ? { delivery_email: deliveryEmail } : {}),
      })
      .eq('id', contractId)

    return {
      success: true,
      data: {
        paymentUrl: paymentResponse.paymentUrl,
        clientTransactionId,
      },
    }
  } catch (error) {
    console.error('[initiatePayment]', error)
    const message =
      error instanceof Error ? error.message : 'Error al iniciar pago'

    if (process.env.NODE_ENV !== 'production' && /PayPhone credentials/i.test(message)) {
      return {
        success: false,
        error:
          `${message} En desarrollo puedes generar el PDF sin pago usando POST /api/dev/test-contract con { contractId }.`,
      }
    }

    return {
      success: false,
      error: message,
    }
  }
}

/**
 * Verify payment and process contract (generate PDF + send email)
 * Called from the payment callback page after PayPhone redirects back
 *
 * PayPhone redirects to: /contratos/pago/callback?id=PAYPHONE_TX_ID&clientTransactionId=AOExxx
 * We look up the contract by the clientTransactionId stored in payment_id
 */
export async function verifyAndProcessPayment(
  payphoneTransactionId: string,
  clientTransactionId: string
): Promise<ActionResult<{ contractId: string; pdfGenerated: boolean }>> {
  try {
    // Look up contract by clientTransactionId
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()

    const { data: contract, error: lookupError } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('payment_id', clientTransactionId)
      .eq('status', 'PENDING_PAYMENT')
      .single()

    if (lookupError || !contract) {
      console.error('[verifyAndProcessPayment] Contract lookup failed:', lookupError)
      return { success: false, error: 'Contrato no encontrado para esta transaccion' }
    }

    const contractId = contract.id

    // If already processed, return success
    if (contract.status === 'GENERATED' || contract.status === 'DOWNLOADED' || contract.status === 'PAID') {
      return {
        success: true,
        data: { contractId, pdfGenerated: true },
      }
    }

    // Check transaction status with PayPhone
    const statusResponse = await checkTransactionStatus(payphoneTransactionId)

    // Verify payment was approved
    if (!isPaymentApproved(statusResponse.statusCode)) {
      return {
        success: false,
        error: `Pago no aprobado. Estado: ${statusResponse.status || statusResponse.transactionStatus || 'desconocido'}`,
      }
    }

    // Update contract with real PayPhone transaction ID
    await updateContractStatus(contractId, {
      status: 'PAID',
      payment_id: statusResponse.transactionId,
      amount: PRECIO_CONTRATO_BASICO,
    })

    // Generate PDF (this also sends email)
    const pdfResult = await generateContractPdf(contractId)
    if (!pdfResult.success) {
      return {
        success: false,
        error: `Pago exitoso pero fallo la generacion del PDF: ${pdfResult.error}`,
      }
    }

    return {
      success: true,
      data: { contractId, pdfGenerated: true },
    }
  } catch (error) {
    console.error('[verifyAndProcessPayment]', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al procesar pago',
    }
  }
}

/**
 * @deprecated Use verifyAndProcessPayment instead
 * Kept for backward compatibility with old callback flow
 */
export async function confirmAndProcessPayment(
  contractId: string,
  clientTransactionId: string,
  payphoneTransactionId: string
): Promise<ActionResult<{ contractId: string; pdfGenerated: boolean }>> {
  return verifyAndProcessPayment(payphoneTransactionId, clientTransactionId)
}
