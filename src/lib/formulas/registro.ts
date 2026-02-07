import type { FormulaInput, FormulaOutput } from './types'

// TODO: implementar formulas reales del Registro de la Propiedad
export function calcularRegistroPropiedad(input: FormulaInput): FormulaOutput {
  const { avaluoCatastral } = input

  // Placeholder simplificado
  const inscripcion = avaluoCatastral * 0.003
  const certificados = 25
  const marginacion = 15

  return {
    desglose: [
      { concepto: 'Inscripcion (0.3%)', valor: inscripcion },
      { concepto: 'Certificados', valor: certificados },
      { concepto: 'Marginacion', valor: marginacion },
    ],
    total: inscripcion + certificados + marginacion,
  }
}
