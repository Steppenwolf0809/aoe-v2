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
    ['cuantía sobre el tope', 'tipo=compraventa&cuantia=100000000.01'],
    ['avalúo sobre el tope', 'tipo=compraventa&cuantia=85000&avaluo=100000001'],
    ['cuantía no numérica', 'tipo=compraventa&cuantia=abc'],
    ['fecha mal formada', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=24/09/2020'],
    ['fecha futura', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=2999-01-01'],
    ['fecha inexistente', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=2020-13-45'],
    ['31 de febrero', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=2020-02-31'],
    ['legitimario no booleano', 'tipo=donacion&cuantia=85000&donacion_legitimario=si'],
    ['parámetro desconocido', 'tipo=compraventa&cuantia=85000&utm_source=x'],
    ['descuento no soportado', 'tipo=compraventa&cuantia=85000&adulto_mayor=true'],
    ['donación sin legitimario', 'tipo=donacion&cuantia=85000'],
  ])('%s → 422', async (_, qs) => {
    const res = await get(qs)
    expect(res.status).toBe(422)
    expect((await res.json()).error).toBe('Solicitud inválida')
  })
})

describe('GET /api/cotizar — mensajes y cabeceras', () => {
  it('sin cuantía → mensaje "cuantía requerida"', async () => {
    const body = await (await get('tipo=compraventa')).json()
    expect(body.details.cuantia).toContain('cuantía requerida')
  })

  it('parámetro desconocido → lo nombra en español', async () => {
    const body = await (await get('tipo=compraventa&cuantia=85000&utm_source=x')).json()
    expect(JSON.stringify(body.details)).toContain('utm_source')
  })

  it('donación sin legitimario → error en ese campo', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000')).json()
    expect(body.details.donacion_legitimario).toContain('donacion_legitimario requerido cuando tipo=donacion')
  })

  it('donación a legitimario explícito → alcabala 0', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000&donacion_legitimario=true')).json()
    expect(body.rubros[1].valor).toBe(0)
  })

  it('mensajes genéricos en español (tipo inválido)', async () => {
    const body = await (await get('tipo=arriendo&cuantia=85000')).json()
    expect(JSON.stringify(body.details.tipo)).not.toMatch(/Invalid|expected/i)
  })

  it.each([
    ['200', 'tipo=promesa&cuantia=85000'],
    ['422', 'tipo=promesa'],
  ])('X-Robots-Tag: noindex en respuesta %s', async (_, qs) => {
    const res = await get(qs)
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex')
  })
})

it('cuantía justo en el tope ($100 millones) → 200', async () => {
  const res = await GET(new Request('http://localhost/api/cotizar?tipo=promesa&cuantia=100000000'))
  expect(res.status).toBe(200)
})
