/**
 * Cotización de costos de terceros — solo notaría, impuestos y registro.
 * Sin honorarios, sin margen, sin plusvalía. La usa GET /api/cotizar.
 * Compone las fórmulas existentes; no define tarifas propias.
 */

import { calcularTramiteNotarial, IVA_RATE, SBU_2026, type TipoTramite } from './notarial'
import { calcularMeses } from './municipal'
import {
  calcularAlcabalaYConsejoProvincial,
  calcularConsejoProvincial,
  VALOR_FIJO_CONSEJO_PROVINCIAL,
} from './consejo-provincial'
import { calcularArancelRegistro, LIMITE_MAXIMO } from './registro'

// ============================================
// INTERFACES
// ============================================

export type TipoCotizacion = 'compraventa' | 'promesa' | 'hipoteca' | 'donacion'

export interface InputCotizacion {
  tipo: TipoCotizacion
  cuantia: number
  avaluo?: number
  fechaAdquisicion?: string // YYYY-MM-DD
  donacionLegitimario?: boolean // default true
}

export interface RubroCotizacion {
  id: 'notaria' | 'alcabala' | 'consejo_provincial' | 'registro'
  nombre: string
  valor: number | null
  base_legal: string
  formula: string
  supuestos: string[]
}

export interface ResultadoCotizacion {
  tipo: TipoCotizacion
  moneda: 'USD'
  base_imponible: number
  rubros: RubroCotizacion[]
  subtotal: number
  supuestos: string[]
  aviso: string
}

// ============================================
// CONSTANTES DE TEXTO
// ============================================

const TRAMITE_NOTARIAL: Record<TipoCotizacion, TipoTramite> = {
  compraventa: 'TRANSFERENCIA_DOMINIO',
  donacion: 'TRANSFERENCIA_DOMINIO',
  promesa: 'PROMESA_COMPRAVENTA',
  hipoteca: 'HIPOTECA',
}

const REGLAMENTO_NOTARIAL =
  'Reglamento del Sistema Notarial Integral de la Función Judicial (R.O. Nº 246, 2023-02-08)'

export const AVISO_COTIZACION =
  'Solo costos de terceros (notaría, alcabala, consejo provincial y registro). ' +
  'No incluye honorarios profesionales, plusvalía ni otros cobros. Valores referenciales.'

export const SUPUESTO_REGISTRO_HIPOTECA =
  'Tasa fija del registro para hipotecas no configurada; no incluida en el subtotal.'

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function cotizar(input: InputCotizacion, hoy: Date = new Date()): ResultadoCotizacion {
  const supuestos: string[] = []
  const base = baseImponible(input, supuestos)
  const rubros: RubroCotizacion[] = [rubroNotaria(input.tipo, base)]

  if (input.tipo === 'compraventa' || input.tipo === 'donacion') {
    const conAlcabala = input.tipo === 'compraventa' || input.donacionLegitimario === false
    rubros.push(...rubrosImpuestos(base, conAlcabala, input.fechaAdquisicion, hoy))
    rubros.push(rubroRegistro(base))
  }

  if (input.tipo === 'hipoteca') {
    rubros.push({
      id: 'registro',
      nombre: 'Registro de la Propiedad',
      valor: null,
      base_legal: 'Registro de la Propiedad de Quito — tasa fija para hipotecas',
      formula: 'No configurada',
      supuestos: [SUPUESTO_REGISTRO_HIPOTECA],
    })
  }

  supuestos.push(`Fecha de cálculo: ${hoy.toISOString().slice(0, 10)}.`)

  return {
    tipo: input.tipo,
    moneda: 'USD',
    base_imponible: base,
    rubros,
    subtotal: round(rubros.reduce((sum, r) => sum + (r.valor ?? 0), 0)),
    supuestos,
    aviso: AVISO_COTIZACION,
  }
}

// ============================================
// RUBROS
// ============================================

function baseImponible(input: InputCotizacion, supuestos: string[]): number {
  if (input.tipo === 'hipoteca') {
    if (input.avaluo !== undefined) {
      supuestos.push('Hipoteca: base = monto del préstamo (cuantía); el avalúo no se usa.')
    }
    return input.cuantia
  }
  if (input.avaluo !== undefined && input.avaluo > input.cuantia) {
    supuestos.push(`Base = avalúo (${usd(input.avaluo)}) por ser mayor que la cuantía (${usd(input.cuantia)}).`)
    return input.avaluo
  }
  return input.cuantia
}

function rubroNotaria(tipo: TipoCotizacion, base: number): RubroCotizacion {
  const r = calcularTramiteNotarial(TRAMITE_NOTARIAL[tipo], base)
  return {
    id: 'notaria',
    nombre: 'Notaría',
    valor: r.total,
    base_legal: `${REGLAMENTO_NOTARIAL}, ${r.detalles[0]}`,
    formula: `Tarifa del rango ${usd(r.subtotal)} + IVA ${IVA_RATE * 100} % ${usd(r.iva)} = ${usd(r.total)}`,
    supuestos: [
      `SBU vigente: ${usd(SBU_2026)}.`,
      'Sin rebajas por vivienda de interés social ni adulto mayor.',
    ],
  }
}

function rubrosImpuestos(
  base: number,
  conAlcabala: boolean,
  fechaAdquisicion: string | undefined,
  hoy: Date
): RubroCotizacion[] {
  const supuestosCP = ['Aplica a inmuebles en la provincia de Pichincha.']

  if (!conAlcabala) {
    const cp = calcularConsejoProvincial(0)
    return [
      {
        id: 'alcabala',
        nombre: 'Alcabala',
        valor: 0,
        base_legal: 'COOTAD, impuesto de alcabala',
        formula: 'No aplica',
        supuestos: ['Donación a legitimario: sin alcabala (donacion_legitimario=true, valor por defecto).'],
      },
      {
        id: 'consejo_provincial',
        nombre: 'Consejo Provincial',
        valor: cp.total,
        base_legal: 'Ordenanza del Consejo Provincial de Pichincha',
        formula: `Sin alcabala: solo valor fijo ${usd(VALOR_FIJO_CONSEJO_PROVINCIAL)}`,
        supuestos: supuestosCP,
      },
    ]
  }

  const meses = fechaAdquisicion ? calcularMeses(fechaAdquisicion, hoy) : undefined
  const r = calcularAlcabalaYConsejoProvincial(base, base, meses ?? 999)
  const antesRebaja = round(base * 0.01)

  const supuestosAlcabala =
    meses === undefined
      ? ['Sin fecha de adquisición: se calcula sin rebaja por tiempo.']
      : [`${meses} meses desde la adquisición (${fechaAdquisicion}) hasta la fecha de cálculo.`]

  const formulaAlcabala =
    r.rebajaAplicada > 0
      ? `1 % × ${usd(base)} = ${usd(antesRebaja)} − rebaja ${r.rebajaAplicada * 100} % = ${usd(r.impuestoAlcabala)}`
      : `1 % × ${usd(base)} = ${usd(r.impuestoAlcabala)}`

  return [
    {
      id: 'alcabala',
      nombre: 'Alcabala',
      valor: r.impuestoAlcabala,
      base_legal: 'COOTAD, impuesto de alcabala (1 % sobre el mayor entre precio y avalúo, rebaja por tiempo)',
      formula: formulaAlcabala,
      supuestos: supuestosAlcabala,
    },
    {
      id: 'consejo_provincial',
      nombre: 'Consejo Provincial',
      valor: r.impuestoConsejoProvincial,
      base_legal: 'Ordenanza del Consejo Provincial de Pichincha',
      formula: `10 % × alcabala ${usd(r.impuestoAlcabala)} = ${usd(r.valorPorcentaje)} + valor fijo ${usd(r.valorFijo)} = ${usd(r.impuestoConsejoProvincial)}`,
      supuestos: supuestosCP,
    },
  ]
}

function rubroRegistro(base: number): RubroCotizacion {
  const r = calcularArancelRegistro(base)
  const formula =
    r.exceso === null
      ? `Rango ${r.rango} de la tabla: ${usd(r.arancelFinal)}`
      : `$100 + 0,5 % × (${usd(base)} − $10.000) = ${usd(round(100 + r.exceso * 0.005))}` +
        (r.excedeMaximo ? `; tope ${usd(LIMITE_MAXIMO)}` : '')

  return {
    id: 'registro',
    nombre: 'Registro de la Propiedad',
    valor: r.arancelFinal,
    base_legal: 'Tabla de aranceles del Registro de la Propiedad de Quito',
    formula,
    supuestos: ['Sin descuentos por adulto mayor ni discapacidad.'],
  }
}

// ============================================
// HELPERS
// ============================================

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function usd(valor: number): string {
  return `$${valor.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
