import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  CheckCircle2,
  Download,
  Mail,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '¡Contrato Generado! | Abogados Online Ecuador',
  robots: 'noindex',
}

interface PageProps {
  searchParams: Promise<{
    token?: string
    contractId?: string
    pending?: string
  }>
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return email
  const visible = user.slice(0, 2)
  const masked = '*'.repeat(Math.max(user.length - 2, 2))
  return `${visible}${masked}@${domain}`
}

export default async function PaymentSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams
  const { token, contractId: pendingContractId, pending } = params

  const adminSupabase = createAdminClient()

  // Look up contract by download token or contractId
  let contract: Record<string, any> | null = null

  if (token) {
    const { data } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('download_token', token)
      .single()
    contract = data
  } else if (pendingContractId) {
    const { data } = await adminSupabase
      .from('contracts')
      .select('*')
      .eq('id', pendingContractId)
      .single()
    contract = data
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500" />
            <h1 className="text-xl font-semibold text-text-primary">
              Enlace no válido
            </h1>
            <p className="text-sm text-text-secondary">
              Este enlace ha expirado o no es válido. Si realizaste un pago,
              contacta soporte por WhatsApp.
            </p>
            <Link
              href="https://wa.me/593979317579?text=Hola%2C%20realicé%20un%20pago%20pero%20no%20puedo%20descargar%20mi%20contrato"
              className="inline-flex text-sm text-accent-primary hover:underline"
            >
              Contactar soporte
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const contractData = contract.data as Record<string, any>
  const vehiculo =
    contractData?.vehiculo || contractData?.partes?.vehiculo || {}
  const comprador =
    contractData?.partes?.comprador || contractData?.comprador || {}
  const deliveryEmail = contract.delivery_email || contract.email || ''
  const isPdfReady = contract.status === 'GENERATED' || contract.status === 'DOWNLOADED'
  const downloadToken = contract.download_token

  // Check if token is expired
  const tokenExpired = contract.download_token_expires_at
    ? new Date(contract.download_token_expires_at) < new Date()
    : false

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success header */}
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-3xl font-bold text-text-primary">
            ¡Pago exitoso!
          </h1>
          <p className="text-text-secondary">
            Tu contrato ha sido generado correctamente
          </p>
        </div>

        {/* Contract details + download */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-6 space-y-5">
            {/* Vehicle info */}
            <div className="space-y-2 text-sm">
              <h3 className="text-lg font-semibold text-text-primary">
                Contrato de Compraventa Vehicular
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {vehiculo.placa && (
                  <div>
                    <span className="text-text-muted">Placa:</span>
                    <span className="ml-2 text-text-primary font-mono font-bold">
                      {vehiculo.placa}
                    </span>
                  </div>
                )}
                {vehiculo.marca && (
                  <div>
                    <span className="text-text-muted">Marca:</span>
                    <span className="ml-2 text-text-primary">
                      {vehiculo.marca}
                    </span>
                  </div>
                )}
                {vehiculo.modelo && (
                  <div>
                    <span className="text-text-muted">Modelo:</span>
                    <span className="ml-2 text-text-primary">
                      {vehiculo.modelo}
                    </span>
                  </div>
                )}
                {vehiculo.anio && (
                  <div>
                    <span className="text-text-muted">Año:</span>
                    <span className="ml-2 text-text-primary">
                      {vehiculo.anio}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Download button */}
            {isPdfReady && downloadToken && !tokenExpired ? (
              <a
                href={`/api/contracts/${contract.id}/download?token=${downloadToken}`}
                className="flex items-center justify-center gap-3 w-full rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold py-4 px-6 transition-colors text-lg"
              >
                <Download className="w-6 h-6" />
                Descargar Contrato PDF
              </a>
            ) : pending ? (
              <div className="flex items-center justify-center gap-3 w-full rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 font-medium py-4 px-6">
                <Clock className="w-5 h-5" />
                Generando tu contrato... Recibirás un email cuando esté listo.
              </div>
            ) : tokenExpired ? (
              <div className="text-center space-y-2">
                <p className="text-sm text-text-muted">
                  El enlace de descarga ha expirado.
                </p>
                <Link
                  href="https://wa.me/593979317579?text=Hola%2C%20mi%20enlace%20de%20descarga%20expiró"
                  className="text-sm text-accent-primary hover:underline"
                >
                  Contactar soporte para reenvío
                </Link>
              </div>
            ) : null}

            {/* Email confirmation */}
            {deliveryEmail && (
              <div className="flex items-center gap-3 text-sm text-text-secondary bg-bg-secondary/50 rounded-lg p-3">
                <Mail className="w-5 h-5 text-accent-primary shrink-0" />
                <span>
                  También enviamos una copia a{' '}
                  <strong className="text-text-primary">
                    {maskEmail(deliveryEmail)}
                  </strong>
                </span>
              </div>
            )}

            {/* Token validity */}
            {isPdfReady && !tokenExpired && (
              <p className="text-xs text-text-muted text-center">
                <Clock className="w-3 h-3 inline mr-1" />
                Este enlace es válido por 7 días
              </p>
            )}
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">
              ¿Qué sigue?
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <span className="text-text-secondary">
                  <strong className="text-text-primary">Descarga e imprime</strong> el
                  contrato en dos copias
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <span className="text-text-secondary">
                  <strong className="text-text-primary">Ambas partes firman</strong> el
                  contrato
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <span className="text-text-secondary">
                  Acudan a una notaría para el{' '}
                  <strong className="text-text-primary">reconocimiento de firmas</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <span className="text-text-secondary">
                  Realiza la{' '}
                  <strong className="text-text-primary">transferencia en la ANT</strong>{' '}
                  con el contrato notarizado
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* CTA: Schedule appointment */}
        <Card className="bg-accent-primary/5 border-accent-primary/20">
          <CardContent className="p-6 text-center space-y-3">
            <Calendar className="w-8 h-8 mx-auto text-accent-primary" />
            <p className="text-text-primary font-medium">
              ¿Necesitas un notario para el reconocimiento de firmas?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contacto">
                <Button variant="primary">
                  Agendar cita
                </Button>
              </Link>
              <Link href="https://wa.me/593979317579?text=Hola%2C%20necesito%20agendar%20un%20reconocimiento%20de%20firmas">
                <Button variant="outline">
                  WhatsApp
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Create account */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-text-secondary">
              ¿Quieres guardar tus contratos y acceder a ellos cuando necesites?
            </p>
            <Link href="/auth/registro">
              <Button variant="ghost" className="text-accent-primary">
                Crear cuenta gratis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
