'use server'

import { createClient } from '@/lib/supabase/server'
import { preparePayment, confirmPayment } from '@/lib/payphone'
import { getContract, updateContractStatus } from './contracts'
import { generateContractPdf } from './pdf'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { isPaymentApproved } from '@/lib/validations/payment'
import { headers } from 'next/headers'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Initiate payment with PayPhone
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
        : contractIdOrFormData.get('contractId')

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

    // Get email from user or contract
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const email = user?.email || contract.email || 'noreply@example.com'

    // Generate client transaction ID
    const clientTransactionId = `${contractId}-${Date.now()}`

    // Get app URL from env
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || (await headers()).get('origin')
    if (!appUrl) {
      return { success: false, error: 'App URL no configurada' }
    }

    // Prepare payment with PayPhone
    const amount = PRECIO_CONTRATO_BASICO // $9.99
    const amountInCents = Math.round(amount * 100)

    const paymentResponse = await preparePayment({
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      clientTransactionId,
      currency: 'USD',
      email,
      responseUrl: `${appUrl}/contratos/pago/callback?id=${contractId}&clientTransactionId=${clientTransactionId}`,
      lang: 'es',
      tip: 0,
      tax: 0,
    })

    // Store clientTransactionId in contract metadata for later verification
    // Use admin client to bypass RLS
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = createAdminClient()
    await adminSupabase
      .from('contracts')
      .update({ status: 'PENDING_PAYMENT' })
      .eq('id', contractId)

    return {
      success: true,
      data: {
        paymentUrl: paymentResponse.payWithCard,
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
 * Confirm payment and process contract (generate PDF + send email)
 * Called from the payment callback page
 */
export async function confirmAndProcessPayment(
  contractId: string,
  clientTransactionId: string,
  payphoneTransactionId: string
): Promise<ActionResult<{ contractId: string; pdfGenerated: boolean }>> {
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

    // Verify contract is in correct status
    if (contract.status !== 'PENDING_PAYMENT' && contract.status !== 'DRAFT') {
      // If already processed, return success
      if (contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') {
        return {
          success: true,
          data: { contractId, pdfGenerated: true },
        }
      }
      return {
        success: false,
        error: `Contrato en estado ${contract.status}, no se puede procesar`,
      }
    }

    // Confirm payment with PayPhone
    const confirmResponse = await confirmPayment({
      id: payphoneTransactionId,
      clientTxId: clientTransactionId,
    })

    // Verify payment was approved
    if (!isPaymentApproved(confirmResponse.statusCode)) {
      return {
        success: false,
        error: `Pago no aprobado. Estado: ${confirmResponse.status}`,
      }
    }

    // Update contract with payment info
    await updateContractStatus(contractId, {
      status: 'PAID',
      payment_id: confirmResponse.transactionId,
      amount: PRECIO_CONTRATO_BASICO,
    })

    // Generate PDF (this also sends email)
    const pdfResult = await generateContractPdf(contractId)
    if (!pdfResult.success) {
      // Payment was successful but PDF generation failed
      // Contract is in PAID state, user can retry PDF generation
      return {
        success: false,
        error: `Pago exitoso pero fallo la generación del PDF: ${pdfResult.error}`,
      }
    }

    return {
      success: true,
      data: { contractId, pdfGenerated: true },
    }
  } catch (error) {
    console.error('[confirmAndProcessPayment]', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al procesar pago',
    }
  }
}
