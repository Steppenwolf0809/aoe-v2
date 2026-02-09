import { z } from 'zod'

export const leadCaptureSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  name: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().min(1, 'Se requiere la fuente del lead'),
})

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>

export const calculatorSessionSchema = z.object({
  type: z.string().min(1),
  inputs: z.record(z.string(), z.unknown()),
  result: z.record(z.string(), z.unknown()),
  visitorId: z.string().optional(),
})

export type CalculatorSessionInput = z.infer<typeof calculatorSessionSchema>
