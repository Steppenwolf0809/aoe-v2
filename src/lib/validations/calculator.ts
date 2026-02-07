import { z } from 'zod'

export const calculatorInputSchema = z.object({
  avaluoCatastral: z.number().positive('El avaluo debe ser mayor a 0'),
  precioVenta: z.number().positive('El precio debe ser mayor a 0').optional(),
  aniosPropiedad: z.number().min(0).optional(),
})

export type CalculatorInputData = z.infer<typeof calculatorInputSchema>
