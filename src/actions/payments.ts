'use server'

import { createClient } from '@/lib/supabase/server'
import {
  createPaymentButton,
  generateShortTransactionId,
} from '@/lib/payphone'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Initiate payment with PayPhone Button/Prepare API (redirect flow).
 * Returns URL for user to complete payment.
 * After payment, PayPhone redirects to responseUrl with ?id=XX&clientTransactionId=XX
 * The callback page must call Confirm within 5 minutes or the payment is reversed.
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

    // PayPhone appends ?id=TX&clientTransactionId=AOExx to responseUrl after payment
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com').replace(/\/+$/, '')
    const paymentResponse = await createPaymentButton({
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: baseCents,
      tax: taxCents,
      service: 0,
      tip: 0,
      clientTransactionId,
      currency: 'USD',
      reference: 'Contrato Vehicular - AOE',
      responseUrl: `${appUrl}/contratos/pago/callback`,
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
 * @deprecated Legacy function kept for backward compat with dashboard payment page.
 * The main callback page now handles confirm + PDF generation directly.
 */
export async function confirmAndProcessPayment(
  _contractId: string,
  _clientTransactionId: string,
  _payphoneTransactionId: string
): Promise<ActionResult<{ contractId: string; pdfGenerated: boolean }>> {
  return {
    success: false,
    error: 'Este flujo de pago ya no esta disponible. Use el flujo de callback.',
  }
}
