import { describe, it, expect } from 'vitest'
import { calcularRegistroPropiedad } from './registro'

describe('calcularRegistroPropiedad', () => {
  it('debe calcular costos de registro para avaluo de $100,000', () => {
    const result = calcularRegistroPropiedad({ avaluoCatastral: 100000 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.desglose.length).toBe(3)
  })
})
