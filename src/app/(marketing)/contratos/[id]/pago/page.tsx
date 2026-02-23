import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { PaymentForm } from '@/components/contracts/payment-form'

// PayPhone WAF blocks Vercel US IPs → run from São Paulo
export const preferredRegion = 'gru1'

export const metadata: Metadata = {
  title: 'Pagar y Generar Contrato | Abogados Online Ecuador',
}

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

interface ContractVehicleData {
  vehiculo?: {
    placa?: string
    marca?: string
    modelo?: string
    anio?: number
    avaluo?: number
    valorContrato?: number
  }
  comprador?: {
    nombres?: string
    email?: string
  }
  partes?: {
    comprador?: { email?: string }
    vendedor?: { email?: string }
  }
}

export default async function PagoPage({ params, searchParams }: PageProps) {
  const { id: contractId } = await params
  const { error: paymentError } = await searchParams
  const supabase = await createClient()

  // Get contract (works for both authenticated and anonymous)
  const { data: contract, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', contractId)
    .single()

  if (error || !contract) {
    notFound()
  }

  // If already paid and has download token, redirect to success page
  if (contract.status === 'GENERATED' || contract.status === 'DOWNLOADED') {
    if (contract.download_token) {
      redirect(`/contratos/pago/exito?token=${contract.download_token}`)
    }
  }

  // If paid but DOCX token is not yet prepared, redirect to success (will show pending state)
  if (contract.status === 'PAID') {
    redirect(`/contratos/pago/exito?contractId=${contractId}&pending=true`)
  }

  const vehicleData = contract.data as ContractVehicleData
  const vehiculo = vehicleData?.vehiculo
  const comprador = vehicleData?.comprador
  const defaultEmail =
    vehicleData?.partes?.comprador?.email ||
    comprador?.email ||
    contract.email ||
    ''



  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">
            Confirma y paga tu contrato
          </h1>
          <p className="text-text-secondary">
            Revisa los detalles antes de proceder al pago
          </p>
        </div>

        {/* Contract Summary */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Resumen del contrato
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Vehículo:</span>
                  <span className="text-text-primary font-medium">
                    {vehiculo?.marca} {vehiculo?.modelo} {vehiculo?.anio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Placa:</span>
                  <span className="text-text-primary font-medium">
                    {vehiculo?.placa}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Avalúo:</span>
                  <span className="text-text-primary font-medium">
                    {formatCurrency(vehiculo?.avaluo || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Valor del contrato:</span>
                  <span className="text-text-primary font-medium">
                    {formatCurrency(vehiculo?.valorContrato || vehiculo?.avaluo || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Comprador:</span>
                  <span className="text-text-primary font-medium">
                    {comprador?.nombres}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--glass-border)] pt-4">
              <div className="flex justify-between items-center">
                <span className="text-text-primary font-medium">
                  Precio del contrato:
                </span>
                <span className="text-2xl font-bold text-accent-primary">
                  {formatCurrency(PRECIO_CONTRATO_BASICO)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's included */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              ¿Qué incluye?
            </h3>
            <ul className="space-y-3">
              {[
                'Contrato notarial completo y válido',
                'Contrato Word (.docx) descargable inmediatamente',
                'Formato aprobado por notarías',
                'Soporte por email',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Payment form with email + button (Polling enabled) */}
        <PaymentForm
          contractId={contractId}
          defaultEmail={defaultEmail}
          initialError={paymentError}
        />

        {/* Security badges */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-text-muted">
            🔒 Pago 100% seguro con PayPhone
          </p>
          <p className="text-xs text-text-muted">
            Serás redirigido a la pasarela de pago
          </p>
        </div>
      </div>
    </div>
  )
}
