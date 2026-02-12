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
 *
 * POST body options:
 *   { raw: true }       → full diagnostic with raw PayPhone response
 *   { multiTest: true } → tries multiple endpoints/auth combos
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

async function tryPayPhoneCall(
  url: string,
  token: string,
  body: Record<string, unknown>
): Promise<{ status: number; bodyRaw: string; isHtml: boolean; ok: boolean }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    const text = await response.text()
    return {
      status: response.status,
      bodyRaw: text.slice(0, 500),
      isHtml: /<html/i.test(text),
      ok: response.ok,
    }
  } catch (err) {
    return {
      status: 0,
      bodyRaw: err instanceof Error ? err.message : 'fetch failed',
      isHtml: false,
      ok: false,
    }
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const totalCents = body.amount ?? 100 // default $1.00 IVA incluido
    const rawMode = body.raw ?? false
    const multiTest = body.multiTest ?? false

    // Descomponer IVA 15%: amount = amountWithTax + tax
    const baseCents = Math.floor(totalCents / 1.15)
    const taxCents = totalCents - baseCents

    const clientTransactionId = generateShortTransactionId()

    const apiUrl = process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com'
    const rawToken = process.env.PAYPHONE_TOKEN ?? ''
    const bearerToken = normalizeAuthToken(rawToken)
    const storeId = process.env.PAYPHONE_STORE_ID ?? ''

    // Multi-test: try several endpoints and auth methods
    if (multiTest) {
      const baseBody = {
        amount: totalCents,
        amountWithTax: baseCents,
        tax: taxCents,
        clientTransactionId,
        storeId,
        responseUrl: `${appUrl}/contratos/pago/callback`,
      }

      const fullBody = {
        ...baseBody,
        amountWithoutTax: 0,
        service: 0,
        tip: 0,
        currency: 'USD',
        reference: 'Test AOE',
        oneTime: true,
        expireIn: 1,
      }

      // Button/Prepare body (the old Web-type format)
      const prepareBody = {
        amount: totalCents,
        amountWithoutTax: 0,
        amountWithTax: baseCents,
        tax: taxCents,
        service: 0,
        tip: 0,
        clientTransactionId,
        storeId,
        currency: 'USD',
        responseUrl: `${appUrl}/contratos/pago/callback`,
        reference: 'Test AOE',
      }

      const results = await Promise.all([
        // Test 1: /Links with Bearer token (current approach)
        tryPayPhoneCall(`${apiUrl}/Links`, bearerToken, fullBody),
        // Test 2: /Links with minimal body
        tryPayPhoneCall(`${apiUrl}/Links`, bearerToken, baseBody),
        // Test 3: /button/Prepare with Bearer token (old Web approach)
        tryPayPhoneCall(`${apiUrl}/button/Prepare`, bearerToken, prepareBody),
        // Test 4: /Sale with Bearer token
        tryPayPhoneCall(`${apiUrl}/Sale`, bearerToken, {
          ...prepareBody,
          phoneNumber: '0999999999',
          countryCode: '593',
        }),
      ])

      return NextResponse.json({
        multiTest: true,
        token: { length: rawToken.length, last5: rawToken.slice(-5) },
        storeId,
        tests: {
          'POST /Links (full body)': results[0],
          'POST /Links (minimal body)': results[1],
          'POST /button/Prepare (old Web)': results[2],
          'POST /Sale (phone-based)': results[3],
        },
      })
    }

    const requestBody = {
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: baseCents,
      tax: taxCents,
      service: 0,
      tip: 0,
      clientTransactionId,
      currency: 'USD',
      responseUrl: `${appUrl}/contratos/pago/callback`,
      reference: 'Test PayPhone - AOE',
      oneTime: true,
      expireIn: 1,
      storeId,
    }

    // Raw mode: call PayPhone directly and return full diagnostic
    if (rawMode) {
      const ppResponse = await fetch(`${apiUrl}/Links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearerToken,
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
      responseUrl: `${appUrl}/contratos/pago/callback`,
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
