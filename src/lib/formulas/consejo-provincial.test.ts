import { describe, it, expect } from 'vitest'
import {
  calcularConsejoProvincial,
  calcularAlcabalaYConsejoProvincial,
  TASA_CONSEJO_PROVINCIAL,
  VALOR_FIJO_CONSEJO_PROVINCIAL,
} from './consejo-provincial'

// ============================================
// CALCULO CONSEJO PROVINCIAL BASICO
// ============================================
describe('calcularConsejoProvincial', () => {
  it('calcula 10% de la alcabala + $1.80 fijo', () => {
    const r = calcularConsejoProvincial(800) // alcabala = $800
    expect(r.valorPorcentaje).toBe(80) // 10% de 800
    expect(r.valorFijo).toBe(1.8)
    expect(r.total).toBe(81.8) // 80 + 1.80
  })

  it('constantes correctas', () => {
    expect(TASA_CONSEJO_PROVINCIAL).toBe(0.1)
    expect(VALOR_FIJO_CONSEJO_PROVINCIAL).toBe(1.8)
  })

  it('alcabala = $0', () => {
    const r = calcularConsejoProvincial(0)
    expect(r.valorPorcentaje).toBe(0)
    expect(r.total).toBe(1.8) // solo el fijo
  })

  it('alcabala = $1200', () => {
    const r = calcularConsejoProvincial(1200)
    expect(r.valorPorcentaje).toBe(120)
    expect(r.total).toBe(121.8)
  })

  it('desglose tiene 2 items', () => {
    const r = calcularConsejoProvincial(500)
    expect(r.desglose.length).toBe(2)
    expect(r.desglose[0].concepto).toContain('Contribución Provincial')
    expect(r.desglose[1].concepto).toContain('Valor Fijo')
  })
})

// ============================================
// FUNCION INTEGRADA (Alcabala + CP)
// ============================================
describe('calcularAlcabalaYConsejoProvincial', () => {
  it('caso basico $100k sin rebaja', () => {
    const r = calcularAlcabalaYConsejoProvincial(100000, 100000, 999)
    // Alcabala: 1% de 100000 = 1000
    expect(r.impuestoAlcabala).toBe(1000)
    // CP: 10% de 1000 + 1.80 = 101.80
    expect(r.impuestoConsejoProvincial).toBe(101.8)
    // Total: 1000 + 101.80
    expect(r.totalImpuestos).toBe(1101.8)
  })

  it('con rebaja 40% (primer año)', () => {
    const r = calcularAlcabalaYConsejoProvincial(100000, 100000, 6) // 6 meses
    // Alcabala: 1% * 100000 * (1-0.40) = 600
    expect(r.impuestoAlcabala).toBe(600)
    expect(r.rebajaAplicada).toBe(0.4)
    // CP: 10% de 600 + 1.80 = 61.80
    expect(r.impuestoConsejoProvincial).toBe(61.8)
  })

  it('usa el mayor entre transferencia y catastral', () => {
    const r = calcularAlcabalaYConsejoProvincial(80000, 120000, 999)
    expect(r.baseImponibleAlcabala).toBe(120000)
  })

  it('rebaja 10% en cuarto año', () => {
    const r = calcularAlcabalaYConsejoProvincial(100000, 100000, 40)
    expect(r.rebajaAplicada).toBe(0.1)
    expect(r.impuestoAlcabala).toBe(900)
  })

  it('sin rebaja despues de 4 años', () => {
    const r = calcularAlcabalaYConsejoProvincial(100000, 100000, 49)
    expect(r.rebajaAplicada).toBe(0)
    expect(r.impuestoAlcabala).toBe(1000)
  })
})
