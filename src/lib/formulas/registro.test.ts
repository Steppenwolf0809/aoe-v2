import { describe, it, expect } from 'vitest'
import { calcularArancelRegistro } from './registro'

describe('calcularRegistroPropiedad', () => {
  it('debe calcular costos de registro para avaluo de $100,000', () => {
    const result = calcularArancelRegistro(100000)
    expect(result.arancelFinal).toBeGreaterThan(0)
    expect(result.arancelBase).toBeGreaterThan(0)
  })
})
