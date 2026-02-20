/**
 * Tipos compartidos para todas las calculadoras
 */

// ============================================
// TIPOS BASE
// ============================================

export interface DesgloseItem {
  concepto: string
  valor: number
  porcentaje?: number
  isHighlight?: boolean
}

export interface ResultadoBase {
  desglose: DesgloseItem[]
  total: number
  notas?: string[]
}

// ============================================
// CALCULADORA NOTARIAL
// ============================================

export type TipoServicioNotarial =
  | 'TRANSFERENCIA_DOMINIO'
  | 'HIPOTECA'
  | 'PROMESA_COMPRAVENTA'
  | 'CONSTITUCION_CIA'
  | 'ACTO_CUANTIA_INDETERMINADA'
  | 'CONTRATO_ARRIENDO_ESCRITURA'
  | 'INSCRIPCION_ARRENDAMIENTO'
  | 'PODER_GENERAL_PN'
  | 'PODER_GENERAL_PJ'
  | 'CAPITULACIONES_MATRIMONIALES'
  | 'TESTAMENTO_ABIERTO'
  | 'TESTAMENTO_CERRADO'
  | 'UNION_HECHO'
  | 'DIVORCIO'
  | 'TERMINACION_UNION_HECHO'
  | 'POSESION_EFECTIVA'
  | 'CANCELACION_HIPOTECA'
  | 'SALIDA_PAIS'
  | 'RECONOCIMIENTO_FIRMA'
  | 'DECLARACION_JURAMENTADA'
  | 'DECLARACION_JURAMENTADA_PJ'

export interface InputNotarial {
  tipoServicio: TipoServicioNotarial
  cuantia: number
  cantidadMenores?: number // Para salida del país
  tiempoMeses?: number // Para arrendamientos
  esViviendaSocial?: boolean
  esTerceraEdad?: boolean
  actoIndeterminadoId?: string
  cantidadActoIndeterminado?: number
}

export interface ItemAdicional {
  id: string
  tipo: 
    | 'copia_certificada'
    | 'declaracion_juramentada'
    | 'declaracion_juramentada_pj'
    | 'poder'
    | 'cancelacion_hipoteca'
    | 'reconocimiento_firma'
    | 'autenticacion_firma'
    | 'materializacion'
    | 'protocolizacion'
    | 'marginacion'
  descripcion: string
  cantidad: number
  valorUnitario: number
  subtotal: number
}

export interface ResultadoNotarial {
  subtotal: number
  descuento: number
  razonDescuento?: string
  iva: number
  total: number
  detalles: string[]
  itemsAdicionales: ItemAdicional[]
  totalItemsAdicionales: number
  granTotal: number
}

// ============================================
// CALCULADORA MUNICIPAL
// ============================================

export interface InputMunicipal {
  fechaAdquisicion: string
  fechaTransferencia: string
  valorTransferencia: number
  valorAdquisicion: number
  avaluoCatastral: number
  tipoTransferencia: 'Compraventa' | 'Donación' | 'Dación en pago'
  tipoTransferente: 'Natural' | 'Inmobiliaria'
  mejoras?: number
  contribucionMejoras?: number
}

export interface ResultadoMunicipal {
  utilidad: {
    utilidadBruta: number
    añosTranscurridos: number
    deduccionTiempo: number
    baseImponible: number
    tarifaAplicada: number
    tarifaDescripcion: string
    impuesto: number
  }
  alcabala: {
    baseImponible: number
    tarifa: number
    mesesTranscurridos: number
    porcentajeRebaja: number
    rebajaDescripcion: string
    impuestoAntesRebaja: number
    rebaja: number
    impuesto: number
  }
  totalVendedor: number
  totalComprador: number
  total: number
}

// ============================================
// CALCULADORA REGISTRO
// ============================================

export interface InputRegistro {
  valorContrato: number
  esTerceraEdad: boolean
  esDiscapacitado: boolean
}

export interface ResultadoRegistro {
  valorContrato: number
  rango: number
  arancelBase: number
  exceso: number | null
  descuentos: Array<{
    tipo: string
    porcentaje: number
    valor: number
  }>
  arancelFinal: number
  excedeMaximo: boolean
}

// ============================================
// CONSTANTES COMPARTIDAS
// ============================================

export const SBU_2026 = 482
export const IVA_RATE = 0.15
