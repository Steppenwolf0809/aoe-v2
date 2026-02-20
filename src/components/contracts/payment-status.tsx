'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PaymentStatusProps {
  status: 'processing' | 'success' | 'error'
  error?: string
  contractId?: string
}

export function PaymentStatus({
  status,
  error,
  contractId,
}: PaymentStatusProps) {
  if (status === 'processing') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-accent-primary" />
          <h2 className="mt-6 text-2xl font-semibold text-text-primary">
            Procesando pago...
          </h2>
          <p className="mt-2 text-text-secondary">
            Por favor espera mientras confirmamos tu pago y generamos el
            contrato.
          </p>
        </motion.div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-text-primary">
            ¡Contrato generado!
          </h2>
          <p className="mt-3 text-lg text-text-secondary">
            Tu pago ha sido procesado exitosamente y el contrato está listo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="primary">
              <Link href={`/dashboard/contratos/${contractId}`}>
                <FileText className="mr-2 h-4 w-4" />
                Ver contrato
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/contratos">Ver todos los contratos</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Error state
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <XCircle className="mx-auto h-20 w-20 text-red-500" />
        <h2 className="mt-6 text-3xl font-bold text-text-primary">
          Error en el pago
        </h2>
        <p className="mt-3 text-lg text-text-secondary">
          {error || 'Hubo un problema al procesar tu pago.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="primary">
            <Link href="/dashboard/contratos">Volver a contratos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://wa.me/593979317579" target="_blank">
              Contactar soporte
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
