/**
 * Notarial calculator logic for Ecuador (AOE v2)
 * Uses tariff catalog from src/lib/tariffs/notarial-ecuador-2026.json
 */

import tariffCatalog from '@/lib/tariffs/notarial-ecuador-2026.json'

// ============================================
// CONSTANTS
// ============================================

type TipoValorIndeterminado = 'porcentaje_sbu' | 'fijo_usd'

interface TarifaRangoRaw {
  desde: number
  hasta: number | null
  sbu: number
}

interface TarifaExcedenteRaw {
  desde: number
  base_sbu: number
  base_desde: number
  factor: number
}

interface ActoIndeterminadoRaw {
  id: string
  concepto: string
  valor: number
  tipo: TipoValorIndeterminado
}

interface CatalogoTarifasNotariales {
  metadata: {
    sbu: number
    iva: number
  }
  tablas: {
    tabla1_transferencia_dominio: {
      rangos: TarifaRangoRaw[]
      excedente: TarifaExcedenteRaw
    }
    tabla2_promesa_compraventa: {
      rangos: TarifaRangoRaw[]
      excedente: TarifaExcedenteRaw
    }
    tabla3_hipoteca: {
      rangos: TarifaRangoRaw[]
      excedente: TarifaExcedenteRaw
    }
    tabla5_arrendamiento_inscripcion: {
      // Art. 41: para canon <= limite, la tarifa es porcentual sobre el canon (no SBU).
      regla_hasta_375: { factor: number; limite: number }
      rangos: TarifaRangoRaw[]
    }
    tabla7_constitucion_sociedades: {
      rangos: TarifaRangoRaw[]
      escalas_excedente: TarifaExcedenteRaw[]
    }
    tabla_indeterminada: {
      actos: ActoIndeterminadoRaw[]
    }
  }
  tarifas_fijas_sbu: Record<string, number>
}

interface ReglaTarifaRaw {
  min: number
  max: number | null
  tipo: string
  tarifa_sbu?: number
  tarifa_base_sbu?: number
  factor_excedente?: number
  factor_porcentaje_monto?: number
}

interface TablaTarifaRaw {
  id: string
  reglas: ReglaTarifaRaw[]
}

interface TarifaFijaAnexoRaw {
  concepto: string
  porcentaje_sbu: number
}

interface TariffCatalogRaw {
  configuracion: {
    sbu_actual: number
  }
  tablas: TablaTarifaRaw[]
  tarifas_fijas_anexo_2: TarifaFijaAnexoRaw[]
}

const DEFAULT_IVA = 0.15
const DEFAULT_ACTOS_INDETERMINADOS: ActoIndeterminadoRaw[] = [
  { id: 'poder_especial', concepto: 'Poder especial', valor: 0.12, tipo: 'porcentaje_sbu' },
  { id: 'declaracion_jurada', concepto: 'Declaracion juramentada', valor: 0.05, tipo: 'porcentaje_sbu' },
  { id: 'autorizacion_salida', concepto: 'Autorizacion salida del pais', valor: 0.05, tipo: 'porcentaje_sbu' },
]

const DEFAULT_TARIFAS_FIJAS_SBU: Record<string, number> = {
  SALIDA_PAIS: 0.05,
  RECONOCIMIENTO_FIRMA: 0.03,
  DECLARACION_JURAMENTADA: 0.05,
}

function normalizarTexto(value: string) {
  return value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function crearExcedente(rule: ReglaTarifaRaw): TarifaExcedenteRaw {
  const baseDesde = Math.floor(rule.min)

  return {
    desde: rule.min,
    base_sbu: rule.tarifa_base_sbu ?? 0,
    base_desde: baseDesde,
    factor: rule.factor_excedente ?? 0,
  }
}

function crearRangos(reglas: ReglaTarifaRaw[]): TarifaRangoRaw[] {
  return reglas
    .filter((rule) => rule.tipo === 'rango_simple')
    .map((rule) => ({
      desde: rule.min,
      hasta: rule.max,
      sbu: rule.tarifa_sbu ?? 0,
    }))
}

function buscarTabla(raw: TariffCatalogRaw, id: string): TablaTarifaRaw {
  const tabla = raw.tablas.find((item) => item.id === id)
  if (!tabla) {
    throw new Error(`[notarial] Tabla no encontrada en catalogo: ${id}`)
  }
  return tabla
}

function mapearTarifasFijas(rawTarifas: TarifaFijaAnexoRaw[]) {
  const conceptMap: Record<string, string> = {
    'CANCELACION DE HIPOTECAS': 'CANCELACION_HIPOTECA',
    'DIVORCIO POR MUTUO CONSENTIMIENTO': 'DIVORCIO',
    'UNION DE HECHO': 'UNION_HECHO',
    'TERMINACION DE UNION DE HECHO': 'TERMINACION_UNION_HECHO',
    'CAPITULACIONES MATRIMONIALES': 'CAPITULACIONES_MATRIMONIALES',
    'POSESION EFECTIVA': 'POSESION_EFECTIVA',
    'TESTAMENTO ABIERTO': 'TESTAMENTO_ABIERTO',
    'TESTAMENTO CERRADO': 'TESTAMENTO_CERRADO',
    'PODERES GENERALES (PERSONA NATURAL)': 'PODER_GENERAL_PN',
    'PODERES GENERALES (PERSONA JURIDICA)': 'PODER_GENERAL_PJ',
  }

  const mapped = rawTarifas.reduce<Record<string, number>>((acc, tarifa) => {
    const key = conceptMap[normalizarTexto(tarifa.concepto)]
    if (key) {
      acc[key] = tarifa.porcentaje_sbu
    }
    return acc
  }, {})

  return {
    ...DEFAULT_TARIFAS_FIJAS_SBU,
    ...mapped,
  }
}

function normalizarCatalogo(rawCatalog: TariffCatalogRaw): CatalogoTarifasNotariales {
  const tabla01 = buscarTabla(rawCatalog, 'tabla_01')
  const tabla02 = buscarTabla(rawCatalog, 'tabla_02')
  const tabla03 = buscarTabla(rawCatalog, 'tabla_03')
  const tabla05 = buscarTabla(rawCatalog, 'tabla_05')
  const tabla07 = buscarTabla(rawCatalog, 'tabla_07')

  const tabla01Excedente = tabla01.reglas.find((rule) => rule.tipo === 'excedente_unico')
  const tabla02Excedente = tabla02.reglas.find((rule) => rule.tipo === 'excedente_unico')
  const tabla03Excedente = tabla03.reglas.find((rule) => rule.tipo === 'excedente_unico')
  const tabla05Porcentaje = tabla05.reglas.find((rule) => rule.tipo === 'porcentaje_monto')
  const tabla07Excedentes = tabla07.reglas.filter((rule) => rule.tipo === 'excedente_escalonado')

  if (!tabla01Excedente || !tabla02Excedente || !tabla03Excedente || !tabla05Porcentaje) {
    throw new Error('[notarial] Catalogo de tarifas incompleto o con formato no soportado')
  }

  return {
    metadata: {
      sbu: rawCatalog.configuracion.sbu_actual,
      iva: DEFAULT_IVA,
    },
    tablas: {
      tabla1_transferencia_dominio: {
        rangos: crearRangos(tabla01.reglas),
        excedente: crearExcedente(tabla01Excedente),
      },
      tabla2_promesa_compraventa: {
        rangos: crearRangos(tabla02.reglas),
        excedente: crearExcedente(tabla02Excedente),
      },
      tabla3_hipoteca: {
        rangos: crearRangos(tabla03.reglas),
        excedente: crearExcedente(tabla03Excedente),
      },
      tabla5_arrendamiento_inscripcion: {
        regla_hasta_375: {
          factor: tabla05Porcentaje.factor_porcentaje_monto ?? 0,
          // Default defensivo: el catalogo actual usa max=375.
          limite: tabla05Porcentaje.max ?? 375,
        },
        rangos: crearRangos(tabla05.reglas),
      },
      tabla7_constitucion_sociedades: {
        rangos: crearRangos(tabla07.reglas),
        escalas_excedente: tabla07Excedentes.map(crearExcedente),
      },
      tabla_indeterminada: {
        actos: DEFAULT_ACTOS_INDETERMINADOS,
      },
    },
    tarifas_fijas_sbu: mapearTarifasFijas(rawCatalog.tarifas_fijas_anexo_2),
  }
}

const CATALOGO = normalizarCatalogo(tariffCatalog as TariffCatalogRaw)

export const SBU_2026 = CATALOGO.metadata.sbu
export const IVA_RATE = CATALOGO.metadata.iva
export const COSTO_FOJA = 1.79 // Art. 74 - Copias certificadas

const valorSBU = (multiplo: number) => Math.round(SBU_2026 * multiplo * 100) / 100

// ============================================
// SERVICE TYPES
// ============================================
export type TipoTramite =
  | 'TRANSFERENCIA_DOMINIO'
  | 'HIPOTECA'
  | 'PROMESA_COMPRAVENTA'
  | 'ACTO_CUANTIA_INDETERMINADA'
  | 'CANCELACION_HIPOTECA'
  | 'DIVORCIO'
  | 'UNION_HECHO'
  | 'TERMINACION_UNION_HECHO'
  | 'CAPITULACIONES_MATRIMONIALES'
  | 'SALIDA_PAIS'
  | 'TESTAMENTO_ABIERTO'
  | 'TESTAMENTO_CERRADO'
  | 'POSESION_EFECTIVA'
  | 'PODER_GENERAL_PN'
  | 'PODER_GENERAL_PJ'
  | 'CONSTITUCION_CIA'
  | 'RECONOCIMIENTO_FIRMA'
  | 'DECLARACION_JURAMENTADA'
  | 'CONTRATO_ARRIENDO_ESCRITURA'
  | 'INSCRIPCION_ARRENDAMIENTO'

// ============================================
// INTERFACES
// ============================================
export interface ResultadoCalculo {
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

export interface ItemAdicional {
  id: string
  tipo:
  | 'copia_certificada'
  | 'declaracion_juramentada'
  | 'poder'
  | 'poder_especial'
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

export interface OpcionesCalculo {
  cantidadMenores?: number
  esViviendaSocial?: boolean
  esTerceraEdad?: boolean
  tiempoMeses?: number
  itemsAdicionales?: ItemAdicional[]
  numeroOtorgantes?: number
  numeroFirmas?: number
  numeroHojas?: number
  actoIndeterminadoId?: string
  cantidadActoIndeterminado?: number
}

export interface ActoCuantiaIndeterminada {
  id: string
  concepto: string
  valor: number
  tipo: TipoValorIndeterminado
  valorReferencial: number
}

interface RangoTarifa {
  desde: number
  hasta: number
  tarifaBase: number
}

interface TarifaFija {
  porcentajeSBU: number
  descripcion: string
  porcentajeAdicional?: number
}

// ============================================
// TABLE MAPPERS
// ============================================

function mapearRangos(rangos: TarifaRangoRaw[]): RangoTarifa[] {
  return rangos.map((r) => ({
    desde: r.desde,
    hasta: r.hasta ?? Infinity,
    tarifaBase: valorSBU(r.sbu),
  }))
}

const TABLA_1_TRANSFERENCIA = mapearRangos(CATALOGO.tablas.tabla1_transferencia_dominio.rangos)
const EXCEDENTE_TABLA_1 = CATALOGO.tablas.tabla1_transferencia_dominio.excedente

const TABLA_2_PROMESAS = mapearRangos(CATALOGO.tablas.tabla2_promesa_compraventa.rangos)
const EXCEDENTE_TABLA_2 = CATALOGO.tablas.tabla2_promesa_compraventa.excedente

const TABLA_3_HIPOTECAS = mapearRangos(CATALOGO.tablas.tabla3_hipoteca.rangos)
const EXCEDENTE_TABLA_3 = CATALOGO.tablas.tabla3_hipoteca.excedente

const TABLA_7_SOCIEDADES = mapearRangos(CATALOGO.tablas.tabla7_constitucion_sociedades.rangos)
const EXCEDENTES_TABLA_7 = [...CATALOGO.tablas.tabla7_constitucion_sociedades.escalas_excedente].sort(
  (a, b) => b.desde - a.desde
)

const TABLA_5_ARRENDAMIENTOS = mapearRangos(CATALOGO.tablas.tabla5_arrendamiento_inscripcion.rangos)

const ACTOS_CUANTIA_INDETERMINADA = CATALOGO.tablas.tabla_indeterminada.actos

const DESCRIPCIONES_TARIFAS: Record<string, string> = {
  CANCELACION_HIPOTECA: '20% SBU - Cancelacion Hipoteca',
  CAPITULACIONES_MATRIMONIALES: '40% SBU - Capitulaciones Matrimoniales',
  DIVORCIO: '39% SBU - Divorcio',
  UNION_HECHO: '10% SBU - Union de Hecho',
  TERMINACION_UNION_HECHO: '39% SBU - Terminacion Union de Hecho',
  SALIDA_PAIS: '5% SBU por menor - Autorizacion Salida del Pais',
  TESTAMENTO_ABIERTO: '120% SBU - Testamento Abierto',
  TESTAMENTO_CERRADO: '100% SBU - Testamento Cerrado',
  POSESION_EFECTIVA: '40% SBU - Posesion Efectiva',
  PODER_GENERAL_PN: '12% SBU - Poder General Persona Natural',
  PODER_GENERAL_PJ: '50% SBU - Poder General Persona Juridica',
  RECONOCIMIENTO_FIRMA: '3% SBU - Reconocimiento de Firma',
  DECLARACION_JURAMENTADA: '5% SBU - Declaracion Juramentada',
}

const TARIFAS_FIJAS: Record<string, TarifaFija> = Object.fromEntries(
  Object.entries(CATALOGO.tarifas_fijas_sbu).map(([key, porcentajeSBU]) => [
    key,
    {
      porcentajeSBU,
      descripcion: DESCRIPCIONES_TARIFAS[key] ?? `${(porcentajeSBU * 100).toFixed(2)}% SBU`,
      porcentajeAdicional: key === 'PODER_GENERAL_PN' ? 0.03 : undefined,
    },
  ])
)

// ============================================
// EXTRA ITEMS
// ============================================
export const TARIFAS_ITEMS_ADICIONALES: Record<
  string,
  {
    nombre: string
    valorUnitario: number
    unidad: string
    descripcion?: string
    porcentajeSBU?: number
  }
> = {
  copia_certificada: {
    nombre: 'Copia Certificada',
    valorUnitario: COSTO_FOJA,
    unidad: 'foja',
    descripcion: 'Copia certificada de la escritura',
  },
  declaracion_juramentada: {
    nombre: 'Declaracion Juramentada',
    valorUnitario: SBU_2026 * 0.05,
    unidad: 'declaracion',
    descripcion: 'Declaracion juramentada',
    porcentajeSBU: 0.05,
  },
  poder: {
    nombre: 'Poder General/Especial/Procuracion',
    valorUnitario: SBU_2026 * 0.12,
    unidad: 'otorgante',
    descripcion: '12% primer otorgante, 3% adicionales',
    porcentajeSBU: 0.12,
  },
  poder_especial: {
    nombre: 'Poder Especial',
    valorUnitario: SBU_2026 * 0.12,
    unidad: 'otorgante',
    descripcion: '12% primer otorgante, 3% adicionales',
    porcentajeSBU: 0.12,
  },
  cancelacion_hipoteca: {
    nombre: 'Cancelacion de Hipoteca',
    valorUnitario: SBU_2026 * 0.2,
    unidad: 'cancelacion',
    descripcion: 'Cancelacion de hipoteca existente',
    porcentajeSBU: 0.2,
  },
  reconocimiento_firma: {
    nombre: 'Reconocimiento de Firma',
    valorUnitario: SBU_2026 * 0.03,
    unidad: 'firma',
    descripcion: 'Reconocimiento de firma en documento',
    porcentajeSBU: 0.03,
  },
  autenticacion_firma: {
    nombre: 'Autenticacion de Firma',
    valorUnitario: SBU_2026 * 0.04,
    unidad: 'firma',
    descripcion: 'Autenticacion de firma registrada',
    porcentajeSBU: 0.04,
  },
  materializacion: {
    nombre: 'Materializacion',
    valorUnitario: COSTO_FOJA * 2,
    unidad: 'documento',
    descripcion: 'Materializacion de documento electronico',
  },
  protocolizacion: {
    nombre: 'Protocolizacion',
    valorUnitario: SBU_2026 * 0.05,
    unidad: 'documento',
    descripcion: 'Protocolizacion de documento privado',
    porcentajeSBU: 0.05,
  },
  marginacion: {
    nombre: 'Marginacion/Razon',
    valorUnitario: 3,
    unidad: 'marginacion',
    descripcion: 'Marginacion o razon de inscripcion',
  },
}

// ============================================
// HELPERS
// ============================================

function buscarEnTabla(monto: number, tabla: RangoTarifa[]): RangoTarifa | undefined {
  return tabla.find((r) => monto >= r.desde && monto <= r.hasta)
}

function calcularExcedente(monto: number, limite: number, baseUSD: number, factor: number): number {
  const excedente = monto - limite
  return baseUSD + excedente * factor
}

function aplicarIVA(subtotal: number): { iva: number; total: number } {
  const iva = Math.round(subtotal * IVA_RATE * 100) / 100
  const total = Math.round((subtotal + iva) * 100) / 100
  return { iva, total }
}

export function getActosCuantiaIndeterminada(): ActoCuantiaIndeterminada[] {
  return ACTOS_CUANTIA_INDETERMINADA.map((acto) => ({
    id: acto.id,
    concepto: acto.concepto,
    valor: acto.valor,
    tipo: acto.tipo,
    valorReferencial:
      acto.tipo === 'porcentaje_sbu'
        ? Math.round(SBU_2026 * acto.valor * 100) / 100
        : Math.round(acto.valor * 100) / 100,
  }))
}

// ============================================
// CALCULAR ITEMS ADICIONALES
// ============================================

export function calcularItemsAdicionales(
  items: ItemAdicional[]
): {
  items: ItemAdicional[]
  total: number
} {
  const itemsCalculados = items.map((item) => {
    const tarifa = TARIFAS_ITEMS_ADICIONALES[item.tipo]
    const valorUnitario = tarifa.valorUnitario

    if ((item.tipo === 'poder' || item.tipo === 'poder_especial') && item.cantidad > 1) {
      const primerOtorgante = SBU_2026 * 0.12
      const adicionales = (item.cantidad - 1) * (SBU_2026 * 0.03)
      const subtotal = primerOtorgante + adicionales
      return {
        ...item,
        valorUnitario: primerOtorgante,
        subtotal: Math.round(subtotal * 100) / 100,
      }
    }

    const subtotal = Math.round(valorUnitario * item.cantidad * 100) / 100
    return {
      ...item,
      valorUnitario,
      subtotal,
    }
  })

  const total = itemsCalculados.reduce((sum, item) => sum + item.subtotal, 0)
  return { items: itemsCalculados, total }
}

// ============================================
// MAIN CALCULATION
// ============================================

export function calcularTramiteNotarial(
  tramite: TipoTramite,
  cuantia: number = 0,
  opciones: OpcionesCalculo = {}
): ResultadoCalculo {
  let costoBase = 0
  const detalles: string[] = []
  let descuento = 0
  let razonDescuento = ''

  switch (tramite) {
    case 'TRANSFERENCIA_DOMINIO': {
      if (cuantia >= EXCEDENTE_TABLA_1.desde) {
        costoBase = calcularExcedente(
          cuantia,
          EXCEDENTE_TABLA_1.base_desde,
          valorSBU(EXCEDENTE_TABLA_1.base_sbu),
          EXCEDENTE_TABLA_1.factor
        )
        detalles.push('Art. 26 - Tabla 1 (Excedente)')
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_1_TRANSFERENCIA)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(`Art. 26 - Tabla 1 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`)
        }
      }
      if (opciones.esViviendaSocial && cuantia <= 60000) {
        descuento = costoBase * 0.25
        razonDescuento = 'Vivienda de Interes Social (-25%)'
      }
      break
    }

    case 'PROMESA_COMPRAVENTA': {
      if (cuantia >= EXCEDENTE_TABLA_2.desde) {
        costoBase = calcularExcedente(
          cuantia,
          EXCEDENTE_TABLA_2.base_desde,
          valorSBU(EXCEDENTE_TABLA_2.base_sbu),
          EXCEDENTE_TABLA_2.factor
        )
        detalles.push('Art. 27 - Tabla 2 (Excedente)')
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_2_PROMESAS)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(`Art. 27 - Tabla 2 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`)
        }
      }
      break
    }

    case 'HIPOTECA': {
      if (cuantia >= EXCEDENTE_TABLA_3.desde) {
        costoBase = calcularExcedente(
          cuantia,
          EXCEDENTE_TABLA_3.base_desde,
          valorSBU(EXCEDENTE_TABLA_3.base_sbu),
          EXCEDENTE_TABLA_3.factor
        )
        detalles.push('Art. 28 - Tabla 3 (Excedente)')
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_3_HIPOTECAS)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(`Art. 28 - Tabla 3 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`)
        }
      }
      break
    }

    case 'CONSTITUCION_CIA': {
      const escala = EXCEDENTES_TABLA_7.find((e) => cuantia >= e.desde)
      if (escala) {
        costoBase = calcularExcedente(cuantia, escala.base_desde, valorSBU(escala.base_sbu), escala.factor)
        detalles.push(`Art. 43 - Tabla 7 (Excedente sobre $${escala.base_desde.toLocaleString()})`)
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_7_SOCIEDADES)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(`Art. 43 - Tabla 7 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`)
        }
      }
      break
    }

    case 'CONTRATO_ARRIENDO_ESCRITURA': {
      const meses = opciones.tiempoMeses || 12
      const cuantiaTotal = cuantia * meses
      if (cuantiaTotal >= EXCEDENTE_TABLA_1.desde) {
        costoBase = calcularExcedente(
          cuantiaTotal,
          EXCEDENTE_TABLA_1.base_desde,
          valorSBU(EXCEDENTE_TABLA_1.base_sbu),
          EXCEDENTE_TABLA_1.factor
        )
      } else {
        const rango = buscarEnTabla(cuantiaTotal, TABLA_1_TRANSFERENCIA)
        costoBase = rango ? rango.tarifaBase : 0
      }
      detalles.push(`Art. 40 - Escritura: Canon $${cuantia} x ${meses} meses = $${cuantiaTotal.toLocaleString()}`)
      break
    }

    case 'INSCRIPCION_ARRENDAMIENTO': {
      const { factor, limite } = CATALOGO.tablas.tabla5_arrendamiento_inscripcion.regla_hasta_375
      // Evita casos borde por floats/inputs con decimales: comparar siempre a 2 decimales.
      const canon = Math.round(cuantia * 100) / 100
      if (canon <= limite) {
        costoBase = canon * factor
        detalles.push(`Art. 41 - Inscripcion Arrendamiento (${(factor * 100).toFixed(0)}% del canon)`)
      } else {
        const rangoArriendo = buscarEnTabla(canon, TABLA_5_ARRENDAMIENTOS)
        if (rangoArriendo) {
          costoBase = rangoArriendo.tarifaBase
          detalles.push(`Art. 41 - Inscripcion Arrendamiento (Canon: $${canon.toLocaleString()})`)
        }
      }
      break
    }

    case 'ACTO_CUANTIA_INDETERMINADA': {
      const actoId = opciones.actoIndeterminadoId || ACTOS_CUANTIA_INDETERMINADA[0]?.id
      const acto = ACTOS_CUANTIA_INDETERMINADA.find((a) => a.id === actoId)
      const cantidad = Math.max(1, opciones.cantidadActoIndeterminado || 1)

      if (acto) {
        if (acto.tipo === 'porcentaje_sbu') {
          costoBase = SBU_2026 * acto.valor * cantidad
          detalles.push(
            `Cuantia indeterminada: ${acto.concepto} (${(acto.valor * 100).toFixed(2)}% SBU x ${cantidad})`
          )
        } else {
          costoBase = acto.valor * cantidad
          detalles.push(`Cuantia indeterminada: ${acto.concepto} ($${acto.valor.toFixed(2)} x ${cantidad})`)
        }
      }
      break
    }

    case 'PODER_GENERAL_PN': {
      const numOtorgantes = opciones.numeroOtorgantes || 1
      const tarifaPoder = TARIFAS_FIJAS[tramite]
      if (tarifaPoder) {
        const primerOtorgante = SBU_2026 * tarifaPoder.porcentajeSBU
        const adicionales =
          numOtorgantes > 1
            ? (numOtorgantes - 1) * (SBU_2026 * (tarifaPoder.porcentajeAdicional || 0.03))
            : 0
        costoBase = primerOtorgante + adicionales
        detalles.push(tarifaPoder.descripcion)
        if (numOtorgantes > 1) {
          detalles.push(`Otorgantes adicionales: ${numOtorgantes - 1} x 3% SBU`)
        }
      }
      break
    }

    case 'RECONOCIMIENTO_FIRMA': {
      const numFirmas = opciones.numeroFirmas || 1
      const tarifaFirma = TARIFAS_FIJAS[tramite]
      if (tarifaFirma) {
        costoBase = SBU_2026 * tarifaFirma.porcentajeSBU * numFirmas
        detalles.push(`${tarifaFirma.descripcion} x ${numFirmas} firma(s)`)
      }
      break
    }

    case 'SALIDA_PAIS': {
      const numMenores = opciones.cantidadMenores || 1
      const tarifaSalida = TARIFAS_FIJAS[tramite]
      if (tarifaSalida) {
        costoBase = SBU_2026 * tarifaSalida.porcentajeSBU * numMenores
        detalles.push(`${tarifaSalida.descripcion} x ${numMenores} menor(es)`)
      }
      break
    }

    default: {
      const tarifaFija = TARIFAS_FIJAS[tramite]
      if (tarifaFija) {
        costoBase = SBU_2026 * tarifaFija.porcentajeSBU
        detalles.push(tarifaFija.descripcion)
      }
      break
    }
  }

  if (opciones.esTerceraEdad && esActoUnilateral(tramite)) {
    descuento = costoBase * 0.5
    razonDescuento = 'Adulto Mayor (-50%)'
  }

  const subtotal = Math.max(0, Math.round((costoBase - descuento) * 100) / 100)
  const { iva, total } = aplicarIVA(subtotal)

  const itemsAdicionales = opciones.itemsAdicionales || []
  const { items: itemsCalculados, total: totalItemsAdicionales } = calcularItemsAdicionales(itemsAdicionales)

  const granTotal = Math.round((total + totalItemsAdicionales) * 100) / 100

  if (descuento > 0) {
    detalles.push(`${razonDescuento}: -$${descuento.toFixed(2)}`)
  }
  detalles.push(`Subtotal: $${subtotal.toFixed(2)}`)
  detalles.push(`IVA (${(IVA_RATE * 100).toFixed(0)}%): $${iva.toFixed(2)}`)

  if (itemsCalculados.length > 0) {
    detalles.push(`Items adicionales: $${totalItemsAdicionales.toFixed(2)}`)
  }

  return {
    subtotal,
    descuento,
    razonDescuento: descuento > 0 ? razonDescuento : undefined,
    iva,
    total,
    detalles,
    itemsAdicionales: itemsCalculados,
    totalItemsAdicionales,
    granTotal,
  }
}

// ============================================
// CATALOG HELPERS
// ============================================

function esActoUnilateral(tramite: TipoTramite): boolean {
  const actosUnilaterales: TipoTramite[] = [
    'TESTAMENTO_ABIERTO',
    'TESTAMENTO_CERRADO',
    'POSESION_EFECTIVA',
    'DECLARACION_JURAMENTADA',
    'CANCELACION_HIPOTECA',
  ]
  return actosUnilaterales.includes(tramite)
}

export function getTramitesPorCategoria(): {
  conCuantia: { value: TipoTramite; label: string }[]
  sinCuantia: { value: TipoTramite; label: string }[]
  arrendamientos: { value: TipoTramite; label: string }[]
} {
  return {
    conCuantia: [
      { value: 'TRANSFERENCIA_DOMINIO', label: 'Transferencia de Dominio (Compraventa)' },
      { value: 'HIPOTECA', label: 'Hipoteca' },
      { value: 'PROMESA_COMPRAVENTA', label: 'Promesa de Compraventa' },
      { value: 'CONSTITUCION_CIA', label: 'Constitucion de Compania' },
    ],
    sinCuantia: [

      { value: 'PODER_GENERAL_PN', label: 'Poder General - Persona Natural' },
      { value: 'PODER_GENERAL_PJ', label: 'Poder General - Persona Juridica' },
      { value: 'CAPITULACIONES_MATRIMONIALES', label: 'Capitulaciones Matrimoniales' },
      { value: 'TESTAMENTO_ABIERTO', label: 'Testamento Abierto' },
      { value: 'TESTAMENTO_CERRADO', label: 'Testamento Cerrado' },
      { value: 'UNION_HECHO', label: 'Union de Hecho' },
      { value: 'DIVORCIO', label: 'Divorcio' },
      { value: 'TERMINACION_UNION_HECHO', label: 'Terminacion Union de Hecho' },
      { value: 'POSESION_EFECTIVA', label: 'Posesion Efectiva' },
      { value: 'CANCELACION_HIPOTECA', label: 'Cancelacion de Hipoteca' },
      { value: 'SALIDA_PAIS', label: 'Autorizacion Salida del Pais (por menor)' },
      { value: 'RECONOCIMIENTO_FIRMA', label: 'Reconocimiento de Firma' },
      { value: 'DECLARACION_JURAMENTADA', label: 'Declaracion Juramentada' },
    ],
    arrendamientos: [
      { value: 'CONTRATO_ARRIENDO_ESCRITURA', label: 'Contrato de Arrendamiento por Escritura' },
      { value: 'INSCRIPCION_ARRENDAMIENTO', label: 'Inscripcion de Arrendamiento' },
    ],
  }
}

export function crearItemAdicional(
  tipo: ItemAdicional['tipo'],
  descripcion: string,
  cantidad: number
): ItemAdicional {
  const tarifa = TARIFAS_ITEMS_ADICIONALES[tipo]

  if ((tipo === 'poder' || tipo === 'poder_especial') && cantidad > 1) {
    const primerOtorgante = SBU_2026 * 0.12
    const adicionales = (cantidad - 1) * (SBU_2026 * 0.03)
    const subtotal = primerOtorgante + adicionales
    return {
      id: `${tipo}-${Date.now()}`,
      tipo,
      descripcion,
      cantidad,
      valorUnitario: primerOtorgante,
      subtotal: Math.round(subtotal * 100) / 100,
    }
  }

  return {
    id: `${tipo}-${Date.now()}`,
    tipo,
    descripcion,
    cantidad,
    valorUnitario: tarifa.valorUnitario,
    subtotal: Math.round(tarifa.valorUnitario * cantidad * 100) / 100,
  }
}
