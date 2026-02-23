'use client'

import { useFormContext } from 'react-hook-form'
import { UserCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { LegalFields } from './legal-fields'

export function BuyerForm() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ContratoVehicular>()

  const ce = errors.comprador
  const tipoDocumento = watch('comprador.tipoDocumento')

  // Dynamic label for document field
  const docLabel = tipoDocumento === 'pasaporte' ? 'Número de pasaporte' : 'Cédula de identidad'
  const docPlaceholder = tipoDocumento === 'pasaporte' ? 'AB1234567' : '1712345678'
  const docHint = tipoDocumento === 'pasaporte' ? 'Letras y números' : '10 dígitos sin guiones'
  const docMaxLength = tipoDocumento === 'pasaporte' ? 20 : 10

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-success/10 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-accent-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Datos del comprador
          </h2>
          <p className="text-sm text-text-secondary">
            Información de quien adquiere el vehículo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="comprador.cedula"
          label={docLabel}
          placeholder={docPlaceholder}
          maxLength={docMaxLength}
          error={ce?.cedula?.message}
          hint={docHint}
          {...register('comprador.cedula')}
        />
        <Input
          id="comprador.nombres"
          label="Nombres completos"
          placeholder="Juan Carlos Pérez López"
          error={ce?.nombres?.message}
          {...register('comprador.nombres')}
        />
        <div className="sm:col-span-2">
          <Input
            id="comprador.direccion"
            label="Dirección"
            placeholder="Av. Amazonas N24-123, Quito"
            error={ce?.direccion?.message}
            {...register('comprador.direccion')}
          />
        </div>
        <Input
          id="comprador.telefono"
          label="Teléfono"
          type="tel"
          placeholder="0991234567"
          error={ce?.telefono?.message}
          {...register('comprador.telefono')}
        />
        <Input
          id="comprador.email"
          label="Correo electrónico"
          type="email"
          placeholder="juan@email.com"
          error={ce?.email?.message}
          {...register('comprador.email')}
        />
      </div>

      <LegalFields prefix="comprador" />
    </div>
  )
}
