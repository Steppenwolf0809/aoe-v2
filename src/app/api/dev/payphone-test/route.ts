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

    // Multi-test: try multiple AUTH methods on /Links
    if (multiTest) {
      const clientId = process.env.PAYPHONE_CLIENT_ID ?? ''
      const clientSecret = process.env.PAYPHONE_CLIENT_SECRET ?? ''

      const linksBody = {
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
        oneTime: true,
        expireIn: 30,
      }

      const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' }

      // Build Basic auth
      const basicAuth = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

      // Step 1: Try OAuth2 token endpoints
      const tokenEndpoints = [
        { url: `${apiUrl}/token`, label: '/api/token' },
        { url: 'https://pay.payphonetodoesposible.com/token', label: '/token (root)' },
        { url: `${apiUrl}/Auth/token`, label: '/api/Auth/token' },
      ]

      const oauthForm = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      })

      const oauthResults = await Promise.all(
        tokenEndpoints.map(async ({ url, label }) => {
          const r = await tryPayPhoneCall(url, '', {})
            .catch(() => ({ status: 0, bodyRaw: 'error', isHtml: false, ok: false }))
          // Actually try form-encoded POST
          try {
            const resp = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
              body: oauthForm.toString(),
            })
            const text = await resp.text()
            return { label, status: resp.status, body: text.slice(0, 400), ok: resp.ok }
          } catch (err) {
            return { label, status: 0, body: err instanceof Error ? err.message : 'failed', ok: false }
          }
        })
      )

      // Step 2: Try /Links with different auth methods
      const authTests = await Promise.all([
        // Bearer store-token (current)
        tryPayPhoneCall(`${apiUrl}/Links`, bearerToken, linksBody),
        // Basic auth (clientId:clientSecret)
        tryPayPhoneCall(`${apiUrl}/Links`, basicAuth, linksBody),
        // Bearer with clientSecret directly
        tryPayPhoneCall(`${apiUrl}/Links`, `Bearer ${clientSecret}`, linksBody),
        // No auth header at all
        (async () => {
          try {
            const resp = await fetch(`${apiUrl}/Links`, {
              method: 'POST',
              headers: jsonHeaders,
              body: JSON.stringify(linksBody),
            })
            const text = await resp.text()
            return { status: resp.status, bodyRaw: text.slice(0, 400), isHtml: /<html/i.test(text), ok: resp.ok }
          } catch (err) {
            return { status: 0, bodyRaw: err instanceof Error ? err.message : 'failed', isHtml: false, ok: false }
          }
        })(),
      ])

      return NextResponse.json({
        multiTest: true,
        credentials: {
          bearerToken: { length: rawToken.length, last5: rawToken.slice(-5) },
          storeId,
          clientId: clientId || 'NOT SET',
          clientSecretSet: !!clientSecret,
        },
        oauthTokenEndpoints: Object.fromEntries(oauthResults.map(r => [r.label, { status: r.status, body: r.body, ok: r.ok }])),
        linksWithDifferentAuth: {
          'Bearer store-token': { status: authTests[0].status, ok: authTests[0].ok, isHtml: authTests[0].isHtml },
          'Basic clientId:secret': { status: authTests[1].status, ok: authTests[1].ok, body: authTests[1].bodyRaw },
          'Bearer clientSecret': { status: authTests[2].status, ok: authTests[2].ok, body: authTests[2].bodyRaw },
          'No auth': { status: authTests[3].status, ok: authTests[3].ok, body: authTests[3].bodyRaw },
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
