export interface CalculatorInput {
  avaluoCatastral: number
  precioVenta?: number
  aniosPropiedad?: number
}

export interface CalculatorResult {
  items: CalculatorResultItem[]
  total: number
}

export interface CalculatorResultItem {
  label: string
  value: number
  description?: string
}

export type CalculatorType = 'notarial' | 'alcabalas' | 'plusvalia' | 'registro-propiedad' | 'consejo-provincial'
