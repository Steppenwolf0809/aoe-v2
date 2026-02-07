export interface FormulaInput {
  avaluoCatastral: number
  precioVenta?: number
  aniosPropiedad?: number
}

export interface FormulaResult {
  concepto: string
  valor: number
}

export interface FormulaOutput {
  desglose: FormulaResult[]
  total: number
}
