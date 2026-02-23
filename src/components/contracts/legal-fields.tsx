'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Scale, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { ESTADOS_CIVILES_LABELS } from '@/lib/validations/contract'

interface LegalFieldsProps {
  prefix: 'comprador' | 'vendedor'
}

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
} as const

export function LegalFields({ prefix }: LegalFieldsProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ContratoVehicular>()

  const estadoCivil = watch(`${prefix}.estadoCivil`)
  const comparecencia = watch(`${prefix}.comparecencia`)
  const incluirConyuge = watch(`${prefix}.incluirConyuge`)
  const tipoDocumento = watch(`${prefix}.tipoDocumento`)

  const estadoCivilNeedsConyuge =
    estadoCivil === 'casado' || estadoCivil === 'union_de_hecho'

  // For vendedor: always show conyuge fields when married
  // For comprador: show only if explicitly opted in via checkbox
  const showConyugeFields =
    estadoCivilNeedsConyuge &&
    (prefix === 'vendedor' || incluirConyuge === true)

  const showApoderado = comparecencia === 'apoderado'

  // Access nested errors — superRefine issues land at these paths
  const pe = errors[prefix] as Record<string, any> | undefined

  // Dynamic label for document field
  const docLabel = tipoDocumento === 'pasaporte' ? 'Número de pasaporte' : 'Cédula de identidad'
  const docPlaceholder = tipoDocumento === 'pasaporte' ? 'AB1234567' : '1712345678'
  const docHint = tipoDocumento === 'pasaporte' ? 'Letras y números' : '10 dígitos sin guiones'
  const docMaxLength = tipoDocumento === 'pasaporte' ? 20 : 10

  return (
    <div className="space-y-4 mt-4">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[var(--glass-bg)] text-xs text-[var(--text-muted)]">
            Información legal
          </span>
        </div>
      </div>

      {/* Row: Sexo + Nacionalidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sexo */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Sexo
          </label>
          <Controller
            name={`${prefix}.sexo`}
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  className={
                    pe?.sexo
                      ? 'border-accent-error bg-bg-secondary border-[var(--glass-border)]'
                      : 'bg-bg-secondary border-[var(--glass-border)]'
                  }
                >
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {pe?.sexo?.message && (
            <p className="text-xs text-accent-error">
              {pe.sexo.message as string}
            </p>
          )}
        </div>

        {/* Nacionalidad */}
        <Input
          id={`${prefix}.nacionalidad`}
          label="Nacionalidad"
          placeholder="ecuatoriana"
          error={pe?.nacionalidad?.message as string | undefined}
          {...register(`${prefix}.nacionalidad`)}
        />
      </div>

      {/* Row: Tipo Documento + Estado Civil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tipo de documento */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Tipo de documento
          </label>
          <Controller
            name={`${prefix}.tipoDocumento`}
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? 'cedula'} onValueChange={field.onChange}>
                <SelectTrigger className="bg-bg-secondary border-[var(--glass-border)]">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cedula">Cédula de ciudadanía</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Estado Civil */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Estado civil
          </label>
          <Controller
            name={`${prefix}.estadoCivil`}
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  className={
                    pe?.estadoCivil
                      ? 'border-accent-error bg-bg-secondary border-[var(--glass-border)]'
                      : 'bg-bg-secondary border-[var(--glass-border)]'
                  }
                >
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ESTADOS_CIVILES_LABELS).map(
                    ([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {pe?.estadoCivil?.message && (
            <p className="text-xs text-accent-error">
              {pe.estadoCivil.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Comparecencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">
            Comparece por
          </label>
          <Controller
            name={`${prefix}.comparecencia`}
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  className={
                    pe?.comparecencia
                      ? 'border-accent-error bg-bg-secondary border-[var(--glass-border)]'
                      : 'bg-bg-secondary border-[var(--glass-border)]'
                  }
                >
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="propios_derechos">
                    Por sus propios derechos
                  </SelectItem>
                  <SelectItem value="apoderado">
                    Mediante apoderado
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {pe?.comparecencia?.message && (
            <p className="text-xs text-accent-error">
              {pe.comparecencia.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Conyuge — conditional */}
      <AnimatePresence>
        {estadoCivilNeedsConyuge && (
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
                <Heart className="w-4 h-4 text-accent-primary" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Cónyuge
                </h3>
              </div>

              {/* For VENDEDOR: always required, show message */}
              {prefix === 'vendedor' && (
                <p className="text-xs text-text-muted">
                  Al ser casado/a o en unión de hecho, el cónyuge debe comparecer
                  en el contrato para transferir el bien de la sociedad conyugal.
                </p>
              )}

              {/* For COMPRADOR: optional with checkbox */}
              {prefix === 'comprador' && (
                <Controller
                  name="comprador.incluirConyuge"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary focus:ring-accent-primary cursor-pointer flex-shrink-0"
                      />
                      <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                        <span className="font-medium text-text-primary">¿Comparecerá el cónyuge en el contrato?</span>
                        <br />
                        Si el cónyuge no comparece pero existe sociedad conyugal, el vehículo igual se adquiere para la sociedad. Puedes agregar los datos del cónyuge manualmente en el documento Word.
                      </span>
                    </label>
                  )}
                />
              )}

              {/* Conyuge fields — shown for vendedor always, or for comprador if opted in */}
              <AnimatePresence>
                {showConyugeFields && (
                  <motion.div
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <Input
                        id={`${prefix}.conyuge.nombres`}
                        label="Nombres completos"
                        placeholder="Nombres del cónyuge"
                        error={pe?.conyuge?.nombres?.message as string | undefined}
                        {...register(`${prefix}.conyuge.nombres`)}
                      />
                      <Input
                        id={`${prefix}.conyuge.cedula`}
                        label="Documento de identidad"
                        placeholder="1712345678"
                        error={pe?.conyuge?.cedula?.message as string | undefined}
                        hint="Cédula o pasaporte"
                        {...register(`${prefix}.conyuge.cedula`)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apoderado — conditional */}
      <AnimatePresence>
        {showApoderado && (
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
                <Scale className="w-4 h-4 text-accent-warning" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Datos del apoderado
                </h3>
              </div>
              <p className="text-xs text-text-muted">
                El apoderado firmará en representación de esta persona según
                poder especial.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id={`${prefix}.apoderado.nombres`}
                  label="Nombre del apoderado"
                  placeholder="Nombres completos"
                  error={
                    pe?.apoderado?.nombres?.message as string | undefined
                  }
                  {...register(`${prefix}.apoderado.nombres`)}
                />
                <Input
                  id={`${prefix}.apoderado.cedula`}
                  label="Documento del apoderado"
                  placeholder="1712345678"
                  error={pe?.apoderado?.cedula?.message as string | undefined}
                  hint="Cédula o pasaporte"
                  {...register(`${prefix}.apoderado.cedula`)}
                />
                <Input
                  id={`${prefix}.apoderado.notariaPoder`}
                  label="Notaría del poder"
                  placeholder="Notaría Décima Octava de Quito"
                  error={
                    pe?.apoderado?.notariaPoder?.message as string | undefined
                  }
                  {...register(`${prefix}.apoderado.notariaPoder`)}
                />
                <Input
                  id={`${prefix}.apoderado.fechaPoder`}
                  label="Fecha del poder"
                  placeholder="15 de enero de 2026"
                  error={
                    pe?.apoderado?.fechaPoder?.message as string | undefined
                  }
                  {...register(`${prefix}.apoderado.fechaPoder`)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
