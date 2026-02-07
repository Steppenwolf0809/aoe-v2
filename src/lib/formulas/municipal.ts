import type { FormulaInput, FormulaOutput } from './types'

// TODO: implementar formulas reales de alcabalas y plusvalia
export function calcularAlcabalas(input: FormulaInput): FormulaOutput {
  const { avaluoCatastral } = input

  // Alcabalas: 1% del avaluo catastral (simplificado)
  const alcabala = avaluoCatastral * 0.01

  return {
    desglose: [
      { concepto: 'Impuesto de alcabalas (1%)', valor: alcabala },
    ],
    total: alcabala,
  }
}

export function calcularPlusvalia(input: FormulaInput): FormulaOutput {
  const { avaluoCatastral, precioVenta = avaluoCatastral, aniosPropiedad = 1 } = input

  // Plusvalia simplificada
  const ganancia = Math.max(0, precioVenta - avaluoCatastral)
  const tasa = aniosPropiedad > 5 ? 0.005 : 0.01
  const plusvalia = ganancia * tasa

  return {
    desglose: [
      { concepto: `Plusvalia (${(tasa * 100).toFixed(1)}%)`, valor: plusvalia },
    ],
    total: plusvalia,
  }
}
