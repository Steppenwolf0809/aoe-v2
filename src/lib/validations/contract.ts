import { z } from 'zod'

export const vehiculoSchema = z.object({
  placa: z.string().regex(/^[A-Z]{3}-\d{3,4}$/, 'Formato: ABC-1234'),
  marca: z.string().min(2, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  anio: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().min(2, 'Color requerido'),
  motor: z.string().min(3, 'Numero de motor requerido'),
  chasis: z.string().min(3, 'Numero de chasis requerido'),
  avaluo: z.number().positive('Debe ser mayor a 0'),
})

export const personaSchema = z.object({
  cedula: z.string().length(10, 'Cedula debe tener 10 digitos'),
  nombres: z.string().min(3, 'Nombre muy corto'),
  direccion: z.string().min(5, 'Direccion requerida'),
  telefono: z.string().min(7, 'Telefono requerido'),
  email: z.string().email('Email invalido'),
})

export const contratoVehicularSchema = z.object({
  vehiculo: vehiculoSchema,
  comprador: personaSchema,
  vendedor: personaSchema,
})

export type ContratoVehicular = z.infer<typeof contratoVehicularSchema>
