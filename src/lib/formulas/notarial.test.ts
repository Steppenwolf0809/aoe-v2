import { describe, it, expect } from 'vitest'
import { calcularTramiteNotarial } from './notarial'

describe('calcularTramiteNotarial', () => {
  it('debe calcular arancel para transferencia de dominio', () => {
    // Transferencia de dominio de $50,000 en Tabla 1
    // Rango: 30,000.01 - 60,000 => Tarifa Base: 225.0
    const result = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 50000)
    expect(result.subtotal).toBe(225.0)
    expect(result.detalles.length).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThan(225.0) // subtotal + iva
  })

  it('debe retornar desglose con conceptos', () => {
    const result = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 100000)
    expect(result.detalles).toBeInstanceOf(Array)
    expect(result.detalles.length).toBeGreaterThan(0)
  })
})
