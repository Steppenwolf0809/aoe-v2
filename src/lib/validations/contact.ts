import { z } from 'zod'

export const contactSchema = z.object({
  nombre: z.string().min(3, 'Nombre muy corto'),
  email: z.string().email('Email invalido'),
  telefono: z.string().optional(),
  asunto: z.string().min(5, 'Asunto muy corto'),
  mensaje: z.string().min(10, 'Mensaje muy corto'),
})

export type ContactInput = z.infer<typeof contactSchema>
