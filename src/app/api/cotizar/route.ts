import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/bot/rate-limiter'
import { cotizar } from '@/lib/formulas/cotizar'

// Sin datos personales ni logs de parámetros (LOPDP). Solo costos de terceros.

// Tope de cuantía y avalúo: evita montos absurdos (1e300)
const MONTO_MAXIMO = 100_000_000

const querySchema = z
  .object({
    tipo: z.enum(['compraventa', 'promesa', 'hipoteca', 'donacion']),
    // z.coerce.number() convierte el valor ausente a NaN antes de generar el issue, por lo que
    // pierde si el parámetro faltaba o traía texto inválido. Se valida primero como string
    // (donde iss.input sí distingue "undefined") y luego se convierte a número.
    cuantia: z
      .string({ error: (iss) => (iss.input === undefined ? 'cuantía requerida' : 'cuantía debe ser un número') })
      .transform((val, ctx) => {
        const n = Number(val)
        if (Number.isNaN(n)) {
          ctx.addIssue({ code: 'custom', message: 'cuantía debe ser un número' })
          return z.NEVER
        }
        return n
      })
      .pipe(
        z
          .number()
          .positive({ error: 'cuantía debe ser mayor que 0' })
          .max(MONTO_MAXIMO, { error: 'cuantía no puede superar 100.000.000' }),
      ),
    avaluo: z.coerce
      .number({ error: 'avalúo debe ser un número' })
      .positive({ error: 'avalúo debe ser mayor que 0' })
      .max(MONTO_MAXIMO, { error: 'avalúo no puede superar 100.000.000' })
      .optional(),
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
  .strict()
  .refine((q) => q.tipo !== 'donacion' || q.donacion_legitimario !== undefined, {
    error: 'donacion_legitimario requerido cuando tipo=donacion',
    path: ['donacion_legitimario'],
  })

// Permitido rastrear (robots.txt) pero no indexar la respuesta
const SIN_INDEXAR = { 'X-Robots-Tag': 'noindex' }

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
        { error: 'Demasiadas solicitudes', retryAfter },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter), 'X-RateLimit-Remaining': '0', ...SIN_INDEXAR },
        },
      )
    }

    // 2. Parse & validate
    const params = Object.fromEntries(new URL(request.url).searchParams)
    const parsed = querySchema.safeParse(params, { error: z.locales.es().localeError })
    if (!parsed.success) {
      const { formErrors, fieldErrors } = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Solicitud inválida', details: { ...fieldErrors, ...(formErrors.length ? { general: formErrors } : {}) } },
        { status: 422, headers: SIN_INDEXAR },
      )
    }

    // 3. Cotizar
    const q = parsed.data
    const resultado = cotizar({
      tipo: q.tipo,
      cuantia: q.cuantia,
      avaluo: q.avaluo,
      fechaAdquisicion: q.fecha_adquisicion,
      donacionLegitimario: q.donacion_legitimario === 'true',
    })

    return NextResponse.json(resultado, {
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining), ...SIN_INDEXAR },
    })
  } catch {
    console.error('[cotizar] Error interno')
    return NextResponse.json({ error: 'Error interno' }, { status: 500, headers: SIN_INDEXAR })
  }
}
