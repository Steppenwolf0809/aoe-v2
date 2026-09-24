import { describe, it, expect } from 'vitest'
import { GET } from './route'

const get = (qs: string) =>
  GET(new Request(`http://localhost/api/cotizar?${qs}`, { headers: { 'x-forwarded-for': '203.0.113.7' } }))

describe('GET /api/cotizar', () => {
  it('compraventa $85.000 → 200 con los cuatro rubros', async () => {
    const res = await get('tipo=compraventa&cuantia=85000')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.rubros.map((r: { valor: number }) => r.valor)).toEqual([443.44, 850, 86.8, 475])
    expect(res.headers.get('X-RateLimit-Remaining')).not.toBeNull()
  })

  it('promesa $85.000 → subtotal $332,58', async () => {
    const body = await (await get('tipo=promesa&cuantia=85000')).json()
    expect(body.subtotal).toBe(332.58)
  })

  it('donacion_legitimario=false → alcabala 850', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000&donacion_legitimario=false')).json()
    expect(body.rubros[1].valor).toBe(850)
  })

  it.each([
    ['sin tipo', 'cuantia=85000'],
    ['tipo inválido', 'tipo=arriendo&cuantia=85000'],
    ['sin cuantía', 'tipo=compraventa'],
    ['cuantía negativa', 'tipo=compraventa&cuantia=-1'],
    ['cuantía no numérica', 'tipo=compraventa&cuantia=abc'],
    ['fecha mal formada', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=24/09/2020'],
    ['fecha futura', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=2999-01-01'],
    ['legitimario no booleano', 'tipo=donacion&cuantia=85000&donacion_legitimario=si'],
  ])('%s → 422', async (_, qs) => {
    const res = await get(qs)
    expect(res.status).toBe(422)
    expect((await res.json()).error).toBe('Invalid request')
  })
})
