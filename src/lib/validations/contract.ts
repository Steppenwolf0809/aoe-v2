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

/**
 * Base persona schema (shared structure).
 * Validation of conyuge requireness is done at the contract level
 * so that buyer vs seller rules can differ.
 */
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
  /**
   * Optional: only relevant for comprador when casado/union_de_hecho.
   * For vendedor, conyuge requirement is enforced at contract schema level.
   */
  incluirConyuge: z.boolean().optional(),
  conyuge: conyugeSchema.optional(),
  apoderado: apoderadoSchema.optional(),
}).check((ctx) => {
  const data = ctx.value

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

// --- Contract schema with differentiated conyuge validation ---

export const contratoVehicularSchema = z.object({
  vehiculo: vehiculoSchema,
  comprador: personaSchema,
  vendedor: personaSchema,
}).check((ctx) => {
  const { vendedor, comprador } = ctx.value

  // VENDEDOR: conyuge always required when casado/union_de_hecho
  const vendedorNeedsConjuge = vendedor.estadoCivil === 'casado' || vendedor.estadoCivil === 'union_de_hecho'
  if (vendedorNeedsConjuge) {
    if (!vendedor.conyuge?.nombres || vendedor.conyuge.nombres.length < 3) {
      ctx.issues.push({
        code: 'custom',
        message: 'Nombre del conyuge requerido',
        path: ['vendedor', 'conyuge', 'nombres'],
        input: vendedor.conyuge?.nombres,
      })
    }
    if (!vendedor.conyuge?.cedula || vendedor.conyuge.cedula.length !== 10) {
      ctx.issues.push({
        code: 'custom',
        message: 'Cedula del conyuge debe tener 10 digitos',
        path: ['vendedor', 'conyuge', 'cedula'],
        input: vendedor.conyuge?.cedula,
      })
    }
  }

  // COMPRADOR: conyuge only required if they explicitly chose to include it
  const compradorCouldNeedConyuge = comprador.estadoCivil === 'casado' || comprador.estadoCivil === 'union_de_hecho'
  if (compradorCouldNeedConyuge && comprador.incluirConyuge === true) {
    if (!comprador.conyuge?.nombres || comprador.conyuge.nombres.length < 3) {
      ctx.issues.push({
        code: 'custom',
        message: 'Nombre del conyuge requerido',
        path: ['comprador', 'conyuge', 'nombres'],
        input: comprador.conyuge?.nombres,
      })
    }
    if (!comprador.conyuge?.cedula || comprador.conyuge.cedula.length !== 10) {
      ctx.issues.push({
        code: 'custom',
        message: 'Cedula del conyuge debe tener 10 digitos',
        path: ['comprador', 'conyuge', 'cedula'],
        input: comprador.conyuge?.cedula,
      })
    }
  }
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
 * Returns true if the COMPRADOR's conyuge should appear in the contract.
 * Requires both: estado civil is casado/union AND they explicitly opted in.
 */
export function compradorIncludesConyuge(comprador: ContratoVehicular['comprador']): boolean {
  return requiresConyuge(comprador.estadoCivil) && comprador.incluirConyuge === true
}

/**
 * Count the number of notarial certifications (firmas) needed.
 * 1 per compareciente + 1 for vehicle registration (matricula).
 */
export function countFirmas(data: ContratoVehicular): number {
  let comparecientes = 2 // base: comprador + vendedor

  if (compradorIncludesConyuge(data.comprador)) {
    comparecientes++
  }
  if (requiresConyuge(data.vendedor.estadoCivil) && data.vendedor.conyuge?.cedula) {
    comparecientes++
  }

  return comparecientes + 1 // +1 certificacion de matricula
}
