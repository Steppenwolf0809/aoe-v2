'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Download, Loader2, FileText } from 'lucide-react'
import { initiatePayment } from '@/actions/payments'
import { getContractDownloadUrl } from '@/actions/pdf'
import Link from 'next/link'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { formatCurrency } from '@/lib/utils'

interface ContractActionsProps {
  contractId: string
  status: string
  downloadToken?: string
}

export function ContractActions({
  contractId,
  status,
  downloadToken,
}: ContractActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await initiatePayment(contractId)

      if (result.success) {
        // Redirect to PayPhone payment page
        window.location.href = result.data.paymentUrl
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('[handlePayment]', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al iniciar el pago'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadToken) {
      setError('Token de descarga no disponible')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await getContractDownloadUrl(contractId, downloadToken)

      if (result.success) {
        // Open signed URL in new tab
        window.open(result.data.signedUrl, '_blank')
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('[handleDownload]', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al descargar el contrato'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // DRAFT status: Show payment button
  if (status === 'DRAFT' || status === 'PENDING_PAYMENT') {
    return (
      <div className="space-y-3">
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pagar y generar contrato ({formatCurrency(PRECIO_CONTRATO_BASICO)})
            </>
          )}
        </Button>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <p className="text-xs text-text-tertiary">
          El pago se procesa de forma segura con PayPhone
        </p>
      </div>
    )
  }

  // PAID status: Payment processed, PDF being generated
  if (status === 'PAID') {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm text-text-secondary">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando contrato...
        </div>
      </div>
    )
  }

  // GENERATED or DOWNLOADED status: Show download button
  if (status === 'GENERATED' || status === 'DOWNLOADED') {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleDownload}
            disabled={isLoading}
            variant="primary"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Descargando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link href={`/dashboard/contratos/${contractId}`}>
              <FileText className="mr-2 h-4 w-4" />
              Ver detalles
            </Link>
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {status === 'GENERATED' && (
          <p className="text-xs text-text-tertiary">
            También enviamos el contrato por email
          </p>
        )}
      </div>
    )
  }

  return null
}
