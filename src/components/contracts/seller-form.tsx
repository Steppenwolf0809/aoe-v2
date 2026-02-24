'use client'

import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { UserMinus, FileText, UserCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { LegalFields } from './legal-fields'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

export function SellerForm() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ContratoVehicular>()

  const vendedorNombres = watch('vendedor.nombres')
  const tipoDocumento = watch('vendedor.tipoDocumento')
  const esPersonaJuridica = watch('vendedor.esPersonaJuridica') ?? false
  const tipoDocumentoRepresentante =
    watch('vendedor.representanteLegal.tipoDocumento') ?? 'cedula'

  useEffect(() => {
    if (!esPersonaJuridica) return
    // Keep hidden legal fields in valid defaults when seller is a company.
    setValue('vendedor.tipoDocumento', 'cedula', { shouldValidate: false })
    setValue('vendedor.comparecencia', 'propios_derechos', {
      shouldValidate: false,
    })
    setValue('vendedor.estadoCivil', 'soltero', { shouldValidate: false })
    setValue('vendedor.sexo', 'M', { shouldValidate: false })
    setValue('vendedor.nacionalidad', 'ecuatoriana', { shouldValidate: false })
  }, [esPersonaJuridica, setValue])

  const se = errors.vendedor as Record<string, any> | undefined

  const docLabel = esPersonaJuridica
    ? 'RUC de la compania'
    : tipoDocumento === 'pasaporte'
      ? 'Numero de pasaporte'
      : 'Cedula de identidad'
  const docPlaceholder = esPersonaJuridica
    ? '1790012345001'
    : tipoDocumento === 'pasaporte'
      ? 'AB1234567'
      : '1712345678'
  const docHint = esPersonaJuridica
    ? '13 digitos sin guiones'
    : tipoDocumento === 'pasaporte'
      ? 'Letras y numeros'
      : '10 digitos sin guiones'
  const docMaxLength = esPersonaJuridica ? 13 : tipoDocumento === 'pasaporte' ? 20 : 10

  const repDocLabel =
    tipoDocumentoRepresentante === 'pasaporte'
      ? 'Pasaporte del representante legal'
      : 'Cedula del representante legal'
  const repDocPlaceholder =
    tipoDocumentoRepresentante === 'pasaporte' ? 'AB1234567' : '1712345678'

  const cuvSellerTooltip =
    'Si cargaste un CUV, este dato puede haberse autocompletado. Verifica que coincida con el propietario registrado.'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-warning/10 flex items-center justify-center">
          <UserMinus className="w-5 h-5 text-accent-warning" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Datos del vendedor
          </h2>
          <p className="text-sm text-text-secondary">
            Informacion de quien vende el vehiculo.
          </p>
          {vendedorNombres && (
            <div className="flex items-center gap-1 mt-1 text-xs text-accent-primary">
              <FileText className="w-3 h-3" />
              <span>Pre-llenado desde CUV</span>
            </div>
          )}
        </div>
      </div>

      <Controller
        name="vendedor.esPersonaJuridica"
        control={control}
        render={({ field }) => (
          <label className="flex items-start gap-3 cursor-pointer group rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/30 p-3">
            <input
              type="checkbox"
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary focus:ring-accent-primary cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              <span className="font-medium text-text-primary">
                El vendedor es persona juridica (compania)
              </span>
              <br />
              Ingresa RUC y razon social de la compania; luego los datos del
              representante legal.
            </span>
          </label>
        )}
      />

      {esPersonaJuridica && (
        <div className="rounded-xl border border-accent-primary/20 bg-accent-primary/5 p-3 text-xs text-text-secondary">
          Cuando vende una persona juridica, el estado civil del representante
          legal no genera comparecencia de conyuge en este contrato.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vendedor.cedula"
          label={docLabel}
          placeholder={docPlaceholder}
          maxLength={docMaxLength}
          error={se?.cedula?.message}
          hint={docHint}
          tooltip={cuvSellerTooltip}
          {...register('vendedor.cedula')}
        />
        <Input
          id="vendedor.nombres"
          label={esPersonaJuridica ? 'Razon social' : 'Nombres completos'}
          placeholder={
            esPersonaJuridica
              ? 'COMPANIA EJEMPLO S.A.'
              : 'Maria Elena Garcia Torres'
          }
          error={se?.nombres?.message}
          tooltip={cuvSellerTooltip}
          {...register('vendedor.nombres')}
        />
        <div className="sm:col-span-2">
          <Input
            id="vendedor.direccion"
            label="Direccion"
            placeholder="Av. 6 de Diciembre N32-456, Quito"
            error={se?.direccion?.message}
            {...register('vendedor.direccion')}
          />
        </div>
        <Input
          id="vendedor.telefono"
          label="Telefono"
          type="tel"
          placeholder="0987654321"
          error={se?.telefono?.message}
          {...register('vendedor.telefono')}
        />
        <Input
          id="vendedor.email"
          label="Correo electronico"
          type="email"
          placeholder="maria@email.com"
          error={se?.email?.message}
          {...register('vendedor.email')}
        />
      </div>

      {esPersonaJuridica && (
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <UserCircle2 className="w-4 h-4 text-accent-warning" />
            <h3 className="text-sm font-semibold text-text-primary">
              Representante legal
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="vendedor.representanteLegal.nombres"
              label="Nombres del representante legal"
              placeholder="Juan Carlos Perez Lopez"
              error={se?.representanteLegal?.nombres?.message}
              {...register('vendedor.representanteLegal.nombres')}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">
                Tipo de documento
              </label>
              <Controller
                name="vendedor.representanteLegal.tipoDocumento"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? 'cedula'}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-bg-secondary border-[var(--glass-border)]">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cedula">Cedula</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Input
              id="vendedor.representanteLegal.cedula"
              label={repDocLabel}
              placeholder={repDocPlaceholder}
              error={se?.representanteLegal?.cedula?.message}
              hint={
                tipoDocumentoRepresentante === 'pasaporte'
                  ? 'Al menos 5 caracteres'
                  : '10 digitos sin guiones'
              }
              {...register('vendedor.representanteLegal.cedula')}
            />
          </div>
        </div>
      )}

      {!esPersonaJuridica && <LegalFields prefix="vendedor" />}
    </div>
  )
}
