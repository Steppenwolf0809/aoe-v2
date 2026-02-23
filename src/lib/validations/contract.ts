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
  union_de_hecho: 'Unión de hecho',
}

export const COMPARECENCIA_TIPOS = [
  'propios_derechos',
  'apoderado',
] as const

export type Comparecencia = (typeof COMPARECENCIA_TIPOS)[number]

export const SEXOS = ['M', 'F'] as const
export type Sexo = (typeof SEXOS)[number]

export const TIPOS_DOCUMENTO = ['cedula', 'pasaporte'] as const
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number]

export const TIPOS_ANTECEDENTE = [
  'compraventa',
  'herencia',
  'donacion',
  'importacion',
] as const
export type TipoAntecedente = (typeof TIPOS_ANTECEDENTE)[number]

export const TIPOS_ANTECEDENTE_LABELS: Record<TipoAntecedente, string> = {
  compraventa: 'Compraventa',
  herencia: 'Herencia / Posesión efectiva',
  donacion: 'Donación',
  importacion: 'Importación directa',
}

export const FORMAS_PAGO = [
  'transferencia',
  'efectivo',
  'cheque_certificado',
] as const
export type FormaPago = (typeof FORMAS_PAGO)[number]

export const FORMAS_PAGO_LABELS: Record<FormaPago, string> = {
  transferencia: 'Transferencia bancaria',
  efectivo: 'Efectivo',
  cheque_certificado: 'Cheque certificado',
}

// --- Sub-schemas ---

export const vehiculoSchema = z.object({
  placa: z.string().regex(/^[A-Z]{3}-\d{3,4}$/, 'Formato: ABC-1234'),
  marca: z.string().min(2, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  anio: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().min(2, 'Color requerido'),
  motor: z.string().min(3, 'Número de motor requerido'),
  chasis: z.string().min(3, 'Número de chasis requerido'),
  avaluo: z.number().positive('Debe ser mayor a 0'),
  valorContrato: z.number().positive('Valor del contrato debe ser mayor a 0'),
  // New v2 fields
  tipo: z.string().min(2, 'Tipo de vehículo requerido'),
  cilindraje: z.number().positive('Cilindraje requerido'),
  carroceria: z.string().min(2, 'Carrocería requerida'),
  clase: z.string().min(2, 'Clase requerida'),
  pais: z.string().min(2, 'País de origen requerido'),
  combustible: z.string().min(2, 'Combustible requerido'),
  pasajeros: z.number().min(1, 'Número de pasajeros requerido'),
  servicio: z.string().min(2, 'Servicio requerido'),
  // Optional v2 fields
  tonelaje: z.string().optional(),
})

// Sub-schemas are lenient (just strings) — actual business-rule validation
// lives in personaSchema.check() so empty defaults don't block the form.
export const conyugeSchema = z.object({
  nombres: z.string(),
  cedula: z.string(),
  sexo: z.enum(SEXOS).optional(),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO).optional(),
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
  cedula: z.string().min(1, 'Documento requerido'),
  nombres: z.string().min(3, 'Nombre muy corto'),
  direccion: z.string().min(5, 'Dirección requerida'),
  telefono: z.string().min(7, 'Teléfono requerido'),
  email: z.string().email('Email inválido'),
  // New v2 fields
  sexo: z.enum(SEXOS, { message: 'Seleccione sexo' }),
  nacionalidad: z.string().min(2, 'Nacionalidad requerida'),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO, { message: 'Tipo de documento requerido' }),
  // Existing fields
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

  // Validate documento based on tipoDocumento
  if (data.tipoDocumento === 'cedula') {
    if (data.cedula.length !== 10) {
      ctx.issues.push({
        code: 'custom',
        message: 'Cédula debe tener 10 dígitos',
        path: ['cedula'],
        input: data.cedula,
      })
    }
  } else if (data.tipoDocumento === 'pasaporte') {
    if (data.cedula.length < 5) {
      ctx.issues.push({
        code: 'custom',
        message: 'Número de pasaporte debe tener al menos 5 caracteres',
        path: ['cedula'],
        input: data.cedula,
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
    if (!data.apoderado?.cedula || data.apoderado.cedula.length < 5) {
      ctx.issues.push({
        code: 'custom',
        message: 'Documento del apoderado requerido',
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
        message: 'Notaría del poder requerida',
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

// --- Herencia sub-schema (only when tipoAntecedente = herencia) ---

export const herenciaSchema = z.object({
  causanteNombre: z.string().min(3, 'Nombre del causante requerido'),
  causanteFechaFallecimiento: z.string().min(5, 'Fecha de fallecimiento requerida'),
  posEfectivaNotaria: z.string().min(3, 'Notaría de posesión efectiva requerida'),
  posEfectivaFecha: z.string().min(5, 'Fecha de posesión efectiva requerida'),
  herederosLista: z.string().min(3, 'Lista de herederos requerida'),
  parentesco: z.string().min(3, 'Parentesco requerido'),
})

// --- Contract schema with differentiated conyuge validation ---

export const contratoVehicularSchema = z.object({
  vehiculo: vehiculoSchema,
  comprador: personaSchema,
  vendedor: personaSchema,
  // New v2 fields — antecedentes
  tipoAntecedente: z.enum(TIPOS_ANTECEDENTE),
  cuvNumero: z.string().optional(),
  cuvFecha: z.string().optional(),
  fechaInscripcion: z.string().optional(),
  matriculaVigencia: z.string().optional(),
  // Herencia data (only required when tipoAntecedente = herencia)
  herencia: herenciaSchema.optional(),
  // New v2 fields — financiero
  formaPago: z.enum(FORMAS_PAGO),
  // New v2 fields — observaciones
  tieneObservaciones: z.boolean(),
  observacionesTexto: z.string().optional(),
}).check((ctx) => {
  const { vendedor, comprador } = ctx.value

  // VENDEDOR: conyuge always required when casado/union_de_hecho
  const vendedorNeedsConjuge = vendedor.estadoCivil === 'casado' || vendedor.estadoCivil === 'union_de_hecho'
  if (vendedorNeedsConjuge) {
    if (!vendedor.conyuge?.nombres || vendedor.conyuge.nombres.length < 3) {
      ctx.issues.push({
        code: 'custom',
        message: 'Nombre del cónyuge requerido',
        path: ['vendedor', 'conyuge', 'nombres'],
        input: vendedor.conyuge?.nombres,
      })
    }
    if (!vendedor.conyuge?.cedula || vendedor.conyuge.cedula.length < 5) {
      ctx.issues.push({
        code: 'custom',
        message: 'Documento del cónyuge requerido',
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
        message: 'Nombre del cónyuge requerido',
        path: ['comprador', 'conyuge', 'nombres'],
        input: comprador.conyuge?.nombres,
      })
    }
    if (!comprador.conyuge?.cedula || comprador.conyuge.cedula.length < 5) {
      ctx.issues.push({
        code: 'custom',
        message: 'Documento del cónyuge requerido',
        path: ['comprador', 'conyuge', 'cedula'],
        input: comprador.conyuge?.cedula,
      })
    }
  }

  // HERENCIA: fields required when tipoAntecedente = herencia
  if (ctx.value.tipoAntecedente === 'herencia') {
    if (!ctx.value.herencia) {
      ctx.issues.push({
        code: 'custom',
        message: 'Datos de herencia requeridos para este tipo de antecedente',
        path: ['herencia'],
        input: ctx.value.herencia,
      })
    }
  }

  // OBSERVACIONES: text required when tieneObservaciones = true
  if (ctx.value.tieneObservaciones && (!ctx.value.observacionesTexto || ctx.value.observacionesTexto.trim().length < 5)) {
    ctx.issues.push({
      code: 'custom',
      message: 'Texto de observaciones requerido (mínimo 5 caracteres)',
      path: ['observacionesTexto'],
      input: ctx.value.observacionesTexto,
    })
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

// --- Gender resolution helpers (v2) ---

export interface GeneroResuelto {
  articulo: string       // "el señor" / "la señora"
  portador: string       // "portador" / "portadora"
  casado: string         // "casado" / "casada"
  soltero: string        // "soltero" / "soltera"
  divorciado: string     // "divorciado" / "divorciada"
  viudo: string          // "viudo" / "viuda"
  domiciliado: string    // "domiciliado" / "domiciliada"
  denominacionVendedor: string  // "EL VENDEDOR" / "LA VENDEDORA"
  denominacionComprador: string  // "EL COMPRADOR" / "LA COMPRADORA"
  propietario: string    // "legítimo propietario" / "legítima propietaria"
  satisfecho: string     // "satisfecho" / "satisfecha"
  cancelado: string      // "cancelado" / "cancelada"
}

export function resolverGenero(sexo: Sexo): GeneroResuelto {
  if (sexo === 'F') {
    return {
      articulo: 'la señora',
      portador: 'portadora',
      casado: 'casada',
      soltero: 'soltera',
      divorciado: 'divorciada',
      viudo: 'viuda',
      domiciliado: 'domiciliada',
      denominacionVendedor: 'LA VENDEDORA',
      denominacionComprador: 'LA COMPRADORA',
      propietario: 'legítima propietaria',
      satisfecho: 'satisfecha',
      cancelado: 'cancelada',
    }
  }
  return {
    articulo: 'el señor',
    portador: 'portador',
    casado: 'casado',
    soltero: 'soltero',
    divorciado: 'divorciado',
    viudo: 'viudo',
    domiciliado: 'domiciliado',
    denominacionVendedor: 'EL VENDEDOR',
    denominacionComprador: 'EL COMPRADOR',
    propietario: 'legítimo propietario',
    satisfecho: 'satisfecho',
    cancelado: 'cancelado',
  }
}

/**
 * Resolve the estado civil label with the correct gender.
 */
export function resolverEstadoCivil(estadoCivil: EstadoCivil, sexo: Sexo): string {
  const g = resolverGenero(sexo)
  switch (estadoCivil) {
    case 'casado': return g.casado
    case 'soltero': return g.soltero
    case 'divorciado': return g.divorciado
    case 'viudo': return g.viudo
    case 'union_de_hecho': return 'en unión de hecho'
  }
}

/**
 * Build the document identification text based on type.
 * Cédula: "cédula de ciudadanía número uno siete ... (No. 1712345678)"
 * Pasaporte: "pasaporte número AB1234567"
 */
export function buildTextoDocumento(
  tipoDoc: TipoDocumento,
  numero: string,
): string {
  if (tipoDoc === 'pasaporte') {
    return `pasaporte número ${numero}`
  }
  // Cédula: convert each digit to word
  const DIGITO_LETRAS: Record<string, string> = {
    '0': 'cero', '1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro',
    '5': 'cinco', '6': 'seis', '7': 'siete', '8': 'ocho', '9': 'nueve',
  }
  const enLetras = numero.split('').map(d => DIGITO_LETRAS[d] ?? d).join(' ')
  return `cédula de ciudadanía número ${enLetras} (No. ${numero})`
}

/**
 * Label for forma de pago in the contract text.
 */
export function getFormaPagoTexto(formaPago: FormaPago): string {
  return FORMAS_PAGO_LABELS[formaPago] ?? formaPago
}
