'use client'

import { Car, UserCheck, UserMinus, Receipt } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { ContratoVehicular } from '@/lib/validations/contract'
import {
  calcularCotizacionVehicular,
  PRECIO_CONTRATO_BASICO,
} from '@/lib/formulas/vehicular'

interface SummaryStepProps {
  data: ContratoVehicular
  acceptedTerms: boolean
  onAcceptedTermsChange: (accepted: boolean) => void
}

export function SummaryStep({
  data,
  acceptedTerms,
  onAcceptedTermsChange,
}: SummaryStepProps) {
  const cotizacion = calcularCotizacionVehicular({
    valorVehiculo: data.vehiculo.avaluo,
    numFirmas: 2,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Resumen del contrato
        </h2>
        <p className="text-sm text-text-secondary">
          Revisa que todos los datos sean correctos antes de guardar.
        </p>
      </div>

      {/* Vehicle summary */}
      <SummarySection
        icon={<Car className="w-4 h-4 text-accent-primary" />}
        title="Vehiculo"
      >
        <SummaryRow label="Placa" value={data.vehiculo.placa} />
        <SummaryRow
          label="Marca / Modelo"
          value={`${data.vehiculo.marca} ${data.vehiculo.modelo} (${data.vehiculo.anio})`}
        />
        <SummaryRow label="Color" value={data.vehiculo.color} />
        <SummaryRow label="Motor" value={data.vehiculo.motor} />
        <SummaryRow label="Chasis" value={data.vehiculo.chasis} />
        <SummaryRow
          label="Avaluo"
          value={formatCurrency(data.vehiculo.avaluo)}
          highlight
        />
      </SummarySection>

      {/* Buyer summary */}
      <SummarySection
        icon={<UserCheck className="w-4 h-4 text-accent-success" />}
        title="Comprador"
      >
        <SummaryRow label="Cedula" value={data.comprador.cedula} />
        <SummaryRow label="Nombres" value={data.comprador.nombres} />
        <SummaryRow label="Direccion" value={data.comprador.direccion} />
        <SummaryRow label="Telefono" value={data.comprador.telefono} />
        <SummaryRow label="Email" value={data.comprador.email} />
      </SummarySection>

      {/* Seller summary */}
      <SummarySection
        icon={<UserMinus className="w-4 h-4 text-accent-warning" />}
        title="Vendedor"
      >
        <SummaryRow label="Cedula" value={data.vendedor.cedula} />
        <SummaryRow label="Nombres" value={data.vendedor.nombres} />
        <SummaryRow label="Direccion" value={data.vendedor.direccion} />
        <SummaryRow label="Telefono" value={data.vendedor.telefono} />
        <SummaryRow label="Email" value={data.vendedor.email} />
      </SummarySection>

      {/* Cost breakdown */}
      <SummarySection
        icon={<Receipt className="w-4 h-4 text-accent-primary" />}
        title="Costos estimados"
      >
        <SummaryRow
          label="Contrato de compraventa (AOE)"
          value={formatCurrency(PRECIO_CONTRATO_BASICO)}
        />
        <SummaryRow
          label={`Notaria (${cotizacion.numFirmas} firmas + IVA)`}
          value={formatCurrency(cotizacion.totalNotarial)}
        />
        <SummaryRow
          label="Impuesto transferencia (1%)"
          value={formatCurrency(cotizacion.impuestoTransferencia)}
        />
        <div className="border-t border-[var(--glass-border)] pt-2 mt-2">
          <SummaryRow
            label="Total estimado"
            value={formatCurrency(cotizacion.totalEstimado)}
            highlight
          />
        </div>
        <p className="text-xs text-text-muted mt-1">
          * El pago se procesara cuando decida generar el PDF del contrato.
          Por ahora se guarda como borrador.
        </p>
      </SummarySection>

      {/* Terms checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary focus:ring-accent-primary cursor-pointer"
        />
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
          Declaro que los datos proporcionados son verdaderos y acepto los{' '}
          <a
            href="/legal/terminos"
            target="_blank"
            className="text-accent-primary hover:underline"
          >
            terminos y condiciones
          </a>{' '}
          del servicio.
        </span>
      </label>
    </div>
  )
}

function SummarySection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/40 p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span
        className={cn(
          highlight
            ? 'font-semibold text-accent-primary'
            : 'text-text-primary font-medium',
        )}
      >
        {value}
      </span>
    </div>
  )
}
