'use client'

import { useFormContext } from 'react-hook-form'
import { UserMinus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ContratoVehicular } from '@/lib/validations/contract'

export function SellerForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ContratoVehicular>()

  const se = errors.vendedor

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
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vendedor.cedula"
          label="Cedula de identidad"
          placeholder="1712345678"
          maxLength={10}
          error={se?.cedula?.message}
          hint="10 digitos sin guiones"
          {...register('vendedor.cedula')}
        />
        <Input
          id="vendedor.nombres"
          label="Nombres completos"
          placeholder="Maria Elena Garcia Torres"
          error={se?.nombres?.message}
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
    </div>
  )
}
