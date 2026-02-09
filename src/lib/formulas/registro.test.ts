import { describe, it, expect } from 'vitest'
import {
  calcularArancelRegistro,
  calcularArancelBase,
  aplicarDescuentos,
  LIMITE_MAXIMO,
} from './registro'

// ============================================
// RANGOS 1-8: TARIFA FIJA
// ============================================
describe('Rangos fijos (1-8)', () => {
  it('rango 1: $0.01 - $3,000 -> $22', () => {
    const r = calcularArancelRegistro(2000)
    expect(r.arancelBase).toBe(22)
    expect(r.arancelFinal).toBe(22)
    expect(r.rango).toBe(1)
  })

  it('rango 2: $3,000.01 - $6,600 -> $30', () => {
    const r = calcularArancelRegistro(5000)
    expect(r.arancelBase).toBe(30)
    expect(r.rango).toBe(2)
  })

  it('rango 3: $6,600.01 - $10,000 -> $35', () => {
    const r = calcularArancelRegistro(8000)
    expect(r.arancelBase).toBe(35)
    expect(r.rango).toBe(3)
  })

  it('rango 4: $10,000.01 - $15,000 -> $40', () => {
    const r = calcularArancelRegistro(12000)
    expect(r.arancelBase).toBe(40)
    expect(r.rango).toBe(4)
  })

  it('rango 5: $15,000.01 - $25,000 -> $50', () => {
    const r = calcularArancelRegistro(20000)
    expect(r.arancelBase).toBe(50)
    expect(r.rango).toBe(5)
  })

  it('rango 6: $25,000.01 - $30,000 -> $100', () => {
    const r = calcularArancelRegistro(28000)
    expect(r.arancelBase).toBe(100)
    expect(r.rango).toBe(6)
  })

  it('rango 7: $30,000.01 - $35,000 -> $160', () => {
    const r = calcularArancelRegistro(32000)
    expect(r.arancelBase).toBe(160)
    expect(r.rango).toBe(7)
  })

  it('rango 8: $35,000.01 - $40,000 -> $200', () => {
    const r = calcularArancelRegistro(38000)
    expect(r.arancelBase).toBe(200)
    expect(r.rango).toBe(8)
  })
})

// ============================================
// RANGO 9: FORMULA ESPECIAL (>$40,000)
// ============================================
describe('Rango 9 (>$40,000)', () => {
  it('$50,000: $100 + 0.5% de ($50k - $10k) = $300', () => {
    const r = calcularArancelRegistro(50000)
    expect(r.arancelBase).toBe(300)
    expect(r.rango).toBe(9)
    expect(r.exceso).toBe(40000)
  })

  it('$100,000: $100 + 0.5% de ($100k - $10k) = $550 -> cap $500', () => {
    const r = calcularArancelRegistro(100000)
    // 100 + (90000 * 0.005) = 100 + 450 = 550 -> capped at 500
    expect(r.arancelBase).toBe(500)
    expect(r.excedeMaximo).toBe(true)
    expect(r.arancelFinal).toBe(500)
  })

  it('$200,000: excede maximo $500', () => {
    const r = calcularArancelRegistro(200000)
    expect(r.arancelBase).toBe(500) // capped
    expect(r.excedeMaximo).toBe(true)
  })

  it('$40,000.01: apenas excede rango 8', () => {
    const r = calcularArancelBase(40000.01)
    // 100 + (30000.01 * 0.005) = 100 + 150 = 250
    expect(r.arancel).toBeCloseTo(250, 0)
    expect(r.rango).toBe(9)
  })

  it('$80,000: $100 + 0.5% de $70k = $450', () => {
    const r = calcularArancelRegistro(80000)
    expect(r.arancelBase).toBeCloseTo(450, 0)
    expect(r.excedeMaximo).toBe(false)
  })
})

// ============================================
// LIMITE MAXIMO
// ============================================
describe('Limite maximo $500', () => {
  it('no excede para valores bajos', () => {
    const r = calcularArancelRegistro(30000)
    expect(r.excedeMaximo).toBe(false)
  })

  it('excede para valores altos', () => {
    const r = calcularArancelRegistro(150000)
    expect(r.excedeMaximo).toBe(true)
    expect(r.arancelFinal).toBe(LIMITE_MAXIMO)
  })
})

// ============================================
// DESCUENTOS
// ============================================
describe('Descuentos', () => {
  it('tercera edad: 50% de descuento', () => {
    const r = calcularArancelRegistro(50000, true)
    // Base $300, descuento 50% -> $150
    expect(r.descuentos.length).toBe(1)
    expect(r.descuentos[0].tipo).toBe('Tercera Edad')
    expect(r.arancelFinal).toBe(150)
  })

  it('discapacidad: 50% de descuento', () => {
    const r = calcularArancelRegistro(50000, false, true)
    expect(r.descuentos.length).toBe(1)
    expect(r.descuentos[0].tipo).toBe('Discapacidad')
    expect(r.arancelFinal).toBe(150)
  })

  it('ambos descuentos acumulados', () => {
    const r = calcularArancelRegistro(50000, true, true)
    // $300 * 0.5 = $150 (tercera edad) * 0.5 = $75 (discapacidad)
    expect(r.descuentos.length).toBe(2)
    expect(r.arancelFinal).toBe(75)
  })

  it('sin descuentos', () => {
    const r = calcularArancelRegistro(50000, false, false)
    expect(r.descuentos.length).toBe(0)
    expect(r.arancelFinal).toBe(300)
  })
})

// ============================================
// EDGE CASES
// ============================================
describe('Edge cases', () => {
  it('valor $0 retorna arancel 0', () => {
    const r = calcularArancelRegistro(0)
    expect(r.arancelBase).toBe(0)
    expect(r.arancelFinal).toBe(0)
    expect(r.rango).toBe(0)
  })

  it('valor negativo retorna arancel 0', () => {
    const r = calcularArancelRegistro(-1000)
    expect(r.arancelBase).toBe(0)
    expect(r.arancelFinal).toBe(0)
  })

  it('valor exacto en borde de rango ($3,000)', () => {
    const r = calcularArancelRegistro(3000)
    expect(r.arancelBase).toBe(22)
    expect(r.rango).toBe(1)
  })

  it('valor justo encima del borde ($3,000.01)', () => {
    const r = calcularArancelRegistro(3000.01)
    expect(r.arancelBase).toBe(30)
    expect(r.rango).toBe(2)
  })
})
