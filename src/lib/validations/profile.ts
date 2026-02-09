import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre es demasiado largo'),
  phone: z
    .string()
    .trim()
    .max(30, 'El telefono es demasiado largo')
    .optional()
    .or(z.literal('')),
})

export type ProfileInput = z.infer<typeof profileSchema>
