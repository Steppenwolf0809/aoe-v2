import { describe, it, expect } from 'vitest'
import { calcularAlcabala, calcularUtilidad } from './municipal'

// Helper para datos dummy
const datosBase = {
  fechaAdquisicion: '2020-01-01',
  fechaTransferencia: '2023-01-01',
  valorTransferencia: 80000,
  valorAdquisicion: 50000,
  avaluoCatastral: 60000,
  tipoTransferencia: 'Compraventa' as const,
  tipoTransferente: 'Natural' as const,
}

describe('calcularAlcabala', () => {
  it('debe calcular 1% del avaluo o transferencia (el mayor)', () => {
    // Mayor es transferencia (80000). 1% = 800
    const result = calcularAlcabala(datosBase)
    expect(result.baseImponible).toBe(80000)
    expect(result.impuesto).toBeGreaterThan(0)
  })
})

describe('calcularUtilidad', () => {
  it('debe calcular utilidad con ganancia', () => {
    const result = calcularUtilidad(datosBase)
    expect(result.utilidadBruta).toBeGreaterThan(0)
    expect(result.impuesto).toBeGreaterThan(0)
  })

  it('debe retornar 0 sin ganancia', () => {
    const datosSinGanancia = {
      ...datosBase,
      valorTransferencia: 40000, // Menor que adquisición
    }
    const result = calcularUtilidad(datosSinGanancia)
    expect(result.impuesto).toBe(0)
  })
})
