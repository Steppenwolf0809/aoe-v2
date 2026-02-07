import { describe, it, expect } from 'vitest'
import { calcularArancelNotarial } from './notarial'

describe('calcularArancelNotarial', () => {
  it('debe calcular arancel para avaluo de $50,000', () => {
    const result = calcularArancelNotarial({ avaluoCatastral: 50000 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.desglose.length).toBeGreaterThan(0)
  })

  it('debe retornar desglose con conceptos', () => {
    const result = calcularArancelNotarial({ avaluoCatastral: 100000 })
    result.desglose.forEach((item) => {
      expect(item.concepto).toBeTruthy()
      expect(item.valor).toBeGreaterThanOrEqual(0)
    })
  })
})
