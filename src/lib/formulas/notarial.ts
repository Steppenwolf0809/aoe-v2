import type { FormulaInput, FormulaOutput } from './types'

// TODO: implementar formulas reales basadas en tablas del Consejo de la Judicatura
export function calcularArancelNotarial(input: FormulaInput): FormulaOutput {
  const { avaluoCatastral } = input

  // Placeholder: formula simplificada
  const arancelBase = avaluoCatastral * 0.004
  const fondoJudicial = arancelBase * 0.1
  const iva = arancelBase * 0.15

  return {
    desglose: [
      { concepto: 'Arancel base', valor: arancelBase },
      { concepto: 'Fondo judicial (10%)', valor: fondoJudicial },
      { concepto: 'IVA (15%)', valor: iva },
    ],
    total: arancelBase + fondoJudicial + iva,
  }
}
