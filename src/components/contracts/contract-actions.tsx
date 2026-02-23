'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2, FileText, FileDown } from 'lucide-react'
import { initiatePayment } from '@/actions/payments'
import { generateContractDocx } from '@/actions/docx'
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
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [isLoadingDocx, setIsLoadingDocx] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoadingPayment(true)
    setError(null)

    try {
      const result = await initiatePayment(contractId)

      if (result.success) {
        window.location.href = result.data.paymentUrl
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('[handlePayment]', err)
      setError(err instanceof Error ? err.message : 'Error al iniciar el pago')
    } finally {
      setIsLoadingPayment(false)
    }
  }

  const handleDownloadDocx = async () => {
    if (!downloadToken) {
      setError('Token de descarga no disponible')
      return
    }

    setIsLoadingDocx(true)
    setError(null)

    try {
      const result = await generateContractDocx(contractId, downloadToken)

      if (result.success) {
        const binary = atob(result.data.base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.data.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('[handleDownloadDocx]', err)
      setError(err instanceof Error ? err.message : 'Error al generar el documento Word')
    } finally {
      setIsLoadingDocx(false)
    }
  }

  if (status === 'DRAFT' || status === 'PENDING_PAYMENT') {
    return (
      <div className="space-y-3">
        <Button
          onClick={handlePayment}
          disabled={isLoadingPayment}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {isLoadingPayment ? (
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
        {error && <p className="text-sm text-red-500">{error}</p>}
        <p className="text-xs text-text-tertiary">
          El pago se procesa de forma segura con PayPhone
        </p>
      </div>
    )
  }

  if (status === 'PAID') {
    return (
      <div className="space-y-3">
        <div className="flex items-center text-sm text-text-secondary">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparando contrato Word...
        </div>
      </div>
    )
  }

  if (status === 'GENERATED' || status === 'DOWNLOADED') {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            onClick={handleDownloadDocx}
            disabled={isLoadingDocx}
            variant="primary"
            className="w-full sm:w-auto"
          >
            {isLoadingDocx ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando Word...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Descargar Word (.docx)
              </>
            )}
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href={`/dashboard/contratos/${contractId}`}>
              <FileText className="mr-2 h-4 w-4" />
              Ver detalles
            </Link>
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {status === 'GENERATED' && (
          <p className="text-xs text-text-tertiary">
            También enviamos el contrato por email.
          </p>
        )}

        <p className="text-xs text-text-muted">
          El archivo Word (.docx) es editable; puedes abrirlo en Microsoft Word, Google Docs o LibreOffice para completar datos adicionales antes de imprimir.
        </p>
      </div>
    )
  }

  return null
}
