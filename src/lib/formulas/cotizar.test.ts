import { describe, it, expect } from 'vitest'
import { cotizar } from './cotizar'

const HOY = new Date('2026-09-24T12:00:00Z')
const rubro = (r: ReturnType<typeof cotizar>, id: string) => r.rubros.find((x) => x.id === id)

describe('cotizar: compraventa', () => {
  const r = cotizar({ tipo: 'compraventa', cuantia: 85000 }, HOY)

  it('cuatro rubros con los montos a mano', () => {
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria', 'alcabala', 'consejo_provincial', 'registro'])
    expect(rubro(r, 'notaria')!.valor).toBe(443.44)
    expect(rubro(r, 'alcabala')!.valor).toBe(850)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(86.8)
    expect(rubro(r, 'registro')!.valor).toBe(475)
    expect(r.subtotal).toBe(1855.24)
  })

  it('cada rubro trae base legal, fórmula y supuestos', () => {
    for (const x of r.rubros) {
      expect(x.base_legal.length).toBeGreaterThan(0)
      expect(x.formula.length).toBeGreaterThan(0)
      expect(Array.isArray(x.supuestos)).toBe(true)
    }
    expect(rubro(r, 'notaria')!.base_legal).toContain('Art. 26 - Tabla 1')
  })

  it('sin fecha de adquisición: sin rebaja y lo dice', () => {
    expect(rubro(r, 'alcabala')!.supuestos.join(' ')).toMatch(/sin rebaja/i)
  })

  it('con fecha de adquisición a 10 meses: rebaja 40 %', () => {
    const c = cotizar({ tipo: 'compraventa', cuantia: 85000, fechaAdquisicion: '2025-11-24' }, HOY)
    expect(rubro(c, 'alcabala')!.valor).toBe(510)
    expect(rubro(c, 'consejo_provincial')!.valor).toBe(52.8)
  })

  it('avalúo mayor que cuantía: todo sobre el avalúo', () => {
    const c = cotizar({ tipo: 'compraventa', cuantia: 80000, avaluo: 85000 }, HOY)
    expect(c.base_imponible).toBe(85000)
    expect(rubro(c, 'registro')!.valor).toBe(475)
    expect(rubro(c, 'alcabala')!.valor).toBe(850)
  })
})

describe('cotizar: promesa', () => {
  it('solo notaría Tabla 2: $332,58', () => {
    const r = cotizar({ tipo: 'promesa', cuantia: 85000 }, HOY)
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria'])
    expect(r.subtotal).toBe(332.58)
  })
})

describe('cotizar: hipoteca', () => {
  const r = cotizar({ tipo: 'hipoteca', cuantia: 85000, avaluo: 120000 }, HOY)

  it('registro por cuantía (monto del préstamo), incluido en el subtotal', () => {
    expect(rubro(r, 'notaria')!.valor).toBe(299.32)
    expect(rubro(r, 'registro')!.valor).toBe(475)
    expect(r.subtotal).toBe(774.32)
  })

  it('base = monto del préstamo, ignora el avalúo', () => {
    expect(r.base_imponible).toBe(85000)
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria', 'registro'])
  })
})

describe('cotizar: donación', () => {
  it('a legitimario (default): alcabala 0 y consejo provincial solo $1,80', () => {
    const r = cotizar({ tipo: 'donacion', cuantia: 85000 }, HOY)
    expect(rubro(r, 'notaria')!.valor).toBe(443.44)
    expect(rubro(r, 'alcabala')!.valor).toBe(0)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(1.8)
    expect(rubro(r, 'registro')!.valor).toBe(475)
  })

  it('a no legitimario: alcabala 1 % igual que compraventa', () => {
    const r = cotizar({ tipo: 'donacion', cuantia: 85000, donacionLegitimario: false }, HOY)
    expect(rubro(r, 'alcabala')!.valor).toBe(850)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(86.8)
  })
})

it('aviso: sin honorarios ni plusvalía', () => {
  const r = cotizar({ tipo: 'promesa', cuantia: 85000 }, HOY)
  expect(r.aviso).toMatch(/honorarios/)
  expect(r.aviso).toMatch(/plusvalía/)
})
