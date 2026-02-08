/**
 * Lógica de Cálculo Notarial Ecuador (AOE v2)
 * Basado en: Reglamento del Sistema Notarial Integral de la Función Judicial
 * Resolución 216-2018 y reformas (005-2023)
 * SBU 2026 = $482
 */

// ============================================
// CONSTANTES
// ============================================
export const SBU_2026 = 482
export const COSTO_FOJA = 1.79 // Art. 74 - Copias certificadas
export const IVA_RATE = 0.15

// ============================================
// TIPOS DE TRÁMITES
// ============================================
export type TipoTramite =
  | 'TRANSFERENCIA_DOMINIO' // Art. 26 (Tabla 1)
  | 'HIPOTECA' // Art. 28 (Tabla 3)
  | 'PROMESA_COMPRAVENTA' // Art. 27 (Tabla 2)
  | 'CANCELACION_HIPOTECA' // Art. 62 (20% SBU)
  | 'DIVORCIO' // Art. 81 (39% SBU)
  | 'UNION_HECHO' // Art. 79 (10% SBU)
  | 'TERMINACION_UNION_HECHO' // Art. 82 (39% SBU)
  | 'SALIDA_PAIS' // Art. 83 (5% SBU por niño)
  | 'TESTAMENTO_ABIERTO' // Art. 86 (120% SBU)
  | 'TESTAMENTO_CERRADO' // Art. 86 (100% SBU)
  | 'POSESION_EFECTIVA' // Art. 85 (40% SBU)
  | 'PODER_GENERAL_PN' // Art. 116 (12% SBU - Persona Natural)
  | 'PODER_GENERAL_PJ' // Art. 116 (50% SBU - Persona Jurídica)
  | 'CONSTITUCION_CIA' // Art. 43 (Tabla 7)
  | 'RECONOCIMIENTO_FIRMA' // Art. 66 (3% SBU)
  | 'DECLARACION_JURAMENTADA' // Art. 95 (5% SBU)
  | 'CONTRATO_ARRIENDO_ESCRITURA' // Art. 40 - Cuantía Total
  | 'INSCRIPCION_ARRENDAMIENTO' // Art. 41 - Canon Mensual

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
  numeroOtorgantes?: number // Para poderes
  numeroFirmas?: number // Para reconocimiento de firmas
  numeroHojas?: number // Para copias/materializaciones
}

interface RangoTarifa {
  desde: number
  hasta: number
  tarifaBase: number
  porcentajeExcedente?: number
}

// ============================================
// TABLAS DE CUANTÍA (Anexo 1 - Resolución CJ)
// ============================================

// TABLA 1: Transferencia de Dominio (Art. 26)
const TABLA_1_TRANSFERENCIA: RangoTarifa[] = [
  { desde: 0, hasta: 10000, tarifaBase: 90.0 },
  { desde: 10000.01, hasta: 30000, tarifaBase: 157.5 },
  { desde: 30000.01, hasta: 60000, tarifaBase: 225.0 },
  { desde: 60000.01, hasta: 90000, tarifaBase: 360.0 },
  { desde: 90000.01, hasta: 150000, tarifaBase: 607.5 },
  { desde: 150000.01, hasta: 300000, tarifaBase: 900.0 },
  { desde: 300000.01, hasta: 600000, tarifaBase: 1800.0 },
  { desde: 600000.01, hasta: 1000000, tarifaBase: 2250.0 },
  { desde: 1000001, hasta: 2000000, tarifaBase: 4500.0 },
  { desde: 2000001, hasta: 3000000, tarifaBase: 6750.0 },
  { desde: 3000001, hasta: 4000000, tarifaBase: 9000.0 },
]

// TABLA 2: Promesas de Compraventa (Art. 27)
const TABLA_2_PROMESAS: RangoTarifa[] = [
  { desde: 0, hasta: 10000, tarifaBase: 67.5 },
  { desde: 10000.01, hasta: 30000, tarifaBase: 112.5 },
  { desde: 30000.01, hasta: 60000, tarifaBase: 157.5 },
  { desde: 60000.01, hasta: 90000, tarifaBase: 270.0 },
  { desde: 90000.01, hasta: 150000, tarifaBase: 405.0 },
  { desde: 150000.01, hasta: 300000, tarifaBase: 630.0 },
  { desde: 300000.01, hasta: 600000, tarifaBase: 1260.0 },
  { desde: 600000.01, hasta: 1000000, tarifaBase: 1575.0 },
  { desde: 1000001, hasta: 2000000, tarifaBase: 3150.0 },
  { desde: 2000001, hasta: 3000000, tarifaBase: 4725.0 },
  { desde: 3000001, hasta: 4000000, tarifaBase: 6300.0 },
]

// TABLA 3: Hipotecas (Art. 28)
const TABLA_3_HIPOTECAS: RangoTarifa[] = [
  { desde: 0, hasta: 10000, tarifaBase: 58.5 },
  { desde: 10000.01, hasta: 30000, tarifaBase: 121.5 },
  { desde: 30000.01, hasta: 60000, tarifaBase: 162.0 },
  { desde: 60000.01, hasta: 90000, tarifaBase: 243.0 },
  { desde: 90000.01, hasta: 150000, tarifaBase: 324.0 },
  { desde: 150000.01, hasta: 300000, tarifaBase: 567.0 },
  { desde: 300000.01, hasta: 600000, tarifaBase: 810.0 },
  { desde: 600000.01, hasta: 1000000, tarifaBase: 1012.5 },
  { desde: 1000001, hasta: 2000000, tarifaBase: 2025.0 },
  { desde: 2000001, hasta: 3000000, tarifaBase: 3037.5 },
  { desde: 3000001, hasta: 4000000, tarifaBase: 4050.0 },
]

// TABLA 7: Constitución de Sociedades (Art. 43)
const TABLA_7_SOCIEDADES: RangoTarifa[] = [
  { desde: 0, hasta: 10000, tarifaBase: 315.0 },
  { desde: 10000.01, hasta: 25000, tarifaBase: 450.0 },
  { desde: 25000.01, hasta: 50000, tarifaBase: 675.0 },
  { desde: 50000.01, hasta: 100000, tarifaBase: 787.5 },
  { desde: 100000.01, hasta: 250000, tarifaBase: 900.0 },
  { desde: 250000.01, hasta: 500000, tarifaBase: 1350.0 },
  { desde: 500000.01, hasta: 750000, tarifaBase: 1800.0 },
  { desde: 750000.01, hasta: 1000000, tarifaBase: 2250.0 },
]

// TABLA 5: Inscripción de Arrendamientos (Art. 41) - Canon Mensual
const TABLA_5_ARRENDAMIENTOS: RangoTarifa[] = [
  { desde: 0, hasta: 460, tarifaBase: 15.0 },
  { desde: 460.01, hasta: 1000, tarifaBase: 30.0 },
  { desde: 1000.01, hasta: 2000, tarifaBase: 45.0 },
  { desde: 2000.01, hasta: 3000, tarifaBase: 60.0 },
  { desde: 3000.01, hasta: 5000, tarifaBase: 80.0 },
  { desde: 5000.01, hasta: 10000, tarifaBase: 120.0 },
  { desde: 10000.01, hasta: 15000, tarifaBase: 180.0 },
  { desde: 15000.01, hasta: 20000, tarifaBase: 240.0 },
]

// ============================================
// TARIFAS FIJAS (Porcentaje SBU)
// ============================================
const TARIFAS_FIJAS: Record<string, { 
  porcentajeSBU: number; 
  descripcion: string;
  porcentajeAdicional?: number; // Para otorgantes/firmas adicionales
}> = {
  CANCELACION_HIPOTECA: { porcentajeSBU: 0.2, descripcion: '20% SBU - Cancelación Hipoteca' },
  DIVORCIO: { porcentajeSBU: 0.39, descripcion: '39% SBU - Divorcio' },
  UNION_HECHO: { porcentajeSBU: 0.1, descripcion: '10% SBU - Unión de Hecho' },
  TERMINACION_UNION_HECHO: { porcentajeSBU: 0.39, descripcion: '39% SBU - Terminación Unión de Hecho' },
  SALIDA_PAIS: { porcentajeSBU: 0.05, descripcion: '5% SBU por menor - Autorización Salida del País' },
  TESTAMENTO_ABIERTO: { porcentajeSBU: 1.2, descripcion: '120% SBU - Testamento Abierto' },
  TESTAMENTO_CERRADO: { porcentajeSBU: 1.0, descripcion: '100% SBU - Testamento Cerrado' },
  POSESION_EFECTIVA: { porcentajeSBU: 0.4, descripcion: '40% SBU - Posesión Efectiva' },
  PODER_GENERAL_PN: { 
    porcentajeSBU: 0.12, 
    descripcion: '12% SBU - Poder General Persona Natural',
    porcentajeAdicional: 0.03 // 3% por otorgante adicional
  },
  PODER_GENERAL_PJ: { porcentajeSBU: 0.5, descripcion: '50% SBU - Poder General Persona Jurídica' },
  RECONOCIMIENTO_FIRMA: { porcentajeSBU: 0.03, descripcion: '3% SBU - Reconocimiento de Firma' },
  DECLARACION_JURAMENTADA: { porcentajeSBU: 0.05, descripcion: '5% SBU - Declaración Juramentada' },
}

// ============================================
// TARIFAS ÍTEMS ADICIONALES
// ============================================
export const TARIFAS_ITEMS_ADICIONALES: Record<string, { 
  nombre: string; 
  valorUnitario: number; 
  unidad: string; 
  descripcion?: string;
  porcentajeSBU?: number;
}> = {
  // Certificaciones - por foja
  copia_certificada: {
    nombre: 'Copia Certificada',
    valorUnitario: COSTO_FOJA, // $1.79 por foja
    unidad: 'foja',
    descripcion: 'Copia certificada de la escritura',
  },
  
  // Declaraciones - por unidad
  declaracion_juramentada: {
    nombre: 'Declaración Juramentada',
    valorUnitario: SBU_2026 * 0.05, // 5% SBU = $24.10
    unidad: 'declaración',
    descripcion: 'Declaración juramentada',
    porcentajeSBU: 0.05,
  },
  
  // Poderes - por otorgante (12% primer otorgante, 3% adicionales)
  // Unificado: Poder General, Especial y Procuración tienen la misma tarifa base
  poder: {
    nombre: 'Poder General/Especial/Procuración',
    valorUnitario: SBU_2026 * 0.12, // 12% SBU = $57.84
    unidad: 'otorgante',
    descripcion: 'Poder general, especial o procuración (12% primer otorgante, 3% adicionales)',
    porcentajeSBU: 0.12,
  },
  
  // Cancelación de hipoteca - por unidad
  cancelacion_hipoteca: {
    nombre: 'Cancelación de Hipoteca',
    valorUnitario: SBU_2026 * 0.20, // 20% SBU = $96.40
    unidad: 'cancelación',
    descripcion: 'Cancelación de hipoteca existente',
    porcentajeSBU: 0.20,
  },
  
  // Firmas - por firma
  reconocimiento_firma: {
    nombre: 'Reconocimiento de Firma',
    valorUnitario: SBU_2026 * 0.03, // 3% SBU = $14.46
    unidad: 'firma',
    descripcion: 'Reconocimiento de firma en documento',
    porcentajeSBU: 0.03,
  },
  autenticacion_firma: {
    nombre: 'Autenticación de Firma',
    valorUnitario: SBU_2026 * 0.04, // ~4% SBU = $19.28
    unidad: 'firma',
    descripcion: 'Autenticación de firma registrada',
    porcentajeSBU: 0.04,
  },
  
  // Documentos especiales - por documento/hoja
  materializacion: {
    nombre: 'Materialización',
    valorUnitario: COSTO_FOJA * 2, // ~$3.58
    unidad: 'documento',
    descripcion: 'Materialización de documento electrónico',
  },
  protocolizacion: {
    nombre: 'Protocolización',
    valorUnitario: SBU_2026 * 0.05, // 5% SBU = $24.10
    unidad: 'documento',
    descripcion: 'Protocolización de documento privado',
    porcentajeSBU: 0.05,
  },
  
  // Marginación - por unidad
  marginacion: {
    nombre: 'Marginación/Razón',
    valorUnitario: 3.00, // Valor aproximado
    unidad: 'marginación',
    descripcion: 'Marginación o razón de inscripción',
  },
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function buscarEnTabla(monto: number, tabla: RangoTarifa[]): RangoTarifa | undefined {
  return tabla.find((r) => monto >= r.desde && monto <= r.hasta)
}

function calcularExcedente(
  monto: number,
  limite: number,
  baseSBU: number,
  porcentajeExcedente: number
): number {
  const excedente = monto - limite
  return baseSBU + excedente * porcentajeExcedente
}

function aplicarIVA(subtotal: number): { iva: number; total: number } {
  const iva = Math.round(subtotal * IVA_RATE * 100) / 100
  const total = Math.round((subtotal + iva) * 100) / 100
  return { iva, total }
}

// ============================================
// FUNCIÓN PARA CALCULAR ÍTEMS ADICIONALES CON CANTIDAD
// ============================================

export function calcularItemsAdicionales(
  items: ItemAdicional[]
): {
  items: ItemAdicional[]
  total: number
} {
  const itemsCalculados = items.map((item) => {
    const tarifa = TARIFAS_ITEMS_ADICIONALES[item.tipo]
    let valorUnitario = tarifa.valorUnitario
    
    // Para poderes: primer otorgante 12%, adicionales 3%
    if (item.tipo === 'poder' && item.cantidad > 1) {
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
// FUNCIÓN PRINCIPAL DE CÁLCULO
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

  // Procesar según tipo de trámite
  switch (tramite) {
    case 'TRANSFERENCIA_DOMINIO':
      if (cuantia > 4000000) {
        costoBase = calcularExcedente(cuantia, 4000000, 20 * SBU_2026, 0.001)
        detalles.push(`Art. 26 - Tabla 1 (Excedente > $4M): 20 SBU + 0.1% excedente`)
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_1_TRANSFERENCIA)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(
            `Art. 26 - Tabla 1 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`
          )
        }
      }
      if (opciones.esViviendaSocial && cuantia <= 60000) {
        descuento = costoBase * 0.25
        razonDescuento = 'Vivienda de Interés Social (-25%)'
      }
      break

    case 'PROMESA_COMPRAVENTA':
      if (cuantia > 4000000) {
        costoBase = calcularExcedente(cuantia, 4000000, 14 * SBU_2026, 0.001)
        detalles.push(`Art. 27 - Tabla 2 (Excedente > $4M): 14 SBU + 0.1% excedente`)
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_2_PROMESAS)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(
            `Art. 27 - Tabla 2 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`
          )
        }
      }
      break

    case 'HIPOTECA':
      if (cuantia > 4000000) {
        costoBase = calcularExcedente(cuantia, 4000000, 9 * SBU_2026, 0.001)
        detalles.push(`Art. 28 - Tabla 3 (Excedente > $4M): 9 SBU + 0.1% excedente`)
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_3_HIPOTECAS)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(
            `Art. 28 - Tabla 3 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`
          )
        }
      }
      break

    case 'CONSTITUCION_CIA':
      if (cuantia > 1000000) {
        costoBase = cuantia * 0.00225
        detalles.push(`Art. 43 - Tabla 7 (Excedente > $1M): 0.225% del capital`)
      } else {
        const rango = buscarEnTabla(cuantia, TABLA_7_SOCIEDADES)
        if (rango) {
          costoBase = rango.tarifaBase
          detalles.push(
            `Art. 43 - Tabla 7 (Rango: $${rango.desde.toLocaleString()} - $${rango.hasta.toLocaleString()})`
          )
        }
      }
      break

    case 'CONTRATO_ARRIENDO_ESCRITURA':
      const cuantiaTotal = cuantia * (opciones.tiempoMeses || 12)
      if (cuantiaTotal > 4000000) {
        costoBase = calcularExcedente(cuantiaTotal, 4000000, 20 * SBU_2026, 0.001)
      } else {
        const rango = buscarEnTabla(cuantiaTotal, TABLA_1_TRANSFERENCIA)
        costoBase = rango ? rango.tarifaBase : 0
      }
      detalles.push(
        `Art. 40 - Escritura Pública: Canon $${cuantia} × ${opciones.tiempoMeses || 12} meses = $${cuantiaTotal.toLocaleString()}`
      )
      break

    case 'INSCRIPCION_ARRENDAMIENTO':
      const rangoArriendo = buscarEnTabla(cuantia, TABLA_5_ARRENDAMIENTOS)
      if (rangoArriendo) {
        costoBase = rangoArriendo.tarifaBase
        detalles.push(
          `Art. 41 - Inscripción Arrendamiento (Canon mensual: $${cuantia.toLocaleString()})`
        )
      }
      break

    // Trámites con cantidad variable
    case 'PODER_GENERAL_PN':
      const numOtorgantes = opciones.numeroOtorgantes || 1
      const tarifaPoder = TARIFAS_FIJAS[tramite]
      if (tarifaPoder) {
        // 12% primer otorgante, 3% adicionales
        const primerOtorgante = SBU_2026 * tarifaPoder.porcentajeSBU
        const adicionales = numOtorgantes > 1 
          ? (numOtorgantes - 1) * (SBU_2026 * (tarifaPoder.porcentajeAdicional || 0.03))
          : 0
        costoBase = primerOtorgante + adicionales
        detalles.push(`${tarifaPoder.descripcion}`)
        if (numOtorgantes > 1) {
          detalles.push(`Otorgantes adicionales: ${numOtorgantes - 1} × 3% SBU`)
        }
      }
      break

    case 'RECONOCIMIENTO_FIRMA':
      const numFirmas = opciones.numeroFirmas || 1
      const tarifaFirma = TARIFAS_FIJAS[tramite]
      if (tarifaFirma) {
        costoBase = SBU_2026 * tarifaFirma.porcentajeSBU * numFirmas
        detalles.push(`${tarifaFirma.descripcion} × ${numFirmas} firma(s)`)
      }
      break

    case 'SALIDA_PAIS':
      const numMenores = opciones.cantidadMenores || 1
      const tarifaSalida = TARIFAS_FIJAS[tramite]
      if (tarifaSalida) {
        costoBase = SBU_2026 * tarifaSalida.porcentajeSBU * numMenores
        detalles.push(`${tarifaSalida.descripcion} × ${numMenores} menor(es)`)
      }
      break

    default:
      const tarifaFija = TARIFAS_FIJAS[tramite]
      if (tarifaFija) {
        costoBase = SBU_2026 * tarifaFija.porcentajeSBU
        detalles.push(tarifaFija.descripcion)
      }
      break
  }

  // Aplicar descuento de tercera edad
  if (opciones.esTerceraEdad && esActoUnilateral(tramite)) {
    descuento = costoBase * 0.5
    razonDescuento = 'Adulto Mayor (-50%)'
  }

  // Calcular subtotal del trámite principal
  const subtotal = Math.max(0, Math.round((costoBase - descuento) * 100) / 100)
  const { iva, total } = aplicarIVA(subtotal)

  // Calcular ítems adicionales
  const itemsAdicionales = opciones.itemsAdicionales || []
  const { items: itemsCalculados, total: totalItemsAdicionales } = calcularItemsAdicionales(itemsAdicionales)

  // Calcular gran total
  const granTotal = Math.round((total + totalItemsAdicionales) * 100) / 100

  // Agregar desglose al detalle
  if (descuento > 0) {
    detalles.push(`${razonDescuento}: -$${descuento.toFixed(2)}`)
  }
  detalles.push(`Subtotal: $${subtotal.toFixed(2)}`)
  detalles.push(`IVA (15%): $${iva.toFixed(2)}`)
  
  if (itemsCalculados.length > 0) {
    detalles.push(`Ítems adicionales: $${totalItemsAdicionales.toFixed(2)}`)
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
// FUNCIONES AUXILIARES
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
      { value: 'CONSTITUCION_CIA', label: 'Constitución de Compañía' },
    ],
    sinCuantia: [
      { value: 'PODER_GENERAL_PN', label: 'Poder General - Persona Natural' },
      { value: 'PODER_GENERAL_PJ', label: 'Poder General - Persona Jurídica' },
      { value: 'TESTAMENTO_ABIERTO', label: 'Testamento Abierto' },
      { value: 'TESTAMENTO_CERRADO', label: 'Testamento Cerrado' },
      { value: 'UNION_HECHO', label: 'Unión de Hecho' },
      { value: 'DIVORCIO', label: 'Divorcio' },
      { value: 'TERMINACION_UNION_HECHO', label: 'Terminación Unión de Hecho' },
      { value: 'POSESION_EFECTIVA', label: 'Posesión Efectiva' },
      { value: 'CANCELACION_HIPOTECA', label: 'Cancelación de Hipoteca' },
      { value: 'SALIDA_PAIS', label: 'Autorización Salida del País (por menor)' },
      { value: 'RECONOCIMIENTO_FIRMA', label: 'Reconocimiento de Firma' },
      { value: 'DECLARACION_JURAMENTADA', label: 'Declaración Juramentada' },
    ],
    arrendamientos: [
      { value: 'CONTRATO_ARRIENDO_ESCRITURA', label: 'Contrato de Arrendamiento por Escritura' },
      { value: 'INSCRIPCION_ARRENDAMIENTO', label: 'Inscripción de Arrendamiento' },
    ],
  }
}

// Helper para crear un ítem adicional
export function crearItemAdicional(
  tipo: ItemAdicional['tipo'],
  descripcion: string,
  cantidad: number
): ItemAdicional {
  const tarifa = TARIFAS_ITEMS_ADICIONALES[tipo]
  
  // Para poderes: calcular con la lógica especial
  if (tipo === 'poder' && cantidad > 1) {
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
