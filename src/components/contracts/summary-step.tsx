'use client'

import { Car, UserCheck, UserMinus, Receipt, AlertTriangle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { ContratoVehicular } from '@/lib/validations/contract'
import {
  ESTADOS_CIVILES_LABELS,
  TIPOS_ANTECEDENTE_LABELS,
  FORMAS_PAGO_LABELS,
  requiresConyuge,
  countFirmas,
  type EstadoCivil,
  type TipoAntecedente,
  type FormaPago,
} from '@/lib/validations/contract'
import type { CuvData } from '@/lib/parsers/cuv-parser'
import {
  calcularCotizacionVehicular,
  PRECIO_CONTRATO_BASICO,
} from '@/lib/formulas/vehicular'

interface SummaryStepProps {
  data: ContratoVehicular
  acceptedTerms: boolean
  onAcceptedTermsChange: (accepted: boolean) => void
  cuvWarnings?: CuvData | null
}

export function SummaryStep({
  data,
  acceptedTerms,
  onAcceptedTermsChange,
  cuvWarnings,
}: SummaryStepProps) {
  const numFirmas = countFirmas(data)
  const cotizacion = calcularCotizacionVehicular({
    valorVehiculo: data.vehiculo.avaluo,
    numFirmas,
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
        title="Vehículo"
      >
        <SummaryRow label="Placa" value={data.vehiculo.placa} />
        <SummaryRow
          label="Marca / Modelo"
          value={`${data.vehiculo.marca} ${data.vehiculo.modelo} (${data.vehiculo.anio})`}
        />
        <SummaryRow label="Color" value={data.vehiculo.color} />
        <SummaryRow label="Motor" value={data.vehiculo.motor} />
        <SummaryRow label="Chasis" value={data.vehiculo.chasis} />
        {data.vehiculo.tipo && <SummaryRow label="Tipo" value={data.vehiculo.tipo} />}
        {data.vehiculo.cilindraje > 0 && <SummaryRow label="Cilindraje" value={`${data.vehiculo.cilindraje} cc`} />}
        {data.vehiculo.combustible && <SummaryRow label="Combustible" value={data.vehiculo.combustible} />}
        {data.vehiculo.servicio && <SummaryRow label="Servicio" value={data.vehiculo.servicio} />}
        <SummaryRow
          label="Avalúo"
          value={formatCurrency(data.vehiculo.avaluo)}
        />
        <SummaryRow
          label="Valor del contrato"
          value={formatCurrency(data.vehiculo.valorContrato)}
          highlight
        />
        <SummaryRow
          label="Forma de pago"
          value={FORMAS_PAGO_LABELS[data.formaPago as FormaPago] ?? data.formaPago}
        />
        <SummaryRow
          label="Antecedente"
          value={TIPOS_ANTECEDENTE_LABELS[data.tipoAntecedente as TipoAntecedente] ?? data.tipoAntecedente}
        />
        {data.cuvNumero && <SummaryRow label="CUV" value={data.cuvNumero} />}
      </SummarySection>

      {/* Buyer summary */}
      <SummarySection
        icon={<UserCheck className="w-4 h-4 text-accent-success" />}
        title="Comprador"
      >
        <PersonaSummary persona={data.comprador} />
      </SummarySection>

      {/* Seller summary */}
      <SummarySection
        icon={<UserMinus className="w-4 h-4 text-accent-warning" />}
        title="Vendedor"
      >
        <PersonaSummary persona={data.vendedor} />
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
          label={`Notaria (${numFirmas} certificaciones + IVA)`}
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
          * {numFirmas} certificaciones = {numFirmas - 1} compareciente{numFirmas - 1 > 1 ? 's' : ''} + 1 matricula.
          El pago se procesar? cuando decida generar el contrato Word (.docx).
        </p>
      </SummarySection>

      {/* CUV Warnings */}
      {cuvWarnings &&
        (cuvWarnings.gravamenes.tiene ||
          cuvWarnings.bloqueos.tiene ||
          cuvWarnings.infracciones.tiene) && (
          <div className="rounded-xl border border-accent-warning/30 bg-accent-warning/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-warning" />
              <h3 className="text-sm font-semibold text-accent-warning">
                Alertas del CUV
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              El CUV del vehiculo reporta las siguientes alertas. Verifique
              antes de continuar.
            </p>
            {cuvWarnings.gravamenes.tiene && (
              <div className="rounded-lg px-3 py-2 border border-accent-error/30 bg-accent-error/5">
                <p className="text-sm font-medium text-accent-error">
                  Gravamenes vigentes
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {cuvWarnings.gravamenes.detalle}
                </p>
              </div>
            )}
            {cuvWarnings.bloqueos.tiene && (
              <div className="rounded-lg px-3 py-2 border border-accent-error/30 bg-accent-error/5">
                <p className="text-sm font-medium text-accent-error">
                  Bloqueos vigentes
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {cuvWarnings.bloqueos.detalle}
                </p>
              </div>
            )}
            {cuvWarnings.infracciones.tiene && (
              <div className="rounded-lg px-3 py-2 border border-accent-warning/30 bg-accent-warning/5">
                <p className="text-sm font-medium text-accent-warning">
                  {cuvWarnings.infracciones.cantidad} infracciones pendientes
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Total adeudado: ${cuvWarnings.infracciones.total.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        )}

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

/* ----------------------------------------------------------------
   PersonaSummary — Displays all persona data including legal fields
   ---------------------------------------------------------------- */

function PersonaSummary({
  persona,
}: {
  persona: ContratoVehicular['comprador']
}) {
  const estadoCivilLabel =
    ESTADOS_CIVILES_LABELS[persona.estadoCivil as EstadoCivil] ||
    persona.estadoCivil
  const comparecenciaLabel =
    persona.comparecencia === 'apoderado'
      ? 'Mediante apoderado'
      : 'Por sus propios derechos'

  const showConyuge = requiresConyuge(persona.estadoCivil)
  const showApoderado = persona.comparecencia === 'apoderado'

  return (
    <>
      <SummaryRow label="Documento" value={persona.cedula} />
      <SummaryRow label="Tipo doc." value={persona.tipoDocumento === 'pasaporte' ? 'Pasaporte' : 'Cédula'} />
      <SummaryRow label="Nombres" value={persona.nombres} />
      <SummaryRow label="Nacionalidad" value={persona.nacionalidad} />
      <SummaryRow label="Sexo" value={persona.sexo === 'F' ? 'Femenino' : 'Masculino'} />
      <SummaryRow label="Dirección" value={persona.direccion} />
      <SummaryRow label="Teléfono" value={persona.telefono} />
      <SummaryRow label="Email" value={persona.email} />
      <SummaryRow label="Estado civil" value={estadoCivilLabel} />
      <SummaryRow label="Comparecencia" value={comparecenciaLabel} />

      {showConyuge && persona.conyuge && (
        <div className="border-t border-[var(--glass-border)]/50 pt-1.5 mt-1.5">
          <SummaryRow label="Conyuge" value={persona.conyuge.nombres} />
          <SummaryRow
            label="Cedula conyuge"
            value={persona.conyuge.cedula}
          />
        </div>
      )}

      {showApoderado && persona.apoderado && (
        <div className="border-t border-[var(--glass-border)]/50 pt-1.5 mt-1.5">
          <SummaryRow label="Apoderado" value={persona.apoderado.nombres} />
          <SummaryRow
            label="Cedula apoderado"
            value={persona.apoderado.cedula}
          />
          <SummaryRow
            label="Notaria del poder"
            value={persona.apoderado.notariaPoder}
          />
          <SummaryRow
            label="Fecha del poder"
            value={persona.apoderado.fechaPoder}
          />
        </div>
      )}
    </>
  )
}

/* ----------------------------------------------------------------
   SummarySection & SummaryRow — Unchanged helper components
   ---------------------------------------------------------------- */

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
