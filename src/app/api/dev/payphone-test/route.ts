import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink, generateShortTransactionId } from '@/lib/payphone'

function normalizeAuthToken(rawToken: string): string {
  const token = rawToken.trim()
  if (/^bearer\s+/i.test(token)) return token
  if (/^bearer_/i.test(token)) return `Bearer ${token.slice('Bearer_'.length)}`
  return `Bearer ${token}`
}

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  const devSecret = process.env.DEV_SECRET
  if (!devSecret) return process.env.NODE_ENV !== 'production'
  return secret === devSecret
}

/**
 * Test PayPhone Links endpoint directly
 * Protected by DEV_SECRET query param (works in prod too)
 *
 * GET  /api/dev/payphone-test?secret=xxx  → shows config status
 * POST /api/dev/payphone-test?secret=xxx  → fires a test payment link
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const token = process.env.PAYPHONE_TOKEN
  const storeId = process.env.PAYPHONE_STORE_ID
  const apiUrl = process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'

  return NextResponse.json({
    status: 'ready',
    endpoint: '/Links (API type)',
    config: {
      tokenSet: !!token,
      tokenLength: token?.length ?? 0,
      tokenLast5: token?.slice(-5) ?? 'N/A',
      storeIdSet: !!storeId,
      storeId: storeId ?? 'N/A',
      apiUrl,
      mode: process.env.PAYPHONE_MODE ?? 'NOT SET',
      prefix: process.env.PAYPHONE_REGION_PREFIX ?? 'NOT SET',
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'NOT SET',
    },
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const totalCents = body.amount ?? 100 // default $1.00 IVA incluido
    const rawMode = body.raw ?? false // raw mode: bypass wrapper, show exact PayPhone response

    // Descomponer IVA 15%: amount = amountWithTax + tax
    const baseCents = Math.floor(totalCents / 1.15)
    const taxCents = totalCents - baseCents

    const clientTransactionId = generateShortTransactionId()

    const apiUrl = process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'

    const requestBody = {
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: baseCents,
      tax: taxCents,
      service: 0,
      tip: 0,
      clientTransactionId,
      currency: 'USD',
      reference: 'Test PayPhone - AOE',
      oneTime: true,
      expireIn: 1,
      storeId: process.env.PAYPHONE_STORE_ID,
    }

    // Raw mode: call PayPhone directly and return full diagnostic
    if (rawMode) {
      const rawToken = process.env.PAYPHONE_TOKEN ?? ''
      const token = normalizeAuthToken(rawToken)

      const ppResponse = await fetch(`${apiUrl}/Links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          Accept: 'application/json',
          'User-Agent': 'AOE-v2/1.0',
        },
        body: JSON.stringify(requestBody),
      })

      const responseText = await ppResponse.text()

      return NextResponse.json({
        diagnostic: true,
        payphone: {
          status: ppResponse.status,
          statusText: ppResponse.statusText,
          headers: Object.fromEntries(ppResponse.headers.entries()),
          bodyRaw: responseText.slice(0, 2000),
          isHtml: /<html/i.test(responseText),
        },
        sentRequest: {
          url: `${apiUrl}/Links`,
          method: 'POST',
          authHeader: `Bearer ...${rawToken.slice(-10)}`,
          body: requestBody,
        },
      })
    }

    console.log('[PayPhone Test] Firing Links with:', {
      totalCents,
      baseCents,
      taxCents,
      clientTransactionId,
      apiUrl,
    })

    const result = await createPaymentLink({
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: baseCents,
      tax: taxCents,
      service: 0,
      tip: 0,
      clientTransactionId,
      currency: 'USD',
      reference: 'Test PayPhone - AOE',
      oneTime: true,
      expireIn: 1,
    })

    return NextResponse.json({
      success: true,
      clientTransactionId,
      paymentUrl: result.paymentUrl,
    })
  } catch (error) {
    console.error('[PayPhone Test]', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
