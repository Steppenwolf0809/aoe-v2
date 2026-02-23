'use client'

import { useFormContext } from 'react-hook-form'
import { UserMinus, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { LegalFields } from './legal-fields'

export function SellerForm() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ContratoVehicular>()

  const vendedorNombres = watch('vendedor.nombres')
  const tipoDocumento = watch('vendedor.tipoDocumento')

  const se = errors.vendedor

  // Dynamic label for document field
  const docLabel = tipoDocumento === 'pasaporte' ? 'Número de pasaporte' : 'Cédula de identidad'
  const docPlaceholder = tipoDocumento === 'pasaporte' ? 'AB1234567' : '1712345678'
  const docHint = tipoDocumento === 'pasaporte' ? 'Letras y números' : '10 dígitos sin guiones'
  const docMaxLength = tipoDocumento === 'pasaporte' ? 20 : 10

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
            Información de quien vende el vehículo.
          </p>
          {vendedorNombres && (
            <div className="flex items-center gap-1 mt-1 text-xs text-accent-primary">
              <FileText className="w-3 h-3" />
              <span>Pre-llenado desde CUV</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vendedor.cedula"
          label={docLabel}
          placeholder={docPlaceholder}
          maxLength={docMaxLength}
          error={se?.cedula?.message}
          hint={docHint}
          {...register('vendedor.cedula')}
        />
        <Input
          id="vendedor.nombres"
          label="Nombres completos"
          placeholder="María Elena García Torres"
          error={se?.nombres?.message}
          {...register('vendedor.nombres')}
        />
        <div className="sm:col-span-2">
          <Input
            id="vendedor.direccion"
            label="Dirección"
            placeholder="Av. 6 de Diciembre N32-456, Quito"
            error={se?.direccion?.message}
            {...register('vendedor.direccion')}
          />
        </div>
        <Input
          id="vendedor.telefono"
          label="Teléfono"
          type="tel"
          placeholder="0987654321"
          error={se?.telefono?.message}
          {...register('vendedor.telefono')}
        />
        <Input
          id="vendedor.email"
          label="Correo electrónico"
          type="email"
          placeholder="maria@email.com"
          error={se?.email?.message}
          {...register('vendedor.email')}
        />
      </div>

      <LegalFields prefix="vendedor" />
    </div>
  )
}
