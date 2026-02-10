import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase/admin'
import { confirmPayment } from '@/lib/payphone'
import { isPaymentApproved } from '@/lib/validations/payment'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { XCircle } from 'lucide-react'

interface PaymentCallbackPageProps {
  searchParams: Promise<{
    id?: string
    clientTransactionId?: string
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

export default async function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  const params = await searchParams
  const contractId = params.id
  const clientTransactionId = params.clientTransactionId
  const transactionId =
    params.transactionId || params.transaction_id || params.payphone_id

  if (!contractId || !clientTransactionId || !transactionId) {
    return <ErrorState message="Parametros de pago invalidos." />
  }

  let redirectPath: string | null = null
  let errorMessage: string | null = null

  try {
    const confirmResponse = await confirmPayment({
      id: transactionId,
      clientTxId: clientTransactionId,
    })

    if (!isPaymentApproved(confirmResponse.statusCode)) {
      errorMessage = `Pago no aprobado. Estado: ${confirmResponse.status}`
    } else {
      const adminSupabase = createAdminClient()
      const { data: contract, error: fetchError } = await adminSupabase
        .from('contracts')
        .select('id, user_id')
        .eq('id', contractId)
        .single()

      if (fetchError || !contract) {
        errorMessage = 'Contrato no encontrado.'
      } else {
        const { error: updateError } = await adminSupabase
          .from('contracts')
          .update({
            status: 'PAID',
            payment_id: confirmResponse.transactionId,
            amount: PRECIO_CONTRATO_BASICO,
          })
          .eq('id', contractId)

        if (updateError) {
          errorMessage = updateError.message
        } else {
          redirectPath = contract.user_id
            ? `/dashboard/contratos/${contractId}`
            : `/auth/claim-contract?contractId=${contractId}`
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
