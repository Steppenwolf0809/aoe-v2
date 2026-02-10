'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PaymentStatus } from '@/components/contracts/payment-status'
import { confirmAndProcessPayment } from '@/actions/payments'

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  )
  const [error, setError] = useState<string | undefined>()
  const [contractId, setContractId] = useState<string | undefined>()

  useEffect(() => {
    const processPayment = async () => {
      const id = searchParams.get('id')
      const clientTransactionId = searchParams.get('clientTransactionId')
      const payphoneTransactionId = searchParams.get('id') // PayPhone redirects with ?id=transaction_id

      if (!id || !clientTransactionId) {
        setStatus('error')
        setError('Parámetros de pago inválidos')
        return
      }

      setContractId(id)

      // In PayPhone redirect, the transaction ID comes in different params
      // We need to get it from the URL
      const urlParams = new URLSearchParams(window.location.search)
      const transactionId =
        urlParams.get('transactionId') || urlParams.get('id') || ''

      if (!transactionId) {
        setStatus('error')
        setError('ID de transacción no encontrado')
        return
      }

      try {
        const result = await confirmAndProcessPayment(
          id,
          clientTransactionId,
          transactionId
        )

        if (result.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setError(result.error)
        }
      } catch (err) {
        console.error('[PaymentCallback]', err)
        setStatus('error')
        setError(
          err instanceof Error
            ? err.message
            : 'Error al procesar el pago'
        )
      }
    }

    processPayment()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-12">
      <PaymentStatus status={status} error={error} contractId={contractId} />
    </div>
  )
}
