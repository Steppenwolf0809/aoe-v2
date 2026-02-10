import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Calendar, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ContractActions } from '@/components/contracts/contract-actions'

export const metadata: Metadata = {
  title: 'Detalle del Contrato | Dashboard | Abogados Online Ecuador',
}

interface PageProps {
  params: Promise<{ id: string }>
}

const statusLabel: Record<string, string> = {
  DRAFT: 'Borrador',
  PENDING_PAYMENT: 'Pago pendiente',
  PAID: 'Pagado',
  GENERATED: 'Generado',
  DOWNLOADED: 'Descargado',
}

const statusVariant: Record<
  string,
  'default' | 'info' | 'warning' | 'success'
> = {
  DRAFT: 'default',
  PENDING_PAYMENT: 'warning',
  PAID: 'info',
  GENERATED: 'warning',
  DOWNLOADED: 'success',
}

export default async function ContratoDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const { data: contract, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !contract) {
    notFound()
  }

  const vehicleData = contract.data as {
    vehiculo?: {
      placa?: string
      marca?: string
      modelo?: string
      anio?: number
      color?: string
      numeroChasis?: string
      numeroMotor?: string
    }
    partes?: {
      vendedor?: {
        nombres?: string
        apellidos?: string
        cedula?: string
      }
      comprador?: {
        nombres?: string
        apellidos?: string
        cedula?: string
      }
    }
    precio?: {
      valor?: number
      formaPago?: string
    }
  }

  const vehiculo = vehicleData?.vehiculo
  const partes = vehicleData?.partes
  const precio = vehicleData?.precio

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/contratos">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Title and Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Contrato de Compraventa
          </h2>
          <p className="text-sm text-text-secondary">
            {vehiculo?.marca} {vehiculo?.modelo} - {vehiculo?.placa}
          </p>
        </div>
        <Badge variant={statusVariant[contract.status]} className="w-fit">
          {statusLabel[contract.status]}
        </Badge>
      </div>

      {/* Actions */}
      <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardContent className="py-6">
          <ContractActions
            contractId={contract.id}
            status={contract.status}
            downloadToken={contract.download_token || undefined}
          />
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardContent className="py-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Datos del Vehículo
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-tertiary">Placa</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.placa || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Marca y Modelo</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.marca} {vehiculo?.modelo}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Año</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.anio || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Color</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.color || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Número de Chasis</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.numeroChasis || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Número de Motor</p>
              <p className="text-sm font-medium text-text-primary">
                {vehiculo?.numeroMotor || '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parties Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seller */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Vendedor
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-tertiary">Nombre completo</p>
                <p className="text-sm font-medium text-text-primary">
                  {partes?.vendedor?.nombres} {partes?.vendedor?.apellidos}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Cédula</p>
                <p className="text-sm font-medium text-text-primary">
                  {partes?.vendedor?.cedula || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer */}
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Comprador
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-tertiary">Nombre completo</p>
                <p className="text-sm font-medium text-text-primary">
                  {partes?.comprador?.nombres} {partes?.comprador?.apellidos}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Cédula</p>
                <p className="text-sm font-medium text-text-primary">
                  {partes?.comprador?.cedula || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price and Dates */}
      <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardContent className="py-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Información del Contrato
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Precio del vehículo</p>
                <p className="text-sm font-semibold text-text-primary">
                  {precio?.valor ? formatCurrency(precio.valor) : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Fecha de creación</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(contract.created_at)}
                </p>
              </div>
            </div>
            {contract.amount && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">Monto pagado</p>
                  <p className="text-sm font-semibold text-green-500">
                    {formatCurrency(contract.amount)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
