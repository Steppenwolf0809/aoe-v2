/**
 * Lógica de Cálculo - Cotizador Vehicular
 *
 * El contrato de compraventa vehicular es un DOCUMENTO PRIVADO
 * con reconocimiento de firmas. NO se calcula por cuantía.
 *
 * Costos:
 * 1. Reconocimiento de firmas (3% SBU por firma) - Notaría
 * 2. IVA (15%) sobre la notaría
 * 3. Impuesto fiscal transferencia de dominio (1%) - SRI/Prefectura
 * 4. Servicio AOE (precio del contrato generado)
 */

import { SBU_2026, IVA_RATE } from './types'

// ============================================
// CONSTANTES
// ============================================
export const PORCENTAJE_FIRMA = 0.03 // 3% SBU por reconocimiento de firma
export const TASA_TRANSFERENCIA_VEHICULAR = 0.01 // 1% del valor del vehículo
export const PRECIO_CONTRATO_BASICO = 9.99
export const PRECIO_CONTRATO_REVISION = 35.0
export const PRECIO_CONTRATO_CONSULTA = 60.0

// ============================================
// INTERFACES
// ============================================
export interface InputVehicular {
  valorVehiculo: number
  numFirmas?: number // Default 2 (comprador + vendedor)
}

export interface ResultadoVehicular {
  // Gastos notariales
  tarifaPorFirma: number
  numFirmas: number
  costoNotarial: number
  ivaNotarial: number
  totalNotarial: number

  // Impuestos fiscales
  impuestoTransferencia: number

  // Total gastos externos
  totalGastosExternos: number

  // Servicio AOE
  precioContrato: number

  // Total general
  totalEstimado: number
}

// ============================================
// FUNCION PRINCIPAL
// ============================================
export function calcularCotizacionVehicular(
  input: InputVehicular
): ResultadoVehicular {
  const numFirmas = input.numFirmas || 2
  const tarifaPorFirma = Math.round(SBU_2026 * PORCENTAJE_FIRMA * 100) / 100

  // 1. Costo notarial (reconocimiento de firmas)
  const costoNotarial = Math.round(tarifaPorFirma * numFirmas * 100) / 100
  const ivaNotarial = Math.round(costoNotarial * IVA_RATE * 100) / 100
  const totalNotarial = Math.round((costoNotarial + ivaNotarial) * 100) / 100

  // 2. Impuesto fiscal (1% del valor del vehículo)
  const impuestoTransferencia = Math.round(input.valorVehiculo * TASA_TRANSFERENCIA_VEHICULAR * 100) / 100

  // 3. Total gastos externos
  const totalGastosExternos = Math.round((totalNotarial + impuestoTransferencia) * 100) / 100

  // 4. Total estimado (gastos + servicio AOE)
  const totalEstimado = Math.round((totalGastosExternos + PRECIO_CONTRATO_BASICO) * 100) / 100

  return {
    tarifaPorFirma,
    numFirmas,
    costoNotarial,
    ivaNotarial,
    totalNotarial,
    impuestoTransferencia,
    totalGastosExternos,
    precioContrato: PRECIO_CONTRATO_BASICO,
    totalEstimado,
  }
}
