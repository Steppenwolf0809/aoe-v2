'use client'

import { useFormContext } from 'react-hook-form'
import { Car } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { ContratoVehicular } from '@/lib/validations/contract'

export function VehicleDataForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ContratoVehicular>()

  const ve = errors.vehiculo

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-accent-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Datos del vehiculo
          </h2>
          <p className="text-sm text-text-secondary">
            Ingresa la informacion del vehiculo a transferir.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="vehiculo.placa"
          label="Placa"
          placeholder="ABC-1234"
          error={ve?.placa?.message}
          {...register('vehiculo.placa', {
            setValueAs: (v: string) => v.toUpperCase(),
          })}
        />
        <Input
          id="vehiculo.marca"
          label="Marca"
          placeholder="Toyota, Chevrolet..."
          error={ve?.marca?.message}
          {...register('vehiculo.marca')}
        />
        <Input
          id="vehiculo.modelo"
          label="Modelo"
          placeholder="Corolla, Aveo..."
          error={ve?.modelo?.message}
          {...register('vehiculo.modelo')}
        />
        <Input
          id="vehiculo.anio"
          label="Ano"
          type="number"
          placeholder="2024"
          error={ve?.anio?.message}
          {...register('vehiculo.anio', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.color"
          label="Color"
          placeholder="Blanco, Negro..."
          error={ve?.color?.message}
          {...register('vehiculo.color')}
        />
        <Input
          id="vehiculo.avaluo"
          label="Avaluo comercial ($)"
          type="number"
          placeholder="15000"
          error={ve?.avaluo?.message}
          hint="Valor comercial estimado del vehiculo"
          {...register('vehiculo.avaluo', { valueAsNumber: true })}
        />
        <Input
          id="vehiculo.motor"
          label="Numero de motor"
          placeholder="Ej: 2NR-FKE1234567"
          error={ve?.motor?.message}
          {...register('vehiculo.motor')}
        />
        <Input
          id="vehiculo.chasis"
          label="Numero de chasis"
          placeholder="Ej: 9BR53ZEC2L1234567"
          error={ve?.chasis?.message}
          {...register('vehiculo.chasis')}
        />
      </div>
    </div>
  )
}
