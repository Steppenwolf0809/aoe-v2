'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { Car, FileText, MessageSquare, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { CuvUpload } from './cuv-upload'
import type { ContratoVehicular } from '@/lib/validations/contract'
import {
  TIPOS_ANTECEDENTE_LABELS,
  FORMAS_PAGO_LABELS,
} from '@/lib/validations/contract'
import type { CuvData } from '@/lib/parsers/cuv-parser'

interface VehicleDataFormProps {
  onCuvParsed?: (data: CuvData) => void
}

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
} as const

const CUV_FIELD_TOOLTIP =
  'Si subiste el CUV, este campo se autocompleta. Verifica que coincida exactamente con el certificado y la matricula.'
const CUV_META_TOOLTIP =
  'Dato tomado del Certificado Unico Vehicular. Confirma numero y fecha de emision.'

export function VehicleDataForm({ onCuvParsed }: VehicleDataFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ContratoVehicular>()

  const ve = errors.vehiculo
  const tipoAntecedente = watch('tipoAntecedente')
  const tieneObservaciones = watch('tieneObservaciones')

  const showHerencia = tipoAntecedente === 'herencia'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Datos del vehículo
          </h2>
          <p className="text-sm text-text-secondary">
            Ingresa la información del vehículo a transferir.
          </p>
        </div>
      </div>

      {/* CUV Upload */}
      <CuvUpload onCuvParsed={onCuvParsed} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            o ingresa los datos manualmente
          </span>
        </div>
      </div>

      {/* Core vehicle fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vehiculo.placa"
          label="Placa"
          placeholder="ABC-1234"
          error={ve?.placa?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.placa', {
            setValueAs: (v: string) => v.toUpperCase(),
          })}
        />
        <Input
          id="vehiculo.marca"
          label="Marca"
          placeholder="Toyota, Chevrolet..."
          error={ve?.marca?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.marca')}
        />
        <Input
          id="vehiculo.modelo"
          label="Modelo"
          placeholder="Corolla, Aveo..."
          error={ve?.modelo?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.modelo')}
        />
        <Input
          id="vehiculo.anio"
          label="Año"
          type="number"
          placeholder="2024"
          error={ve?.anio?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.anio', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.color"
          label="Color"
          placeholder="Blanco, Negro..."
          error={ve?.color?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.color')}
        />
        <Input
          id="vehiculo.motor"
          label="Número de motor"
          placeholder="Ej: 2NR-FKE1234567"
          error={ve?.motor?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.motor')}
        />
        <Input
          id="vehiculo.chasis"
          label="Número de chasis"
          placeholder="Ej: 9BR53ZEC2L1234567"
          error={ve?.chasis?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.chasis')}
        />
      </div>

      {/* Additional v2 vehicle fields */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Detalles técnicos del vehículo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vehiculo.tipo"
          label="Tipo"
          placeholder="Automóvil, Camioneta, SUV..."
          error={ve?.tipo?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.tipo')}
        />
        <Input
          id="vehiculo.cilindraje"
          label="Cilindraje (cc)"
          type="number"
          placeholder="1500"
          error={ve?.cilindraje?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.cilindraje', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.carroceria"
          label="Carrocería"
          placeholder="Metálica, Fibra..."
          error={ve?.carroceria?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.carroceria')}
        />
        <Input
          id="vehiculo.clase"
          label="Clase"
          placeholder="Automóvil, Camioneta..."
          error={ve?.clase?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.clase')}
        />
        <Input
          id="vehiculo.pais"
          label="País de origen"
          placeholder="Japón, Corea, China..."
          error={ve?.pais?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.pais')}
        />
        <Input
          id="vehiculo.combustible"
          label="Combustible"
          placeholder="Gasolina, Diésel, Híbrido..."
          error={ve?.combustible?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.combustible')}
        />
        <Input
          id="vehiculo.pasajeros"
          label="Número de pasajeros"
          type="number"
          placeholder="5"
          error={ve?.pasajeros?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.pasajeros', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.servicio"
          label="Servicio"
          placeholder="USO PARTICULAR"
          error={ve?.servicio?.message}
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.servicio')}
        />
        {/* Optional fields */}
        <Input
          id="vehiculo.tonelaje"
          label="Tonelaje (opcional)"
          placeholder="0.75"
          tooltip={CUV_FIELD_TOOLTIP}
          {...register('vehiculo.tonelaje')}
        />
      </div>

      {/* Financial section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Datos financieros
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vehiculo.avaluo"
          label="Avalúo comercial ($)"
          type="number"
          placeholder="15000"
          error={ve?.avaluo?.message}
          hint="Encuentra este valor en la especie de la matrícula"
          {...register('vehiculo.avaluo', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.valorContrato"
          label="Valor del contrato ($)"
          type="number"
          placeholder="14500"
          error={ve?.valorContrato?.message}
          hint="Precio pactado entre comprador y vendedor"
          {...register('vehiculo.valorContrato', { valueAsNumber: true })}
        />
        {/* Forma de pago */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Forma de pago
          </label>
          <Controller
            name="formaPago"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? 'transferencia'} onValueChange={field.onChange}>
                <SelectTrigger className="bg-bg-secondary border-[var(--glass-border)]">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMAS_PAGO_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Documentary support section (optional but recommended) */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Respaldo documental (recomendado)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="fechaPago"
          label="Fecha de pago (opcional)"
          type="date"
          hint="Si no se llena, el contrato mostrará [FECHA]"
          {...register('fechaPago')}
        />
        <Input
          id="entidadFinancieraPago"
          label="Entidad financiera (opcional)"
          placeholder="Banco Pichincha"
          hint="Si no se llena, el contrato mostrará [COMPLETAR]"
          {...register('entidadFinancieraPago')}
        />
        <Input
          id="comprobantePago"
          label="No. de comprobante (opcional)"
          placeholder="TRX-123456789"
          hint="Si no se llena, el contrato mostrará [COMPLETAR]"
          {...register('comprobantePago')}
        />
        <Input
          id="fechaEntrega"
          label="Fecha de entrega (opcional)"
          type="date"
          hint="Si no se llena, el contrato mostrará [FECHA]"
          {...register('fechaEntrega')}
        />
        <Input
          id="lugarEntrega"
          label="Lugar de entrega (opcional)"
          placeholder="Quito, Ecuador"
          hint="Si no se llena, el contrato mostrará [COMPLETAR]"
          {...register('lugarEntrega')}
        />
        <Input
          id="plazoTransferenciaDias"
          label="Plazo transferencia (días, opcional)"
          placeholder="30"
          hint="Si no se llena, el contrato mostrará [PLAZO]"
          {...register('plazoTransferenciaDias')}
        />
      </div>

      {/* Antecedentes section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Antecedentes de propiedad
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de antecedente */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            ¿Cómo adquirió el vendedor este vehículo?
          </label>
          <Controller
            name="tipoAntecedente"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? 'compraventa'} onValueChange={field.onChange}>
                <SelectTrigger className="bg-bg-secondary border-[var(--glass-border)]">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPOS_ANTECEDENTE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* CUV fields — always shown, optional */}
        <Input
          id="cuvNumero"
          label="Número de CUV (opcional)"
          placeholder="CUV-2026-00123456"
          hint="Se llena automáticamente al subir el CUV"
          tooltip={CUV_META_TOOLTIP}
          {...register('cuvNumero')}
        />
        <Input
          id="cuvFecha"
          label="Fecha de emisión CUV (opcional)"
          placeholder="09 de febrero de 2026"
          tooltip={CUV_META_TOOLTIP}
          {...register('cuvFecha')}
        />

        {tipoAntecedente === 'compraventa' && (
          <Input
            id="fechaInscripcion"
            label="Fecha de inscripción (opcional)"
            type="date"
            hint="Fecha en que se inscribió a nombre del vendedor"
            {...register('fechaInscripcion')}
          />
        )}

        <Input
          id="matriculaVigencia"
          label="Vigencia de matrícula (opcional)"
          type="date"
          {...register('matriculaVigencia')}
        />
      </div>

      {/* Herencia fields — conditional */}
      <AnimatePresence>
        {showHerencia && (
          <motion.div
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/30 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent-warning" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Datos de Herencia / Posesión Efectiva
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="herencia.causanteNombre"
                  label="Nombre del causante"
                  placeholder="Nombre completo del fallecido"
                  error={(errors as any)?.herencia?.causanteNombre?.message}
                  {...register('herencia.causanteNombre')}
                />
                <Input
                  id="herencia.causanteFechaFallecimiento"
                  label="Fecha de fallecimiento"
                  type="date"
                  error={(errors as any)?.herencia?.causanteFechaFallecimiento?.message}
                  {...register('herencia.causanteFechaFallecimiento')}
                />
                <Input
                  id="herencia.posEfectivaNotaria"
                  label="Notaría de posesión efectiva"
                  placeholder="Notaría Sexta del Cantón Quito"
                  error={(errors as any)?.herencia?.posEfectivaNotaria?.message}
                  {...register('herencia.posEfectivaNotaria')}
                />
                <Input
                  id="herencia.posEfectivaFecha"
                  label="Fecha de posesión efectiva"
                  type="date"
                  error={(errors as any)?.herencia?.posEfectivaFecha?.message}
                  {...register('herencia.posEfectivaFecha')}
                />
                <Input
                  id="herencia.herederosLista"
                  label="Herederos"
                  placeholder="ALFREDO GONZÁLEZ y ANDRÉS GONZÁLEZ"
                  error={(errors as any)?.herencia?.herederosLista?.message}
                  {...register('herencia.herederosLista')}
                />
                <Input
                  id="herencia.parentesco"
                  label="Parentesco"
                  placeholder="hijos / cónyuge e hijos"
                  error={(errors as any)?.herencia?.parentesco?.message}
                  {...register('herencia.parentesco')}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Observaciones section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Observaciones adicionales
          </span>
        </div>
      </div>

      <Controller
        name="tieneObservaciones"
        control={control}
        render={({ field }) => (
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary focus:ring-accent-primary cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              <span className="font-medium text-text-primary">¿Desea agregar observaciones al contrato?</span>
              <br />
              <span className="text-xs">
                Ejemplo: &quot;El vehículo se entrega con matrícula vencida&quot; o condiciones especiales de la venta.
              </span>
            </span>
          </label>
        )}
      />

      <AnimatePresence>
        {tieneObservaciones && (
          <motion.div
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">
                Texto de observaciones
              </label>
              <textarea
                className="w-full rounded-lg border border-[var(--glass-border)] bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/20 min-h-[100px] resize-y"
                placeholder="El vehículo se entrega con matrícula vencida desde el 31 de diciembre de 2025. El comprador asume los costos de renovación."
                {...register('observacionesTexto')}
              />
              {(errors as any)?.observacionesTexto?.message && (
                <p className="text-xs text-accent-error">
                  {(errors as any).observacionesTexto.message}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
