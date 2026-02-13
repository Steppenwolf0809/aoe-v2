import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkTransactionStatus } from '@/lib/payphone'
import { isPaymentApproved } from '@/lib/validations/payment'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { generateContractPdfAdmin } from '@/actions/pdf'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

// PayPhone WAF blocks Vercel US IPs → run from São Paulo
export const preferredRegion = 'gru1'

interface PaymentCallbackPageProps {
  searchParams: Promise<{
    id?: string
    clientTransactionId?: string
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
  const pdfResult = await generateContractPdfAdmin(contractId)
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
  const clientTransactionId = params.clientTransactionId
  const transactionId =
    params.id || params.transactionId || params.transaction_id || params.payphone_id

  if (!clientTransactionId || !transactionId) {
    return <ErrorState message="Parametros de pago invalidos." />
  }

  let redirectPath: string | null = null
  let errorMessage: string | null = null

  try {
    // Check transaction status with PayPhone
    const statusResponse = await checkTransactionStatus(transactionId)

    if (!isPaymentApproved(statusResponse.statusCode)) {
      errorMessage = `Pago no aprobado. Estado: ${statusResponse.status || statusResponse.transactionStatus || 'desconocido'}`
    } else {
      const adminSupabase = createAdminClient()

      // Look up contract by clientTransactionId stored in payment_id
      const { data: contract, error: fetchError } = await adminSupabase
        .from('contracts')
        .select('id, status, download_token')
        .eq('payment_id', clientTransactionId)
        .single()

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
      } else if (contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') {
        // Already processed — redirect to success
        redirectPath = `/contratos/pago/exito?token=${contract.download_token}`
      } else if (contract.status === 'PAID') {
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
    errorMessage =
      error instanceof Error ? error.message : 'Error al procesar el pago.'
  }

  if (redirectPath) {
    redirect(redirectPath)
  }

  return <ErrorState message={errorMessage || 'Error al procesar el pago.'} />
}
