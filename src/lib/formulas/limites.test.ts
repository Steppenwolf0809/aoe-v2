import { describe, it, expect } from 'vitest'
import tariffCatalog from '@/lib/tariffs/notarial-ecuador-2026.json'
import { calcularTramiteNotarial, SBU_2026, type TipoTramite } from './notarial'
import { calcularArancelRegistro } from './registro'
import { calcularAlcabalaYConsejoProvincial, calcularConsejoProvincial } from './consejo-provincial'

type Regla = { min: number; max: number | null; tarifa_sbu?: number; tipo: string }
const reglas = (id: string) =>
  (tariffCatalog.tablas.find((t) => t.id === id)!.reglas as unknown as Regla[]).filter(
    (r) => r.tipo === 'rango_simple'
  )

const TABLAS: Array<[string, TipoTramite]> = [
  ['tabla_01', 'TRANSFERENCIA_DOMINIO'],
  ['tabla_02', 'PROMESA_COMPRAVENTA'],
  ['tabla_03', 'HIPOTECA'],
]

describe('Notaría: casos verificados a mano', () => {
  it('compraventa $85.000 → $385,60 + $57,84 = $443,44 (Art. 26, Tabla 1)', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 85000)
    expect(r.subtotal).toBe(385.6)
    expect(r.iva).toBe(57.84)
    expect(r.total).toBe(443.44)
    expect(r.detalles[0]).toContain('Art. 26 - Tabla 1')
  })

  it('promesa $85.000 → $289,20 + $43,38 = $332,58 (Art. 27, Tabla 2)', () => {
    const r = calcularTramiteNotarial('PROMESA_COMPRAVENTA', 85000)
    expect(r.subtotal).toBe(289.2)
    expect(r.iva).toBe(43.38)
    expect(r.total).toBe(332.58)
    expect(r.detalles[0]).toContain('Art. 27 - Tabla 2')
  })
})

describe.each(TABLAS)('Notaría %s: límites de cada rango', (tablaId, tramite) => {
  const rs = reglas(tablaId)
  rs.forEach((regla, i) => {
    if (regla.max === null) return
    const siguiente = rs[i + 1]
    const esperadoEnMax = Math.round(regla.tarifa_sbu! * SBU_2026 * 100) / 100

    it(`$${regla.max} cae en su rango`, () => {
      expect(calcularTramiteNotarial(tramite, regla.max!).subtotal).toBeCloseTo(esperadoEnMax, 2)
    })

    if (!siguiente) return
    const esperadoSiguiente = Math.round(siguiente.tarifa_sbu! * SBU_2026 * 100) / 100

    it(`$${siguiente.min} cae en el rango siguiente`, () => {
      expect(calcularTramiteNotarial(tramite, siguiente.min).subtotal).toBeCloseTo(esperadoSiguiente, 2)
    })

    it(`$${regla.max + 0.005} (entre X y X,01) no da $0: usa el rango siguiente`, () => {
      expect(calcularTramiteNotarial(tramite, regla.max! + 0.005).subtotal).toBeCloseTo(esperadoSiguiente, 2)
    })
  })
})

describe('Registro: casos y límites', () => {
  it.each([
    [3000, 22],
    [3000.005, 30], // hueco X–X,01
    [3000.01, 30],
    [40000, 200],
    [40000.01, 250], // salto reportado, no corregido: $100 + 0,5 % × (valor − 10.000)
    [85000, 475],
    [90000, 500],
    [90000.01, 500], // tope
    [250000, 500],
  ])('$%s → $%s', (valor, esperado) => {
    expect(calcularArancelRegistro(valor).arancelFinal).toBe(esperado)
  })

  it('$90.000 llega justo al tope sin excederlo; $90.000,01 lo excede', () => {
    expect(calcularArancelRegistro(90000).excedeMaximo).toBe(false)
    expect(calcularArancelRegistro(90000.01).excedeMaximo).toBe(true)
  })
})

describe('Alcabala y Consejo Provincial: casos a mano', () => {
  it('alcabala $85.000 sin rebaja → $850,00', () => {
    expect(calcularAlcabalaYConsejoProvincial(85000).impuestoAlcabala).toBe(850)
  })

  it('consejo provincial sobre $850 → $86,80', () => {
    expect(calcularConsejoProvincial(850).total).toBe(86.8)
  })

  it('avalúo mayor que cuantía: alcabala sobre el avalúo', () => {
    expect(calcularAlcabalaYConsejoProvincial(80000, 85000).impuestoAlcabala).toBe(850)
  })
})
