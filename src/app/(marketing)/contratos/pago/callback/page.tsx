import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'
import { confirmPayment } from '@/lib/payphone'
import { isPaymentApproved } from '@/lib/validations/payment'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { generateContractPdfAdmin } from '@/actions/pdf'
import { notifyN8NContractPaid } from '@/lib/n8n'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

// PayPhone WAF blocks Vercel US IPs → run from São Paulo
export const preferredRegion = 'gru1'

interface PaymentCallbackPageProps {
  searchParams: Promise<{
    id?: string
    clientTransactionId?: string
    cancelled?: string
    // Legacy params (backward compat)
    contractId?: string
    transactionId?: string
    transaction_id?: string
    payphone_id?: string
  }>
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardContent className="p-8 text-center space-y-4">
          <XCircle className="w-16 h-16 mx-auto text-red-500" />
          <h1 className="text-xl font-semibold text-text-primary">
            Error al procesar el pago
          </h1>
          <p className="text-sm text-text-secondary">{message}</p>
          <Link
            href="/contratos/vehicular"
            className="inline-flex text-sm text-accent-primary hover:underline"
          >
            Volver a intentar
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Verify payment with PayPhone, generate PDF, send email, redirect to success.
 * No authentication required — the payment token is the authorization.
 */
async function processPaymentAndGeneratePdf(contractId: string): Promise<string> {
  console.log('[PayPhone Callback] Generating PDF for contract:', contractId)
  const pdfResult = await generateContractPdfAdmin(contractId)
  console.log('[PayPhone Callback] PDF result:', JSON.stringify({
    success: pdfResult.success,
    ...(pdfResult.success ? { downloadToken: pdfResult.data.downloadToken } : { error: pdfResult.error }),
  }))

  // Fire-and-forget: notify n8n about the sale for CRM/analytics
  const adminSupabase = createAdminClient()
  const { data: contractData } = await adminSupabase
    .from('contracts')
    .select('delivery_email, contract_type, amount')
    .eq('id', contractId)
    .maybeSingle()

  if (contractData?.delivery_email) {
    notifyN8NContractPaid({
      contractId,
      email: contractData.delivery_email,
      type: contractData.contract_type ?? 'vehicular',
      amount: contractData.amount ?? PRECIO_CONTRATO_BASICO,
      downloadToken: pdfResult.success ? pdfResult.data.downloadToken : undefined,
    }).catch(() => {})
  }

  if (pdfResult.success) {
    return `/contratos/pago/exito?token=${pdfResult.data.downloadToken}`
  }
  // Payment OK but PDF failed — still show success with pending
  return `/contratos/pago/exito?contractId=${contractId}&pending=true`
}

export default async function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  const params = await searchParams

  // Log all received params for debugging
  console.log('[PayPhone Callback] Received params:', JSON.stringify(params))

  // Handle cancellation redirect
  if (params.cancelled === 'true') {
    return <ErrorState message="El pago fue cancelado. Puedes intentar nuevamente." />
  }

  const clientTransactionId = params.clientTransactionId
  const transactionId =
    params.id || params.transactionId || params.transaction_id || params.payphone_id

  if (!clientTransactionId || !transactionId) {
    console.error('[PayPhone Callback] Missing params. id:', params.id, 'clientTransactionId:', params.clientTransactionId)
    return <ErrorState message="Parametros de pago invalidos. Verifica que PayPhone haya redirigido correctamente." />
  }

  let redirectPath: string | null = null
  let errorMessage: string | null = null

  try {
    // Confirm payment with PayPhone Button V2 API (must be done within 5 min)
    console.log('[PayPhone Callback] Confirming payment. id:', transactionId, 'clientTxId:', clientTransactionId)
    const statusResponse = await confirmPayment({
      id: transactionId,
      clientTxId: clientTransactionId,
    })
    console.log('[PayPhone Callback] Confirm response:', JSON.stringify({ statusCode: statusResponse.statusCode, status: statusResponse.status, transactionId: statusResponse.transactionId }))

    if (!isPaymentApproved(statusResponse.statusCode)) {
      errorMessage = `Pago no aprobado. Estado: ${statusResponse.status || statusResponse.transactionStatus || 'desconocido'}`
    } else {
      const adminSupabase = createAdminClient()

      // Look up contract by clientTransactionId stored in payment_id
      // Use .limit(1) instead of .single() to handle edge cases with duplicate payment_ids
      console.log('[PayPhone Callback] Looking up contract with payment_id:', clientTransactionId)
      const { data: contracts, error: fetchError } = await adminSupabase
        .from('contracts')
        .select('id, status, download_token')
        .eq('payment_id', clientTransactionId)
        .order('created_at', { ascending: false })
        .limit(1)

      const contract = contracts?.[0] ?? null
      console.log('[PayPhone Callback] Contract lookup result:', JSON.stringify({ contract, fetchError: fetchError?.message, totalFound: contracts?.length ?? 0 }))

      if (fetchError || !contract) {
        // Fallback: try legacy contractId param
        const legacyContractId = params.contractId
        if (legacyContractId) {
          const { data: legacyContract, error: legacyError } = await adminSupabase
            .from('contracts')
            .select('id, status')
            .eq('id', legacyContractId)
            .single()

          if (!legacyError && legacyContract) {
            await adminSupabase
              .from('contracts')
              .update({
                status: 'PAID',
                payment_id: statusResponse.transactionId,
                amount: PRECIO_CONTRATO_BASICO,
              })
              .eq('id', legacyContractId)

            redirectPath = await processPaymentAndGeneratePdf(legacyContractId)
          } else {
            errorMessage = 'Contrato no encontrado.'
          }
        } else {
          errorMessage = 'Contrato no encontrado para esta transaccion.'
        }
      } else if ((contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') && contract.download_token) {
        // Already processed and has valid token — redirect to success
        redirectPath = `/contratos/pago/exito?token=${contract.download_token}`
      } else if (contract.status === 'PAID' || contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') {
        // PAID but no PDF, or GENERATED/DOWNLOADED but missing download_token — (re)generate
        // Already PAID but PDF not generated — try now
        redirectPath = await processPaymentAndGeneratePdf(contract.id)
      } else {
        // Update contract to PAID with real PayPhone transaction ID
        const { error: updateError } = await adminSupabase
          .from('contracts')
          .update({
            status: 'PAID',
            payment_id: statusResponse.transactionId,
            amount: PRECIO_CONTRATO_BASICO,
          })
          .eq('id', contract.id)

        if (updateError) {
          errorMessage = updateError.message
        } else {
          redirectPath = await processPaymentAndGeneratePdf(contract.id)
        }
      }
    }
  } catch (error) {
    console.error('[PayPhone Callback] Error:', error)
    errorMessage =
      error instanceof Error ? error.message : 'Error al procesar el pago.'
  }

  if (redirectPath) {
    redirect(redirectPath)
  }

  return <ErrorState message={errorMessage || 'Error al procesar el pago.'} />
}
