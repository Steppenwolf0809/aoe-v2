/**
 * Presupuestador Inmobiliario — Aggregator
 *
 * Combina TODAS las fórmulas de una transacción inmobiliaria:
 *   Comprador paga: Notarial + Alcabala + Consejo Provincial + Registro
 *   Vendedor paga: Plusvalía (Utilidad)
 *
 * Este módulo es la FUNCIÓN ESTRELLA del producto.
 * Es el destino final del embudo SEO de calculadoras individuales.
 */

import { calcularTramiteNotarial } from './notarial'
import {
  calcularAlcabala,
  calcularUtilidad,
  type DatosMunicipales,
} from './municipal'
import { calcularArancelRegistro } from './registro'
import { calcularConsejoProvincial } from './consejo-provincial'

// ============================================
// INTERFACES
// ============================================

export type RolTransaccion = 'comprador' | 'vendedor'

export interface InputInmobiliario {
  // Datos del inmueble
  valorTransferencia: number
  avaluoCatastral: number

  // Datos del vendedor (para plusvalía)
  valorAdquisicion: number
  fechaAdquisicion: string // YYYY-MM-DD
  fechaTransferencia: string // YYYY-MM-DD
  tipoTransferencia: 'Compraventa' | 'Donación' | 'Dación en pago'
  tipoTransferente: 'Natural' | 'Inmobiliaria'

  // Opcionales
  mejoras?: number
  contribucionMejoras?: number
  esViviendaSocial?: boolean
  esTerceraEdad?: boolean
  esDiscapacitado?: boolean
}

export interface GastosComprador {
  notarial: {
    subtotal: number
    iva: number
    total: number
    detalles: string[]
  }
  alcabala: {
    baseImponible: number
    porcentajeRebaja: number
    rebajaDescripcion: string
    impuesto: number
  }
  consejoProvincial: {
    valorPorcentaje: number
    valorFijo: number
    total: number
  }
  registro: {
    arancelBase: number
    descuentos: number
    arancelFinal: number
  }
  total: number
}

export interface GastosVendedor {
  plusvalia: {
    utilidadBruta: number
    añosTranscurridos: number
    deduccionTiempo: number
    baseImponible: number
    tarifaAplicada: number
    tarifaDescripcion: string
    impuesto: number
  }
  total: number
}

export interface ResultadoInmobiliario {
  comprador: GastosComprador
  vendedor: GastosVendedor
  totalTransaccion: number
  resumen: {
    valorInmueble: number
    porcentajeGastosComprador: number
    porcentajeGastosVendedor: number
    porcentajeGastosTotal: number
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function calcularPresupuestoInmobiliario(
  input: InputInmobiliario
): ResultadoInmobiliario {
  // --- GASTOS DEL COMPRADOR ---

  // 1. Notarial (Transferencia de Dominio)
  const notarial = calcularTramiteNotarial(
    'TRANSFERENCIA_DOMINIO',
    input.valorTransferencia,
    {
      esViviendaSocial: input.esViviendaSocial,
      esTerceraEdad: input.esTerceraEdad,
    }
  )

  // 2. Alcabala (impuesto municipal al comprador)
  const datosMunicipales: DatosMunicipales = {
    fechaAdquisicion: input.fechaAdquisicion,
    fechaTransferencia: input.fechaTransferencia,
    valorTransferencia: input.valorTransferencia,
    valorAdquisicion: input.valorAdquisicion,
    avaluoCatastral: input.avaluoCatastral,
    tipoTransferencia: input.tipoTransferencia,
    tipoTransferente: input.tipoTransferente,
    mejoras: input.mejoras,
    contribucionMejoras: input.contribucionMejoras,
  }
  const alcabala = calcularAlcabala(datosMunicipales)

  // 3. Consejo Provincial (10% de la alcabala + $1.80)
  const consejoProvincial = calcularConsejoProvincial(alcabala.impuesto)

  // 4. Registro de la Propiedad
  const registro = calcularArancelRegistro(
    input.valorTransferencia,
    input.esTerceraEdad || false,
    input.esDiscapacitado || false
  )

  const totalComprador = round(
    notarial.total +
      alcabala.impuesto +
      consejoProvincial.total +
      registro.arancelFinal
  )

  // --- GASTOS DEL VENDEDOR ---

  // 5. Plusvalía (Impuesto a la Utilidad)
  const utilidad = calcularUtilidad(datosMunicipales)

  const totalVendedor = round(utilidad.impuesto)

  // --- RESUMEN ---
  const totalTransaccion = round(totalComprador + totalVendedor)
  const valorInmueble = Math.max(input.valorTransferencia, input.avaluoCatastral)

  return {
    comprador: {
      notarial: {
        subtotal: notarial.subtotal,
        iva: notarial.iva,
        total: notarial.total,
        detalles: notarial.detalles,
      },
      alcabala: {
        baseImponible: alcabala.baseImponible,
        porcentajeRebaja: alcabala.porcentajeRebaja,
        rebajaDescripcion: alcabala.rebajaDescripcion,
        impuesto: alcabala.impuesto,
      },
      consejoProvincial: {
        valorPorcentaje: consejoProvincial.valorPorcentaje,
        valorFijo: consejoProvincial.valorFijo,
        total: consejoProvincial.total,
      },
      registro: {
        arancelBase: registro.arancelBase,
        descuentos: registro.descuentos.reduce((sum, d) => sum + d.valor, 0),
        arancelFinal: registro.arancelFinal,
      },
      total: totalComprador,
    },
    vendedor: {
      plusvalia: {
        utilidadBruta: utilidad.utilidadBruta,
        añosTranscurridos: utilidad.añosTranscurridos,
        deduccionTiempo: utilidad.deduccionTiempo,
        baseImponible: utilidad.baseImponible,
        tarifaAplicada: utilidad.tarifaAplicada,
        tarifaDescripcion: utilidad.tarifaDescripcion,
        impuesto: utilidad.impuesto,
      },
      total: totalVendedor,
    },
    totalTransaccion,
    resumen: {
      valorInmueble,
      porcentajeGastosComprador: round((totalComprador / valorInmueble) * 100),
      porcentajeGastosVendedor: round((totalVendedor / valorInmueble) * 100),
      porcentajeGastosTotal: round((totalTransaccion / valorInmueble) * 100),
    },
  }
}

// ============================================
// FUNCIONES AUXILIARES PARA PRESUPUESTO
// ============================================

/**
 * Calcula solo los gastos del comprador (para la vista de comprador)
 */
export function calcularGastosComprador(
  input: InputInmobiliario
): GastosComprador {
  return calcularPresupuestoInmobiliario(input).comprador
}

/**
 * Calcula solo los gastos del vendedor (para la vista de vendedor)
 */
export function calcularGastosVendedor(
  input: InputInmobiliario
): GastosVendedor {
  return calcularPresupuestoInmobiliario(input).vendedor
}

// ============================================
// HELPERS
// ============================================

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(valor)
}
