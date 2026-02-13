import { z } from 'zod'

// --- Enums & Labels ---

export const ESTADOS_CIVILES = [
  'soltero',
  'casado',
  'divorciado',
  'viudo',
  'union_de_hecho',
] as const

export type EstadoCivil = (typeof ESTADOS_CIVILES)[number]

export const ESTADOS_CIVILES_LABELS: Record<EstadoCivil, string> = {
  soltero: 'Soltero/a',
  casado: 'Casado/a',
  divorciado: 'Divorciado/a',
  viudo: 'Viudo/a',
  union_de_hecho: 'Union de hecho',
}

export const COMPARECENCIA_TIPOS = [
  'propios_derechos',
  'apoderado',
] as const

export type Comparecencia = (typeof COMPARECENCIA_TIPOS)[number]

// --- Sub-schemas ---

export const vehiculoSchema = z.object({
  placa: z.string().regex(/^[A-Z]{3}-\d{3,4}$/, 'Formato: ABC-1234'),
  marca: z.string().min(2, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  anio: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().min(2, 'Color requerido'),
  motor: z.string().min(3, 'Numero de motor requerido'),
  chasis: z.string().min(3, 'Numero de chasis requerido'),
  avaluo: z.number().positive('Debe ser mayor a 0'),
  valorContrato: z.number().positive('Valor del contrato debe ser mayor a 0'),
})

// Sub-schemas are lenient (just strings) — actual business-rule validation
// lives in personaSchema.check() so empty defaults don't block the form.
export const conyugeSchema = z.object({
  nombres: z.string(),
  cedula: z.string(),
})

export const apoderadoSchema = z.object({
  nombres: z.string(),
  cedula: z.string(),
  notariaPoder: z.string(),
  fechaPoder: z.string(),
})

export const personaSchema = z.object({
  cedula: z.string().length(10, 'Cedula debe tener 10 digitos'),
  nombres: z.string().min(3, 'Nombre muy corto'),
  direccion: z.string().min(5, 'Direccion requerida'),
  telefono: z.string().min(7, 'Telefono requerido'),
  email: z.string().email('Email invalido'),
  estadoCivil: z.enum(ESTADOS_CIVILES, {
    message: 'Estado civil requerido',
  }),
  comparecencia: z.enum(COMPARECENCIA_TIPOS, {
    message: 'Tipo de comparecencia requerido',
  }),
  conyuge: conyugeSchema.optional(),
  apoderado: apoderadoSchema.optional(),
}).check((ctx) => {
  const data = ctx.value
  const needsConyuge =
    data.estadoCivil === 'casado' || data.estadoCivil === 'union_de_hecho'

  if (needsConyuge) {
    if (!data.conyuge?.nombres || data.conyuge.nombres.length < 3) {
      ctx.issues.push({
        code: 'custom',
        message: 'Nombre del conyuge requerido',
        path: ['conyuge', 'nombres'],
        input: data.conyuge?.nombres,
      })
    }
    if (!data.conyuge?.cedula || data.conyuge.cedula.length !== 10) {
      ctx.issues.push({
        code: 'custom',
        message: 'Cedula del conyuge debe tener 10 digitos',
        path: ['conyuge', 'cedula'],
        input: data.conyuge?.cedula,
      })
    }
  }

  if (data.comparecencia === 'apoderado') {
    if (!data.apoderado?.nombres || data.apoderado.nombres.length < 3) {
      ctx.issues.push({
        code: 'custom',
        message: 'Nombre del apoderado requerido',
        path: ['apoderado', 'nombres'],
        input: data.apoderado?.nombres,
      })
    }
    if (!data.apoderado?.cedula || data.apoderado.cedula.length !== 10) {
      ctx.issues.push({
        code: 'custom',
        message: 'Cedula del apoderado debe tener 10 digitos',
        path: ['apoderado', 'cedula'],
        input: data.apoderado?.cedula,
      })
    }
    if (
      !data.apoderado?.notariaPoder ||
      data.apoderado.notariaPoder.length < 3
    ) {
      ctx.issues.push({
        code: 'custom',
        message: 'Notaria del poder requerida',
        path: ['apoderado', 'notariaPoder'],
        input: data.apoderado?.notariaPoder,
      })
    }
    if (!data.apoderado?.fechaPoder || data.apoderado.fechaPoder.length < 5) {
      ctx.issues.push({
        code: 'custom',
        message: 'Fecha del poder requerida',
        path: ['apoderado', 'fechaPoder'],
        input: data.apoderado?.fechaPoder,
      })
    }
  }
})

// --- Contract schema ---

export const contratoVehicularSchema = z.object({
  vehiculo: vehiculoSchema,
  comprador: personaSchema,
  vendedor: personaSchema,
})

export type ContratoVehicular = z.infer<typeof contratoVehicularSchema>

// --- Helpers ---

/** Returns true if the person's estado civil requires conyuge data */
export function requiresConyuge(
  estadoCivil: string | undefined,
): boolean {
  return estadoCivil === 'casado' || estadoCivil === 'union_de_hecho'
}

/**
 * Count the number of notarial certifications (firmas) needed.
 * 1 per compareciente + 1 for vehicle registration (matricula).
 */
export function countFirmas(data: ContratoVehicular): number {
  let comparecientes = 2 // base: comprador + vendedor

  if (requiresConyuge(data.comprador.estadoCivil) && data.comprador.conyuge?.cedula) {
    comparecientes++
  }
  if (requiresConyuge(data.vendedor.estadoCivil) && data.vendedor.conyuge?.cedula) {
    comparecientes++
  }

  return comparecientes + 1 // +1 certificacion de matricula
}
