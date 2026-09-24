import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/bot/rate-limiter'
import { cotizar } from '@/lib/formulas/cotizar'

// Sin datos personales ni logs de parámetros (LOPDP). Solo costos de terceros.

// Tope de cuantía y avalúo: evita montos absurdos (1e300)
const MONTO_MAXIMO = 100_000_000

const querySchema = z.object({
  tipo: z.enum(['compraventa', 'promesa', 'hipoteca', 'donacion']),
  cuantia: z.coerce.number().positive().max(MONTO_MAXIMO),
  avaluo: z.coerce.number().positive().max(MONTO_MAXIMO).optional(),
  fecha_adquisicion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((f) => {
      const d = new Date(`${f}T00:00:00Z`)
      return !isNaN(d.getTime()) && d.toISOString().startsWith(f)
    }, 'Fecha inexistente')
    .refine((f) => f <= new Date().toISOString().slice(0, 10), 'No puede ser futura')
    .optional(),
  donacion_legitimario: z.enum(['true', 'false']).optional(),
})

function getClientKey(request: Request): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return `cotizar:${ip || 'anon'}`
}

export async function GET(request: Request) {
  try {
    // 1. Rate limit (en memoria, por instancia)
    const rateLimit = checkRateLimit(getClientKey(request))
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Too many requests', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter), 'X-RateLimit-Remaining': '0' } },
      )
    }

    // 2. Parse & validate
    const params = Object.fromEntries(new URL(request.url).searchParams)
    const parsed = querySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    // 3. Cotizar
    const q = parsed.data
    const resultado = cotizar({
      tipo: q.tipo,
      cuantia: q.cuantia,
      avaluo: q.avaluo,
      fechaAdquisicion: q.fecha_adquisicion,
      donacionLegitimario: q.donacion_legitimario !== 'false',
    })

    return NextResponse.json(resultado, {
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    })
  } catch {
    console.error('[cotizar] Error interno')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
