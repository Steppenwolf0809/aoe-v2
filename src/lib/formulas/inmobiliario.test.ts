import { describe, it, expect } from 'vitest'
import {
  calcularPresupuestoInmobiliario,
  calcularGastosComprador,
  calcularGastosVendedor,
  type InputInmobiliario,
} from './inmobiliario'

// ============================================
// DATOS BASE
// ============================================
const datosBase: InputInmobiliario = {
  valorTransferencia: 80000,
  avaluoCatastral: 60000,
  valorAdquisicion: 50000,
  fechaAdquisicion: '2020-01-15',
  fechaTransferencia: '2026-02-08',
  tipoTransferencia: 'Compraventa',
  tipoTransferente: 'Natural',
}

// ============================================
// ESTRUCTURA DEL RESULTADO
// ============================================
describe('Estructura del resultado', () => {
  it('retorna comprador, vendedor, totalTransaccion y resumen', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    expect(r.comprador).toBeDefined()
    expect(r.vendedor).toBeDefined()
    expect(r.totalTransaccion).toBeGreaterThan(0)
    expect(r.resumen).toBeDefined()
  })

  it('comprador tiene notarial, alcabala, consejoProvincial, registro', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    expect(r.comprador.notarial).toBeDefined()
    expect(r.comprador.alcabala).toBeDefined()
    expect(r.comprador.consejoProvincial).toBeDefined()
    expect(r.comprador.registro).toBeDefined()
    expect(r.comprador.total).toBeGreaterThan(0)
  })

  it('vendedor tiene plusvalia', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    expect(r.vendedor.plusvalia).toBeDefined()
    expect(r.vendedor.total).toBeGreaterThanOrEqual(0)
  })
})

// ============================================
// GASTOS DEL COMPRADOR
// ============================================
describe('Gastos del comprador', () => {
  it('notarial: usa tabla de transferencia de dominio', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    // $80,000 -> rango $60,001 - $90,000 -> tarifa $360
    expect(r.comprador.notarial.subtotal).toBe(360)
    expect(r.comprador.notarial.iva).toBeCloseTo(360 * 0.15, 2)
    expect(r.comprador.notarial.total).toBeCloseTo(360 * 1.15, 2)
  })

  it('alcabala: 1% del mayor valor (sin rebaja >3 años)', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    // Mayor(80000, 60000) = 80000. 1% = 800. >3 años = sin rebaja
    expect(r.comprador.alcabala.baseImponible).toBe(80000)
    expect(r.comprador.alcabala.porcentajeRebaja).toBe(0)
    expect(r.comprador.alcabala.impuesto).toBe(800)
  })

  it('consejo provincial: 10% de alcabala + $1.80', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    // 10% de 800 = 80 + 1.80 = 81.80
    expect(r.comprador.consejoProvincial.valorPorcentaje).toBe(80)
    expect(r.comprador.consejoProvincial.valorFijo).toBe(1.8)
    expect(r.comprador.consejoProvincial.total).toBe(81.8)
  })

  it('registro: arancel según tabla', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    // $80,000 > $40,000 -> Fórmula: $100 + 0.5% del exceso sobre $10,000
    // Exceso = 80000 - 10000 = 70000. 0.5% de 70000 = 350. 100 + 350 = 450
    expect(r.comprador.registro.arancelBase).toBe(450)
    expect(r.comprador.registro.arancelFinal).toBe(450)
  })

  it('total comprador = notarial + alcabala + CP + registro', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    const expected =
      r.comprador.notarial.total +
      r.comprador.alcabala.impuesto +
      r.comprador.consejoProvincial.total +
      r.comprador.registro.arancelFinal
    expect(r.comprador.total).toBeCloseTo(expected, 2)
  })
})

// ============================================
// GASTOS DEL VENDEDOR
// ============================================
describe('Gastos del vendedor', () => {
  it('plusvalía calculada correctamente', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    // Utilidad: max(80k, 60k) - 50k = 30000
    // 6 años -> 30% deducción -> 30000 * 0.30 = 9000
    // Base: 30000 - 9000 = 21000
    // 10% natural = 2100
    expect(r.vendedor.plusvalia.utilidadBruta).toBe(30000)
    expect(r.vendedor.plusvalia.añosTranscurridos).toBe(6)
    expect(r.vendedor.plusvalia.impuesto).toBe(2100)
    expect(r.vendedor.total).toBe(2100)
  })

  it('sin plusvalía cuando no hay ganancia', () => {
    const datos: InputInmobiliario = {
      ...datosBase,
      valorTransferencia: 40000,
      avaluoCatastral: 40000,
    }
    const r = calcularPresupuestoInmobiliario(datos)
    expect(r.vendedor.plusvalia.impuesto).toBe(0)
    expect(r.vendedor.total).toBe(0)
  })

  it('plusvalía con inmobiliaria (4% en vez de 10%)', () => {
    const datos: InputInmobiliario = {
      ...datosBase,
      tipoTransferente: 'Inmobiliaria',
    }
    const r = calcularPresupuestoInmobiliario(datos)
    expect(r.vendedor.plusvalia.tarifaAplicada).toBe(0.04)
    // 21000 * 4% = 840
    expect(r.vendedor.plusvalia.impuesto).toBe(840)
  })
})

// ============================================
// TOTAL TRANSACCIÓN
// ============================================
describe('Total transacción', () => {
  it('totalTransaccion = comprador + vendedor', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    expect(r.totalTransaccion).toBeCloseTo(
      r.comprador.total + r.vendedor.total,
      2
    )
  })

  it('resumen incluye porcentajes sobre valor inmueble', () => {
    const r = calcularPresupuestoInmobiliario(datosBase)
    expect(r.resumen.valorInmueble).toBe(80000)
    expect(r.resumen.porcentajeGastosComprador).toBeGreaterThan(0)
    expect(r.resumen.porcentajeGastosTotal).toBeCloseTo(
      r.resumen.porcentajeGastosComprador + r.resumen.porcentajeGastosVendedor,
      1
    )
  })
})

// ============================================
// CASOS COMPLETOS
// ============================================
describe('Casos completos', () => {
  it('apartamento $120k, comprado hace 2 años por $90k', () => {
    const datos: InputInmobiliario = {
      valorTransferencia: 120000,
      avaluoCatastral: 100000,
      valorAdquisicion: 90000,
      fechaAdquisicion: '2024-01-01',
      fechaTransferencia: '2026-02-08',
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
    }
    const r = calcularPresupuestoInmobiliario(datos)

    // Notarial: $120k -> rango $90,001-$150,000 -> $607.50
    expect(r.comprador.notarial.subtotal).toBe(607.5)

    // Alcabala: 1% de 120k = 1200. ~25 meses -> 3er año -> 20% rebaja -> 960
    expect(r.comprador.alcabala.impuesto).toBe(960)

    // CP: 10% de 960 = 96 + 1.80 = 97.80
    expect(r.comprador.consejoProvincial.total).toBe(97.8)

    // Registro: $120k -> $100 + 0.5% de (120k - 10k) = $100 + $550 = $650 -> cap $500
    expect(r.comprador.registro.arancelFinal).toBe(500)

    // Plusvalía: max(120k, 100k) - 90k = 30000.
    // 2 años -> 10% deducción -> 3000.
    // Base: 27000. 10% = 2700
    expect(r.vendedor.plusvalia.impuesto).toBe(2700)
  })

  it('casa $50k vivienda social, primera compra (< 1 año)', () => {
    const datos: InputInmobiliario = {
      valorTransferencia: 50000,
      avaluoCatastral: 45000,
      valorAdquisicion: 30000,
      fechaAdquisicion: '2025-06-01',
      fechaTransferencia: '2026-02-08',
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
      esViviendaSocial: true,
    }
    const r = calcularPresupuestoInmobiliario(datos)

    // Notarial: $50k -> rango $30,001-$60,000 -> $225. Vivienda social (-25%) -> $168.75
    expect(r.comprador.notarial.subtotal).toBe(168.75)

    // Alcabala: 1% de 50k = 500. < 1 año -> 40% rebaja -> 300
    expect(r.comprador.alcabala.impuesto).toBe(300)

    // CP: 10% de 300 = 30 + 1.80 = 31.80
    expect(r.comprador.consejoProvincial.total).toBe(31.8)

    // Registro: $50k -> $100 + 0.5% de (50k - 10k) = $100 + $200 = $300
    expect(r.comprador.registro.arancelFinal).toBe(300)
  })

  it('terreno $200k, tenencia 10 años, persona natural', () => {
    const datos: InputInmobiliario = {
      valorTransferencia: 200000,
      avaluoCatastral: 180000,
      valorAdquisicion: 120000,
      fechaAdquisicion: '2016-01-01',
      fechaTransferencia: '2026-02-08',
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
    }
    const r = calcularPresupuestoInmobiliario(datos)

    // Notarial: $200k -> rango $150,001-$300,000 -> $900
    expect(r.comprador.notarial.subtotal).toBe(900)

    // Alcabala: 1% de 200k = 2000. > 3 años -> sin rebaja
    expect(r.comprador.alcabala.impuesto).toBe(2000)

    // CP: 10% de 2000 = 200 + 1.80 = 201.80
    expect(r.comprador.consejoProvincial.total).toBe(201.8)

    // Registro: $200k -> $100 + 0.5% de (200k - 10k) = $100 + $950 = $1050 -> cap $500
    expect(r.comprador.registro.arancelFinal).toBe(500)

    // Plusvalía: max(200k, 180k) - 120k = 80000.
    // 10 años -> 50% deducción -> 40000.
    // Base: 40000. 10% = 4000
    expect(r.vendedor.plusvalia.utilidadBruta).toBe(80000)
    expect(r.vendedor.plusvalia.añosTranscurridos).toBe(10)
    expect(r.vendedor.plusvalia.impuesto).toBe(4000)
  })

  it('propiedad $500k donación', () => {
    const datos: InputInmobiliario = {
      valorTransferencia: 500000,
      avaluoCatastral: 450000,
      valorAdquisicion: 300000,
      fechaAdquisicion: '2021-01-01',
      fechaTransferencia: '2026-02-08',
      tipoTransferencia: 'Donación',
      tipoTransferente: 'Natural',
    }
    const r = calcularPresupuestoInmobiliario(datos)

    // Notarial: $500k -> rango $300,001-$600,000 -> $1,800
    expect(r.comprador.notarial.subtotal).toBe(1800)

    // Alcabala: 1% de 500k = 5000. > 3 años -> sin rebaja
    expect(r.comprador.alcabala.impuesto).toBe(5000)

    // Plusvalía con tarifa donación (1%)
    expect(r.vendedor.plusvalia.tarifaAplicada).toBe(0.01)
    // max(500k, 450k) - 300k = 200000. 5 años -> 25% deducción -> 50000.
    // Base: 150000. 1% = 1500
    expect(r.vendedor.plusvalia.impuesto).toBe(1500)
  })

  it('inmueble barato $10k, sin ganancia', () => {
    const datos: InputInmobiliario = {
      valorTransferencia: 10000,
      avaluoCatastral: 10000,
      valorAdquisicion: 12000,
      fechaAdquisicion: '2023-01-01',
      fechaTransferencia: '2026-02-08',
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
    }
    const r = calcularPresupuestoInmobiliario(datos)

    // Notarial: $10k -> rango $0-$10,000 -> $90
    expect(r.comprador.notarial.subtotal).toBe(90)

    // Alcabala: 1% de 10k = 100. > 3 años -> sin rebaja
    expect(r.comprador.alcabala.impuesto).toBe(100)

    // Registro: $10k -> rango 3: $6,600.01-$10,000 -> $35
    expect(r.comprador.registro.arancelFinal).toBe(35)

    // Sin plusvalía (vendió más barato)
    expect(r.vendedor.plusvalia.impuesto).toBe(0)
    expect(r.vendedor.total).toBe(0)
  })
})

// ============================================
// DESCUENTOS
// ============================================
describe('Descuentos', () => {
  it('tercera edad aplica descuento en registro (50%)', () => {
    const datos: InputInmobiliario = {
      ...datosBase,
      esTerceraEdad: true,
    }
    const r = calcularPresupuestoInmobiliario(datos)
    // Registro: $450 base -> 50% descuento -> $225
    expect(r.comprador.registro.arancelFinal).toBe(225)
    expect(r.comprador.registro.descuentos).toBeCloseTo(225, 2)
  })

  it('discapacidad aplica descuento en registro (50%)', () => {
    const datos: InputInmobiliario = {
      ...datosBase,
      esDiscapacitado: true,
    }
    const r = calcularPresupuestoInmobiliario(datos)
    // Registro: $450 base -> 50% descuento -> $225
    expect(r.comprador.registro.arancelFinal).toBe(225)
  })

  it('tercera edad + discapacidad acumula descuentos en registro', () => {
    const datos: InputInmobiliario = {
      ...datosBase,
      esTerceraEdad: true,
      esDiscapacitado: true,
    }
    const r = calcularPresupuestoInmobiliario(datos)
    // Registro: $450 -> 50% tercera edad = $225 -> 50% discapacidad = $112.50
    expect(r.comprador.registro.arancelFinal).toBeCloseTo(112.5, 2)
  })
})

// ============================================
// FUNCIONES AUXILIARES
// ============================================
describe('Funciones auxiliares', () => {
  it('calcularGastosComprador retorna solo comprador', () => {
    const r = calcularGastosComprador(datosBase)
    expect(r.notarial).toBeDefined()
    expect(r.alcabala).toBeDefined()
    expect(r.consejoProvincial).toBeDefined()
    expect(r.registro).toBeDefined()
    expect(r.total).toBeGreaterThan(0)
  })

  it('calcularGastosVendedor retorna solo vendedor', () => {
    const r = calcularGastosVendedor(datosBase)
    expect(r.plusvalia).toBeDefined()
    expect(r.total).toBeGreaterThanOrEqual(0)
  })
})
