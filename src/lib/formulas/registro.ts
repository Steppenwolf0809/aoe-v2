/**
 * Lógica de Cálculo - Registro de la Propiedad
 * Ecuador - Basado en tabla oficial del Registro de la Propiedad
 */

// ============================================
// CONSTANTES
// ============================================
export const LIMITE_MAXIMO = 500.0 // Máximo legal según normativa
export const DESCUENTO_TERCERA_EDAD = 0.5 // 50%
export const DESCUENTO_DISCAPACIDAD = 0.5 // 50%

// ============================================
// INTERFACES
// ============================================
export interface RangoRegistro {
  rango: number
  min: number
  max: number
  arancel: number
}

export interface Descuento {
  tipo: string
  porcentaje: number
  valor: number
}

export interface ResultadoRegistro {
  valorContrato: number
  rango: number
  arancelBase: number
  exceso: number | null
  descuentos: Descuento[]
  arancelFinal: number
  excedeMaximo: boolean
}

// ============================================
// TABLA DE ARANCELES - Registro de la Propiedad
// ============================================
export const RANGOS_REGISTRO: RangoRegistro[] = [
  { rango: 1, min: 0.01, max: 3000.0, arancel: 22.0 },
  { rango: 2, min: 3000.01, max: 6600.0, arancel: 30.0 },
  { rango: 3, min: 6600.01, max: 10000.0, arancel: 35.0 },
  { rango: 4, min: 10000.01, max: 15000.0, arancel: 40.0 },
  { rango: 5, min: 15000.01, max: 25000.0, arancel: 50.0 },
  { rango: 6, min: 25000.01, max: 30000.0, arancel: 100.0 },
  { rango: 7, min: 30000.01, max: 35000.0, arancel: 160.0 },
  { rango: 8, min: 35000.01, max: 40000.0, arancel: 200.0 },
  { rango: 9, min: 40000.01, max: Infinity, arancel: 0 }, // Calculado con fórmula
]

// ============================================
// CÁLCULO DEL ARANCEL BASE
// ============================================

export function calcularArancelBase(valorContrato: number): {
  arancel: number
  rango: number
  exceso: number | null
  excedeMaximo: boolean
} {
  if (valorContrato <= 0) {
    return { arancel: 0, rango: 0, exceso: null, excedeMaximo: false }
  }

  let arancel: number
  let rangoAplicado: RangoRegistro
  let exceso: number | null = null

  if (valorContrato > 40000) {
    // Rango 9: Fórmula especial
    // $100 + 0.5% del excedente sobre $10,000
    exceso = valorContrato - 10000
    arancel = 100 + exceso * 0.005
    rangoAplicado = RANGOS_REGISTRO[8]
  } else {
    // Rangos 1-8: Búsqueda en tabla
    const encontrado = RANGOS_REGISTRO.find(
      (r) => valorContrato >= r.min && valorContrato <= r.max && r.rango !== 9
    )

    if (encontrado) {
      rangoAplicado = encontrado
      arancel = encontrado.arancel
    } else {
      // Fallback (no debería ocurrir)
      return { arancel: 0, rango: 0, exceso: null, excedeMaximo: false }
    }
  }

  const excedeMaximo = arancel > LIMITE_MAXIMO
  const arancelFinal = Math.min(arancel, LIMITE_MAXIMO)

  return {
    arancel: arancelFinal,
    rango: rangoAplicado.rango,
    exceso,
    excedeMaximo,
  }
}

// ============================================
// APLICACIÓN DE DESCUENTOS
// ============================================

export function aplicarDescuentos(
  arancelBase: number,
  esTerceraEdad: boolean,
  esDiscapacitado: boolean
): {
  arancelFinal: number
  descuentos: Descuento[]
} {
  let arancelFinal = arancelBase
  const descuentos: Descuento[] = []

  // Descuento por tercera edad
  if (esTerceraEdad) {
    const descuentoValor = arancelFinal * DESCUENTO_TERCERA_EDAD
    descuentos.push({
      tipo: 'Tercera Edad',
      porcentaje: DESCUENTO_TERCERA_EDAD,
      valor: Math.round(descuentoValor * 100) / 100,
    })
    arancelFinal = arancelFinal * (1 - DESCUENTO_TERCERA_EDAD)
  }

  // Descuento por discapacidad
  if (esDiscapacitado) {
    const descuentoValor = arancelFinal * DESCUENTO_DISCAPACIDAD
    descuentos.push({
      tipo: 'Discapacidad',
      porcentaje: DESCUENTO_DISCAPACIDAD,
      valor: Math.round(descuentoValor * 100) / 100,
    })
    arancelFinal = arancelFinal * (1 - DESCUENTO_DISCAPACIDAD)
  }

  return {
    arancelFinal: Math.round(arancelFinal * 100) / 100,
    descuentos,
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function calcularArancelRegistro(
  valorContrato: number,
  esTerceraEdad: boolean = false,
  esDiscapacitado: boolean = false
): ResultadoRegistro {
  const calculoBase = calcularArancelBase(valorContrato)
  const { arancelFinal, descuentos } = aplicarDescuentos(
    calculoBase.arancel,
    esTerceraEdad,
    esDiscapacitado
  )

  return {
    valorContrato,
    rango: calculoBase.rango,
    arancelBase: calculoBase.arancel,
    exceso: calculoBase.exceso,
    descuentos,
    arancelFinal,
    excedeMaximo: calculoBase.excedeMaximo,
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

export function obtenerRangoDescripcion(rango: number): string {
  const info = RANGOS_REGISTRO.find((r) => r.rango === rango)
  if (!info) return ''

  if (rango === 9) {
    return 'Rango 9: $40,000.01 en adelante - Fórmula especial'
  }

  return `Rango ${rango}: $${info.min.toLocaleString()} - $${info.max.toLocaleString()}`
}
