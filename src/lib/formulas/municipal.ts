/**
 * Lógica de Cálculo Municipal - Impuestos de Transferencia
 * Ciudad: Quito (Distrito Metropolitano)
 * Impuestos: Alcabala (comprador) + Utilidad (vendedor)
 */

// ============================================
// CONSTANTES
// ============================================
export const TASA_ALCABALA = 0.01 // 1% sobre el mayor (avalúo o precio)
export const TASA_UTILIDAD_NATURAL = 0.1 // 10% persona natural
export const TASA_UTILIDAD_INMOBILIARIA = 0.04 // 4% inmobiliaria
export const TASA_UTILIDAD_DONACION = 0.01 // 1% donación
export const DEDUCCION_ANUAL = 0.05 // 5% por año de tenencia (máx 20 años = 100%)

// ============================================
// INTERFACES
// ============================================
export interface DatosMunicipales {
  fechaAdquisicion: Date | string
  fechaTransferencia: Date | string
  valorTransferencia: number
  valorAdquisicion: number
  avaluoCatastral: number
  tipoTransferencia: 'Compraventa' | 'Donación' | 'Dación en pago'
  tipoTransferente: 'Natural' | 'Inmobiliaria'
  mejoras?: number
  contribucionMejoras?: number
}

export interface ResultadoUtilidad {
  utilidadBruta: number
  añosTranscurridos: number
  deduccionTiempo: number
  baseImponible: number
  tarifaAplicada: number
  tarifaDescripcion: string
  impuesto: number
}

export interface ResultadoAlcabala {
  baseImponible: number
  tarifa: number
  mesesTranscurridos: number
  porcentajeRebaja: number
  rebajaDescripcion: string
  impuestoAntesRebaja: number
  rebaja: number
  impuesto: number
}

export interface ResultadoMunicipal {
  utilidad: ResultadoUtilidad
  alcabala: ResultadoAlcabala
  totalVendedor: number
  totalComprador: number
  total: number
}

// ============================================
// FUNCIONES DE CÁLCULO DE TIEMPO
// ============================================

export function calcularAños(
  fechaAdquisicion: Date | string,
  fechaTransferencia: Date | string
): number {
  const adquisicion = new Date(fechaAdquisicion)
  const transferencia = new Date(fechaTransferencia)

  let años = transferencia.getFullYear() - adquisicion.getFullYear()

  // Ajustar si no ha completado el año
  if (
    transferencia.getMonth() < adquisicion.getMonth() ||
    (transferencia.getMonth() === adquisicion.getMonth() &&
      transferencia.getDate() < adquisicion.getDate())
  ) {
    años--
  }

  // Entre 0 y 20 años (máximo deducción 100%)
  return Math.min(Math.max(0, años), 20)
}

export function calcularMeses(
  fechaAdquisicion: Date | string,
  fechaTransferencia: Date | string
): number {
  const adquisicion = new Date(fechaAdquisicion)
  const transferencia = new Date(fechaTransferencia)

  const diferenciaMs = transferencia.getTime() - adquisicion.getTime()
  const meses = diferenciaMs / (1000 * 60 * 60 * 24 * 30.44)

  return Math.floor(meses)
}

// ============================================
// CÁLCULO DE REBAJA ALCABALA
// ============================================

function calcularRebajaAlcabala(meses: number): { porcentaje: number; descripcion: string } {
  if (meses <= 12) {
    return { porcentaje: 0.4, descripcion: '40% - Primer año' }
  }
  if (meses <= 24) {
    return { porcentaje: 0.3, descripcion: '30% - Segundo año' }
  }
  if (meses <= 36) {
    return { porcentaje: 0.2, descripcion: '20% - Tercer año' }
  }
  if (meses <= 48) {
    return { porcentaje: 0.1, descripcion: '10% - Cuarto año' }
  }
  return { porcentaje: 0, descripcion: 'Sin rebaja - Más de 4 años' }
}

// ============================================
// CÁLCULO DE IMPUESTO A LA UTILIDAD (Vendedor)
// ============================================

export function calcularUtilidad(data: DatosMunicipales): ResultadoUtilidad {
  const mejoras = data.mejoras || 0
  const contribucionMejoras = data.contribucionMejoras || 0

  // 1. Valor base (mayor entre transferencia y avalúo)
  const valorBase = Math.max(data.valorTransferencia, data.avaluoCatastral)

  // 2. Utilidad Bruta
  const utilidadBruta = valorBase - (data.valorAdquisicion + mejoras + contribucionMejoras)

  // Si no hay utilidad, no hay impuesto
  if (utilidadBruta <= 0) {
    return {
      utilidadBruta: Math.max(0, utilidadBruta),
      añosTranscurridos: calcularAños(data.fechaAdquisicion, data.fechaTransferencia),
      deduccionTiempo: 0,
      baseImponible: 0,
      tarifaAplicada: 0,
      tarifaDescripcion: 'Sin utilidad',
      impuesto: 0,
    }
  }

  // 3. Años transcurridos
  const añosTranscurridos = calcularAños(data.fechaAdquisicion, data.fechaTransferencia)

  // 4. Deducción por tiempo (5% por año, máximo 20 años = 100%)
  const deduccionTiempo = utilidadBruta * DEDUCCION_ANUAL * añosTranscurridos

  // 5. Base Imponible
  const baseImponible = utilidadBruta - deduccionTiempo

  // 6. Determinar tarifa según tipo de transferencia y transferente
  let tarifaAplicada: number
  let tarifaDescripcion: string

  if (data.tipoTransferencia === 'Donación') {
    tarifaAplicada = TASA_UTILIDAD_DONACION
    tarifaDescripcion = '1% - Donación'
  } else if (data.tipoTransferente === 'Inmobiliaria') {
    tarifaAplicada = TASA_UTILIDAD_INMOBILIARIA
    tarifaDescripcion = '4% - Inmobiliaria'
  } else {
    tarifaAplicada = TASA_UTILIDAD_NATURAL
    tarifaDescripcion = '10% - Persona Natural'
  }

  // 7. Impuesto a la Utilidad
  const impuesto = Math.round(baseImponible * tarifaAplicada * 100) / 100

  return {
    utilidadBruta: Math.round(utilidadBruta * 100) / 100,
    añosTranscurridos,
    deduccionTiempo: Math.round(deduccionTiempo * 100) / 100,
    baseImponible: Math.round(baseImponible * 100) / 100,
    tarifaAplicada,
    tarifaDescripcion,
    impuesto: Math.max(0, impuesto),
  }
}

// ============================================
// CÁLCULO DE IMPUESTO DE ALCABALA (Comprador)
// ============================================

export function calcularAlcabala(data: DatosMunicipales): ResultadoAlcabala {
  // 1. Base Imponible (mayor valor)
  const baseImponible = Math.max(data.valorTransferencia, data.avaluoCatastral)

  // 2. Meses transcurridos
  const mesesTranscurridos = calcularMeses(data.fechaAdquisicion, data.fechaTransferencia)

  // 3. Rebaja por tiempo
  const rebaja = calcularRebajaAlcabala(mesesTranscurridos)

  // 4. Impuesto antes de rebaja
  const impuestoAntesRebaja = baseImponible * TASA_ALCABALA

  // 5. Valor de la rebaja
  const valorRebaja = impuestoAntesRebaja * rebaja.porcentaje

  // 6. Impuesto final
  const impuesto = Math.round((impuestoAntesRebaja - valorRebaja) * 100) / 100

  return {
    baseImponible: Math.round(baseImponible * 100) / 100,
    tarifa: TASA_ALCABALA,
    mesesTranscurridos,
    porcentajeRebaja: rebaja.porcentaje,
    rebajaDescripcion: rebaja.descripcion,
    impuestoAntesRebaja: Math.round(impuestoAntesRebaja * 100) / 100,
    rebaja: Math.round(valorRebaja * 100) / 100,
    impuesto: Math.max(0, impuesto),
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function calcularImpuestosMunicipales(data: DatosMunicipales): ResultadoMunicipal {
  const utilidad = calcularUtilidad(data)
  const alcabala = calcularAlcabala(data)

  const totalVendedor = utilidad.impuesto
  const totalComprador = alcabala.impuesto
  const total = totalVendedor + totalComprador

  return {
    utilidad,
    alcabala,
    totalVendedor,
    totalComprador,
    total: Math.round(total * 100) / 100,
  }
}

// ============================================
// HELPERS
// ============================================

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(valor)
}

export function formatearPorcentaje(valor: number): string {
  return `${(valor * 100).toFixed(0)}%`
}
