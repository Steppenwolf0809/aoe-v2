import { describe, it, expect } from 'vitest'
import {
  calcularTramiteNotarial,
  calcularItemsAdicionales,
  crearItemAdicional,
  SBU_2026,
  IVA_RATE,
  COSTO_FOJA,
} from './notarial'

// ============================================
// TRANSFERENCIA DE DOMINIO (Tabla 1)
// ============================================
describe('Transferencia de Dominio', () => {
  it('rango $0 - $10,000: tarifa 0.20 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 5000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.2, 2)
    expect(r.iva).toBeCloseTo(r.subtotal * IVA_RATE, 2)
    expect(r.total).toBeCloseTo(r.subtotal * 1.15, 2)
  })

  it('rango $10,001 - $30,000: tarifa 0.35 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 25000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.35, 2)
  })

  it('rango $30,001 - $60,000: tarifa 0.50 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 50000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.5, 2)
  })

  it('rango $60,001 - $90,000: tarifa 0.80 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 75000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.8, 2)
  })

  it('rango $60,001 - $90,000: $87,000 coincide con notaria', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 87000)
    expect(r.subtotal).toBe(385.6)
    expect(r.iva).toBe(57.84)
    expect(r.total).toBe(443.44)
  })

  it('rango $90,001 - $150,000: tarifa 1.35 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 120000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 1.35, 2)
  })

  it('rango $150,001 - $300,000: tarifa 2.00 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 200000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 2, 2)
  })

  it('rango $300,001 - $600,000: tarifa 4.00 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 500000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 4, 2)
  })

  it('rango $600,001 - $1,000,000: tarifa 5.00 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 800000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 5, 2)
  })

  it('rango $1,000,001 - $2,000,000: tarifa 10.00 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 1500000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 10, 2)
  })

  it('rango $3,000,001 - $4,000,000: tarifa 20.00 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 3500000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 20, 2)
  })

  it('excedente > $4M: 20 SBU + 0.1% del excedente', () => {
    const monto = 5000000
    const esperado = 20 * SBU_2026 + (monto - 4000000) * 0.001
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', monto)
    expect(r.subtotal).toBeCloseTo(esperado, 2)
  })

  it('vivienda social <= $60k: descuento 25%', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 50000, {
      esViviendaSocial: true,
    })
    const base = SBU_2026 * 0.5
    expect(r.descuento).toBeCloseTo(base * 0.25, 2)
    expect(r.subtotal).toBeCloseTo(base * 0.75, 2)
  })

  it('vivienda social > $60k: sin descuento', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 80000, {
      esViviendaSocial: true,
    })
    expect(r.descuento).toBe(0)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.8, 2)
  })

  it('monto exacto $10,000: tarifa 0.20 SBU (borde superior)', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 10000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.2, 2)
  })

  it('monto $10,000.01: salta a tarifa 0.35 SBU', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 10000.01)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.35, 2)
  })
})

// ============================================
// PROMESAS DE COMPRAVENTA (Tabla 2)
// ============================================
describe('Promesa de Compraventa', () => {
  it('rango $0 - $10,000: tarifa 0.15 SBU', () => {
    const r = calcularTramiteNotarial('PROMESA_COMPRAVENTA', 8000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.15, 2)
  })

  it('rango $30,001 - $60,000: tarifa 0.35 SBU', () => {
    const r = calcularTramiteNotarial('PROMESA_COMPRAVENTA', 45000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.35, 2)
  })

  it('excedente > $4M: 14 SBU + 0.1% del excedente', () => {
    const monto = 5000000
    const esperado = 14 * SBU_2026 + (monto - 4000000) * 0.001
    const r = calcularTramiteNotarial('PROMESA_COMPRAVENTA', monto)
    expect(r.subtotal).toBeCloseTo(esperado, 2)
  })
})

// ============================================
// HIPOTECAS (Tabla 3)
// ============================================
describe('Hipoteca', () => {
  it('rango $0 - $10,000: tarifa 0.13 SBU', () => {
    const r = calcularTramiteNotarial('HIPOTECA', 5000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.13, 2)
  })

  it('rango $90,001 - $150,000: tarifa 0.72 SBU', () => {
    const r = calcularTramiteNotarial('HIPOTECA', 130000)
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.72, 2)
  })

  it('excedente > $4M: 9 SBU + 0.1% del excedente', () => {
    const monto = 6000000
    const esperado = 9 * SBU_2026 + (monto - 4000000) * 0.001
    const r = calcularTramiteNotarial('HIPOTECA', monto)
    expect(r.subtotal).toBeCloseTo(esperado, 2)
  })
})

// ============================================
// TRAMITES CON TARIFA FIJA (% SBU)
// ============================================
describe('Tramites con tarifa fija', () => {
  it('divorcio: 39% SBU', () => {
    const r = calcularTramiteNotarial('DIVORCIO')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.39, 2)
  })

  it('union de hecho: 10% SBU', () => {
    const r = calcularTramiteNotarial('UNION_HECHO')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.1, 2)
  })

  it('terminacion union de hecho: 39% SBU', () => {
    const r = calcularTramiteNotarial('TERMINACION_UNION_HECHO')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.39, 2)
  })

  it('testamento abierto: 120% SBU', () => {
    const r = calcularTramiteNotarial('TESTAMENTO_ABIERTO')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 1.2, 2)
  })

  it('testamento cerrado: 100% SBU', () => {
    const r = calcularTramiteNotarial('TESTAMENTO_CERRADO')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 1.0, 2)
  })

  it('posesion efectiva: 40% SBU', () => {
    const r = calcularTramiteNotarial('POSESION_EFECTIVA')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.4, 2)
  })

  it('cancelacion hipoteca: 20% SBU', () => {
    const r = calcularTramiteNotarial('CANCELACION_HIPOTECA')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.2, 2)
  })

  it('declaracion juramentada: 5% SBU', () => {
    const r = calcularTramiteNotarial('DECLARACION_JURAMENTADA')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.05, 2)
  })
})

// ============================================
// TRAMITES CON CANTIDAD VARIABLE
// ============================================
describe('Tramites con cantidad variable', () => {
  it('salida del pais: 5% SBU por menor', () => {
    const r = calcularTramiteNotarial('SALIDA_PAIS', 0, { cantidadMenores: 2 })
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.05 * 2, 2)
  })

  it('reconocimiento de firma: 3% SBU por firma', () => {
    const r = calcularTramiteNotarial('RECONOCIMIENTO_FIRMA', 0, { numeroFirmas: 4 })
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.03 * 4, 2)
  })

  it('poder persona natural: 12% SBU base + 3% por adicional', () => {
    const r = calcularTramiteNotarial('PODER_GENERAL_PN', 0, { numeroOtorgantes: 3 })
    const esperado = SBU_2026 * 0.12 + 2 * (SBU_2026 * 0.03)
    expect(r.subtotal).toBeCloseTo(esperado, 2)
  })

  it('poder persona juridica: 50% SBU', () => {
    const r = calcularTramiteNotarial('PODER_GENERAL_PJ')
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.5, 2)
  })
})

// ============================================
// DESCUENTO TERCERA EDAD
// ============================================
describe('Descuento tercera edad', () => {
  it('aplica 50% en actos unilaterales (testamento)', () => {
    const r = calcularTramiteNotarial('TESTAMENTO_ABIERTO', 0, {
      esTerceraEdad: true,
    })
    const base = SBU_2026 * 1.2
    expect(r.descuento).toBeCloseTo(base * 0.5, 2)
    expect(r.subtotal).toBeCloseTo(base * 0.5, 2)
  })

  it('NO aplica en actos bilaterales (divorcio)', () => {
    const r = calcularTramiteNotarial('DIVORCIO', 0, {
      esTerceraEdad: true,
    })
    expect(r.descuento).toBe(0)
  })
})

// ============================================
// IVA
// ============================================
describe('Calculo de IVA', () => {
  it('aplica 15% IVA al subtotal', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 50000)
    const base = SBU_2026 * 0.5
    expect(r.iva).toBeCloseTo(base * 0.15, 2)
    expect(r.total).toBeCloseTo(base * 1.15, 2)
  })

  it('granTotal incluye IVA + items adicionales', () => {
    const items = [crearItemAdicional('copia_certificada', 'Copias', 10)]
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 50000, {
      itemsAdicionales: items,
    })
    const itemsTotal = COSTO_FOJA * 10
    expect(r.granTotal).toBeCloseTo(SBU_2026 * 0.5 * 1.15 + itemsTotal, 2)
  })
})

// ============================================
// ITEMS ADICIONALES
// ============================================
describe('Items adicionales', () => {
  it('copias certificadas: $1.79 por foja', () => {
    const items = [crearItemAdicional('copia_certificada', 'Copias escritura', 5)]
    const result = calcularItemsAdicionales(items)
    expect(result.total).toBeCloseTo(COSTO_FOJA * 5, 2)
  })

  it('poder con multiples otorgantes: 12% + 3% adicionales', () => {
    const items = [crearItemAdicional('poder', 'Poder general', 3)]
    const result = calcularItemsAdicionales(items)
    const esperado = SBU_2026 * 0.12 + 2 * (SBU_2026 * 0.03)
    expect(result.total).toBeCloseTo(esperado, 2)
  })

  it('reconocimiento firma: 3% SBU por firma', () => {
    const items = [crearItemAdicional('reconocimiento_firma', 'Firmas', 2)]
    const result = calcularItemsAdicionales(items)
    expect(result.total).toBeCloseTo(SBU_2026 * 0.03 * 2, 2)
  })
})

// ============================================
// ARRENDAMIENTOS
// ============================================
describe('Arrendamientos', () => {
  it('escritura: usa Tabla 1 con cuantia total (canon x meses)', () => {
    // Canon $1000 x 12 meses = $12,000 -> rango $10,001-$30,000 -> 0.35 SBU
    const r = calcularTramiteNotarial('CONTRATO_ARRIENDO_ESCRITURA', 1000, {
      tiempoMeses: 12,
    })
    expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.35, 2)
  })

  describe('Inscripcion de Arrendamiento (Tabla 5)', () => {
    it('canon <= $375: 10% del canon (regla porcentual)', () => {
      // Canon $300 -> 10% = $30
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 300)
      expect(r.subtotal).toBeCloseTo(30, 2)
      expect(r.detalles.some(d => d.includes('10%'))).toBe(true)
    })

    it('canon $375 (limite): 10% del canon = $37.50', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 375)
      expect(r.subtotal).toBeCloseTo(37.5, 2)
    })

    it('canon $375.01: usa rangos SBU -> rango $375.01-$1500 -> 0.10 SBU', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 376)
      expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.10, 2)
    })

    it('canon $1000: rango $375.01-$1500 -> 0.10 SBU', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 1000)
      expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.10, 2)
    })

    it('canon $2500: rango $1,500.01-$5,000 -> 0.15 SBU', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 2500)
      expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.15, 2)
    })

    it('canon $8000: rango $5,000.01-$10,000 -> 0.20 SBU', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 8000)
      expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.20, 2)
    })

    it('canon $15000: rango >$10,000 -> 0.30 SBU', () => {
      const r = calcularTramiteNotarial('INSCRIPCION_ARRENDAMIENTO', 15000)
      expect(r.subtotal).toBeCloseTo(SBU_2026 * 0.30, 2)
    })
  })
})
