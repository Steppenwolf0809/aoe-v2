import { describe, it, expect } from 'vitest'
import { calcularAlcabalas, calcularPlusvalia } from './municipal'

describe('calcularAlcabalas', () => {
  it('debe calcular 1% del avaluo catastral', () => {
    const result = calcularAlcabalas({ avaluoCatastral: 100000 })
    expect(result.total).toBe(1000)
  })
})

describe('calcularPlusvalia', () => {
  it('debe calcular plusvalia con ganancia', () => {
    const result = calcularPlusvalia({
      avaluoCatastral: 50000,
      precioVenta: 80000,
      aniosPropiedad: 3,
    })
    expect(result.total).toBeGreaterThan(0)
  })

  it('debe retornar 0 sin ganancia', () => {
    const result = calcularPlusvalia({
      avaluoCatastral: 80000,
      precioVenta: 50000,
    })
    expect(result.total).toBe(0)
  })
})
