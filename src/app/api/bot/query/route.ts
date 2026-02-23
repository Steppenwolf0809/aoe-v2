import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/bot/rate-limiter'
import { handleBotQuery } from '@/lib/bot/handlers'
import type { QueryType } from '@/lib/bot/handlers'

const VALID_QUERY_TYPES: QueryType[] = [
  'calculate.inmobiliario',
  'calculate.vehicular',
  'calculate.notarial',
  'calculate.alcabala',
  'calculate.registro',
  'calculate.consejo_provincial',
  'search.blog',
  'get.services',
  'get.contact',
  'get.requirements',
  'get.scope',
  'check.contract',
  'check.scope',
]

const querySchema = z.object({
  type: z.enum(VALID_QUERY_TYPES as [QueryType, ...QueryType[]]),
  data: z.record(z.string(), z.unknown()).optional(),
})

function getApiKey(request: Request): string | null {
  const auth = request.headers.get('authorization')
  if (!auth) return null
  const match = auth.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

export async function POST(request: Request) {
  try {
    // 1. Auth
    const apiKey = getApiKey(request)
    const expectedKey = process.env.BOT_API_SECRET

    if (!expectedKey || !apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate limit
    const rateLimit = checkRateLimit(apiKey)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000) },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }

    // 3. Parse & validate
    const body = await request.json()
    const parsed = querySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: parsed.error.flatten().fieldErrors,
          validTypes: VALID_QUERY_TYPES,
        },
        { status: 422 },
      )
    }

    // 4. Handle query
    const result = await handleBotQuery(parsed.data)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    })
  } catch (error) {
    console.error('[Bot API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
