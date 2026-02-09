/**
 * Lógica de Cálculo - Consejo Provincial de Pichincha
 * Contribución al Consejo Provincial por transferencia de dominio
 *
 * Fórmula: 10% del valor de la Alcabala + $1.80 (valor fijo)
 *
 * Fuente: Ordenanza del Consejo Provincial de Pichincha
 * Aplicable a: Transferencias de inmuebles en el Distrito Metropolitano de Quito
 */

// ============================================
// CONSTANTES
// ============================================
export const TASA_CONSEJO_PROVINCIAL = 0.10 // 10% sobre el impuesto de alcabala
export const VALOR_FIJO_CONSEJO_PROVINCIAL = 1.80 // Valor fijo adicional

// ============================================
// INTERFACES
// ============================================
export interface InputConsejoProvincial {
  valorAlcabala: number // Valor del impuesto de alcabala pagado
}

export interface ResultadoConsejoProvincial {
  baseCalculo: number // Valor de la alcabala
  porcentaje: number // 10%
  valorPorcentaje: number // 10% de la alcabala
  valorFijo: number // $1.80
  total: number // Total a pagar
  desglose: Array<{
    concepto: string
    valor: number
  }>
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function calcularConsejoProvincial(
  valorAlcabala: number
): ResultadoConsejoProvincial {
  // Calcular el 10% del valor de la alcabala
  const valorPorcentaje = Math.round(valorAlcabala * TASA_CONSEJO_PROVINCIAL * 100) / 100

  // Sumar el valor fijo
  const total = Math.round((valorPorcentaje + VALOR_FIJO_CONSEJO_PROVINCIAL) * 100) / 100

  return {
    baseCalculo: valorAlcabala,
    porcentaje: TASA_CONSEJO_PROVINCIAL,
    valorPorcentaje,
    valorFijo: VALOR_FIJO_CONSEJO_PROVINCIAL,
    total,
    desglose: [
      {
        concepto: 'Contribución Provincial (10% de Alcabala)',
        valor: valorPorcentaje,
      },
      {
        concepto: 'Valor Fijo',
        valor: VALOR_FIJO_CONSEJO_PROVINCIAL,
      },
    ],
  }
}

// ============================================
// FUNCIÓN INTEGRADA (Alcabala + Consejo Provincial)
// ============================================

export interface InputCompleto {
  valorTransferencia: number
  valorAdquisicion?: number // Para calcular la alcabala con rebaja si es necesario
  mesesTranscurridos?: number // Para aplicar rebajas
  avaluoCatastral?: number
}

export interface ResultadoCompleto {
  // Alcabala
  baseImponibleAlcabala: number
  rebajaAplicada: number
  impuestoAlcabala: number
  
  // Consejo Provincial
  baseConsejoProvincial: number
  porcentajeConsejoProvincial: number
  valorPorcentaje: number
  valorFijo: number
  impuestoConsejoProvincial: number
  
  // Totales
  totalImpuestos: number
}

/**
 * Calcula tanto la Alcabala como el Consejo Provincial
 * Calcula alcabala con rebajas si se proporcionan los meses
 */
export function calcularAlcabalaYConsejoProvincial(
  valorTransferencia: number,
  avaluoCatastral: number = valorTransferencia,
  mesesTranscurridos: number = 999 // Por defecto sin rebaja
): ResultadoCompleto {
  // Determinar base imponible (el mayor valor)
  const baseImponible = Math.max(valorTransferencia, avaluoCatastral)

  // Calcular rebaja según meses
  let rebaja = 0
  if (mesesTranscurridos <= 12) {
    rebaja = 0.40 // 40%
  } else if (mesesTranscurridos <= 24) {
    rebaja = 0.30 // 30%
  } else if (mesesTranscurridos <= 36) {
    rebaja = 0.20 // 20%
  }

  // Calcular alcabala
  const impuestoAlcabala = Math.round(
    baseImponible * 0.01 * (1 - rebaja) * 100
  ) / 100

  // Calcular Consejo Provincial basado en la alcabala
  const resultadoCP = calcularConsejoProvincial(impuestoAlcabala)

  return {
    baseImponibleAlcabala: baseImponible,
    rebajaAplicada: rebaja,
    impuestoAlcabala,
    baseConsejoProvincial: impuestoAlcabala,
    porcentajeConsejoProvincial: TASA_CONSEJO_PROVINCIAL,
    valorPorcentaje: resultadoCP.valorPorcentaje,
    valorFijo: VALOR_FIJO_CONSEJO_PROVINCIAL,
    impuestoConsejoProvincial: resultadoCP.total,
    totalImpuestos: Math.round((impuestoAlcabala + resultadoCP.total) * 100) / 100,
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

export function obtenerRebajaDescripcion(meses: number): string {
  if (meses <= 12) return '40% - Primer año'
  if (meses <= 24) return '30% - Segundo año'
  if (meses <= 36) return '20% - Tercer año'
  return 'Sin rebaja - Más de 3 años'
}
