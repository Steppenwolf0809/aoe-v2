import { describe, it, expect } from 'vitest'
import {
  calcularCotizacionVehicular,
  PORCENTAJE_FIRMA,
  TASA_TRANSFERENCIA_VEHICULAR,
  PRECIO_CONTRATO_BASICO,
} from './vehicular'
import { SBU_2026, IVA_RATE } from './types'

// ============================================
// CALCULO BASICO
// ============================================
describe('calcularCotizacionVehicular', () => {
  it('vehiculo $15,000, 2 firmas (default)', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 15000 })

    const tarifaFirma = Math.round(SBU_2026 * PORCENTAJE_FIRMA * 100) / 100
    expect(r.tarifaPorFirma).toBe(tarifaFirma)
    expect(r.numFirmas).toBe(2)

    // Notarial: 2 firmas * 3% SBU
    const costoNotarial = tarifaFirma * 2
    expect(r.costoNotarial).toBeCloseTo(costoNotarial, 2)

    // IVA 15% sobre notarial
    expect(r.ivaNotarial).toBeCloseTo(costoNotarial * IVA_RATE, 2)

    // Impuesto transferencia: 1% del valor
    expect(r.impuestoTransferencia).toBe(150)

    // Tiene precio AOE
    expect(r.precioContrato).toBe(PRECIO_CONTRATO_BASICO)
  })

  it('vehiculo $30,000, 4 firmas', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 30000, numFirmas: 4 })
    expect(r.numFirmas).toBe(4)
    expect(r.impuestoTransferencia).toBe(300) // 1% de 30k

    const tarifaFirma = Math.round(SBU_2026 * 0.03 * 100) / 100
    expect(r.costoNotarial).toBeCloseTo(tarifaFirma * 4, 2)
  })

  it('vehiculo $5,000 (barato)', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 5000 })
    expect(r.impuestoTransferencia).toBe(50)
  })

  it('vehiculo $100,000 (lujoso)', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 100000 })
    expect(r.impuestoTransferencia).toBe(1000)
  })

  it('totalEstimado = gastosExternos + precioContrato', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 20000 })
    expect(r.totalEstimado).toBeCloseTo(
      r.totalGastosExternos + r.precioContrato,
      2
    )
  })

  it('totalGastosExternos = notarial + impuestos', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 20000 })
    expect(r.totalGastosExternos).toBeCloseTo(
      r.totalNotarial + r.impuestoTransferencia,
      2
    )
  })

  it('totalNotarial incluye IVA', () => {
    const r = calcularCotizacionVehicular({ valorVehiculo: 10000 })
    expect(r.totalNotarial).toBeCloseTo(r.costoNotarial + r.ivaNotarial, 2)
  })
})
