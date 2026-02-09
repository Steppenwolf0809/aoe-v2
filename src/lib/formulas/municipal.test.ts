import { describe, it, expect } from 'vitest'
import {
  calcularAlcabala,
  calcularUtilidad,
  calcularImpuestosMunicipales,
  calcularAños,
  calcularMeses,
  type DatosMunicipales,
} from './municipal'

// Helper base data
const datosBase: DatosMunicipales = {
  fechaAdquisicion: '2020-01-15',
  fechaTransferencia: '2026-02-08',
  valorTransferencia: 80000,
  valorAdquisicion: 50000,
  avaluoCatastral: 60000,
  tipoTransferencia: 'Compraventa',
  tipoTransferente: 'Natural',
}

// ============================================
// CALCULO DE TIEMPO
// ============================================
describe('calcularAños', () => {
  it('calcula años completos correctamente', () => {
    expect(calcularAños('2020-01-01', '2023-01-01')).toBe(3)
  })

  it('no cuenta año incompleto', () => {
    expect(calcularAños('2020-06-15', '2023-03-10')).toBe(2)
  })

  it('maximo 20 años', () => {
    expect(calcularAños('1990-01-01', '2026-01-01')).toBe(20)
  })

  it('retorna 0 si misma fecha', () => {
    expect(calcularAños('2026-01-01', '2026-01-01')).toBe(0)
  })

  it('retorna 0 si menos de un año', () => {
    expect(calcularAños('2025-06-01', '2026-02-01')).toBe(0)
  })
})

describe('calcularMeses', () => {
  it('calcula meses correctamente', () => {
    const meses = calcularMeses('2025-01-01', '2026-01-01')
    expect(meses).toBeGreaterThanOrEqual(11)
    expect(meses).toBeLessThanOrEqual(12)
  })

  it('6 meses', () => {
    const meses = calcularMeses('2025-01-01', '2025-07-01')
    expect(meses).toBeGreaterThanOrEqual(5)
    expect(meses).toBeLessThanOrEqual(6)
  })
})

// ============================================
// ALCABALA (Comprador)
// ============================================
describe('calcularAlcabala', () => {
  it('usa el mayor entre transferencia y avaluo como base', () => {
    const result = calcularAlcabala(datosBase)
    // Mayor es transferencia: 80000
    expect(result.baseImponible).toBe(80000)
  })

  it('aplica tasa del 1%', () => {
    const result = calcularAlcabala(datosBase)
    expect(result.tarifa).toBe(0.01)
  })

  it('sin rebaja cuando >3 años', () => {
    // 2020-01 a 2026-02 = ~6 años -> sin rebaja
    const result = calcularAlcabala(datosBase)
    expect(result.porcentajeRebaja).toBe(0)
    expect(result.impuesto).toBe(800) // 1% de 80000
  })

  it('rebaja 40% primer año', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      fechaAdquisicion: '2025-06-01',
      fechaTransferencia: '2026-02-01',
    }
    const result = calcularAlcabala(datos)
    expect(result.porcentajeRebaja).toBe(0.4)
    // 1% de 80000 = 800. Rebaja 40% = 320. Impuesto = 480
    expect(result.impuesto).toBe(480)
  })

  it('rebaja 30% segundo año', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      fechaAdquisicion: '2024-06-01',
      fechaTransferencia: '2026-02-01',
    }
    const result = calcularAlcabala(datos)
    expect(result.porcentajeRebaja).toBe(0.3)
    expect(result.impuesto).toBe(560)
  })

  it('rebaja 20% tercer año', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      fechaAdquisicion: '2023-06-01',
      fechaTransferencia: '2026-02-01',
    }
    const result = calcularAlcabala(datos)
    expect(result.porcentajeRebaja).toBe(0.2)
    expect(result.impuesto).toBe(640)
  })

  it('usa avaluo catastral si es mayor que transferencia', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      valorTransferencia: 50000,
      avaluoCatastral: 80000,
    }
    const result = calcularAlcabala(datos)
    expect(result.baseImponible).toBe(80000)
  })
})

// ============================================
// UTILIDAD (Vendedor - Plusvalia)
// ============================================
describe('calcularUtilidad', () => {
  it('calcula utilidad bruta correctamente', () => {
    const result = calcularUtilidad(datosBase)
    // Mayor(80k, 60k) - 50k = 30000
    expect(result.utilidadBruta).toBe(30000)
  })

  it('aplica deduccion por tiempo (5% anual)', () => {
    const result = calcularUtilidad(datosBase)
    // 6 años -> 30% deduccion
    expect(result.añosTranscurridos).toBe(6)
    expect(result.deduccionTiempo).toBe(30000 * 0.05 * 6) // 9000
  })

  it('tarifa 10% para persona natural', () => {
    const result = calcularUtilidad(datosBase)
    expect(result.tarifaAplicada).toBe(0.1)
    // Base: 30000 - 9000 = 21000. 10% = 2100
    expect(result.impuesto).toBe(2100)
  })

  it('tarifa 4% para inmobiliaria', () => {
    const datos: DatosMunicipales = { ...datosBase, tipoTransferente: 'Inmobiliaria' }
    const result = calcularUtilidad(datos)
    expect(result.tarifaAplicada).toBe(0.04)
  })

  it('tarifa 1% para donacion', () => {
    const datos: DatosMunicipales = { ...datosBase, tipoTransferencia: 'Donación' }
    const result = calcularUtilidad(datos)
    expect(result.tarifaAplicada).toBe(0.01)
  })

  it('retorna 0 si no hay utilidad (venta < compra)', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      valorTransferencia: 40000,
      avaluoCatastral: 40000, // ambos menores que adquisicion
    }
    const result = calcularUtilidad(datos)
    expect(result.impuesto).toBe(0)
  })

  it('descuenta mejoras de la utilidad', () => {
    const datos: DatosMunicipales = { ...datosBase, mejoras: 10000 }
    const result = calcularUtilidad(datos)
    // 80000 - (50000 + 10000) = 20000
    expect(result.utilidadBruta).toBe(20000)
  })

  it('descuenta contribucion de mejoras', () => {
    const datos: DatosMunicipales = { ...datosBase, contribucionMejoras: 5000 }
    const result = calcularUtilidad(datos)
    // 80000 - (50000 + 5000) = 25000
    expect(result.utilidadBruta).toBe(25000)
  })

  it('deduccion maxima 100% (20 años)', () => {
    const datos: DatosMunicipales = {
      ...datosBase,
      fechaAdquisicion: '2000-01-01',
      fechaTransferencia: '2026-01-01',
    }
    const result = calcularUtilidad(datos)
    expect(result.añosTranscurridos).toBe(20)
    // 5% * 20 = 100% deduccion -> base imponible 0
    expect(result.baseImponible).toBe(0)
    expect(result.impuesto).toBe(0)
  })
})

// ============================================
// FUNCION INTEGRADA
// ============================================
describe('calcularImpuestosMunicipales', () => {
  it('retorna utilidad + alcabala + total', () => {
    const result = calcularImpuestosMunicipales(datosBase)
    expect(result.utilidad).toBeDefined()
    expect(result.alcabala).toBeDefined()
    expect(result.total).toBe(result.totalVendedor + result.totalComprador)
  })

  it('totalVendedor = impuesto utilidad', () => {
    const result = calcularImpuestosMunicipales(datosBase)
    expect(result.totalVendedor).toBe(result.utilidad.impuesto)
  })

  it('totalComprador = impuesto alcabala', () => {
    const result = calcularImpuestosMunicipales(datosBase)
    expect(result.totalComprador).toBe(result.alcabala.impuesto)
  })

  it('caso completo: $120k, compra hace 2 años por $80k', () => {
    const datos: DatosMunicipales = {
      fechaAdquisicion: '2024-01-01',
      fechaTransferencia: '2026-02-01',
      valorTransferencia: 120000,
      valorAdquisicion: 80000,
      avaluoCatastral: 100000,
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
    }
    const result = calcularImpuestosMunicipales(datos)

    // ~25 meses -> tercer año -> rebaja 20%
    // Alcabala: 1% de 120000 = 1200. Rebaja 20% = 240. Impuesto = 960
    expect(result.alcabala.impuesto).toBe(960)

    // Utilidad: 120000 - 80000 = 40000. 2 años: 10% deduccion -> 36000. 10% = 3600
    expect(result.utilidad.impuesto).toBe(3600)

    expect(result.total).toBe(960 + 3600)
  })
})
