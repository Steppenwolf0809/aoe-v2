import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink, generateShortTransactionId } from '@/lib/payphone'

// PayPhone WAF blocks Vercel US IPs → run from São Paulo
export const preferredRegion = 'gru1'

function getPayPhoneBaseUrlForTest(): { baseUrl: string; usingProxy: boolean } {
  const proxyUrl = process.env.PAYPHONE_PROXY_URL?.trim()
  const upstreamUrl =
    (process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api').trim()
  const baseUrl = (proxyUrl || upstreamUrl).replace(/\/+$/, '')
  return { baseUrl, usingProxy: !!proxyUrl }
}

function resolveLinksUrlForTest(baseUrl: string): string {
  return (process.env.PAYPHONE_LINKS_URL?.trim() || `${baseUrl}/Links`).trim()
}

function getProxyHeadersForTest(): Record<string, string> {
  const proxyUrl = process.env.PAYPHONE_PROXY_URL?.trim()
  if (!proxyUrl) return {}

  const secret = process.env.PAYPHONE_PROXY_SECRET
  if (!secret) {
    throw new Error(
      'PAYPHONE_PROXY_URL is set but PAYPHONE_PROXY_SECRET is missing (Vercel). Set PAYPHONE_PROXY_SECRET to match the Worker secret.'
    )
  }

  return { 'X-Proxy-Secret': secret }
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
 * GET  /api/dev/payphone-test?secret=xxx  → shows config + token health
 * POST /api/dev/payphone-test?secret=xxx  → fires a test payment link
 *
 * POST body options:
 *   { raw: true }       → full diagnostic with raw PayPhone response
 *   { multiTest: true } → comprehensive auth & body diagnostics
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const rawToken = process.env.PAYPHONE_TOKEN ?? ''
  const storeId = process.env.PAYPHONE_STORE_ID ?? ''
  const upstreamApiUrl =
    process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'
  const proxyUrl = process.env.PAYPHONE_PROXY_URL ?? ''
  const { baseUrl, usingProxy } = getPayPhoneBaseUrlForTest()
  const linksUrl = resolveLinksUrlForTest(baseUrl)

  // Token health analysis
  const tokenIssues: string[] = []
  if (!rawToken) tokenIssues.push('TOKEN EMPTY')
  if (rawToken.includes('\n') || rawToken.includes('\r')) tokenIssues.push('CONTAINS NEWLINE')
  if (rawToken.includes(' ') && !rawToken.startsWith('Bearer')) tokenIssues.push('CONTAINS SPACES (not Bearer prefix)')
  if (/[^\x20-\x7E]/.test(rawToken)) tokenIssues.push('CONTAINS NON-ASCII CHARS')
  if (rawToken.startsWith('"') || rawToken.endsWith('"')) tokenIssues.push('WRAPPED IN QUOTES')
  if (rawToken.startsWith("'") || rawToken.endsWith("'")) tokenIssues.push('WRAPPED IN SINGLE QUOTES')

  return NextResponse.json({
    status: 'ready',
    config: {
      tokenSet: !!rawToken,
      tokenLength: rawToken.length,
      tokenFirst10: rawToken.slice(0, 10),
      tokenLast5: rawToken.slice(-5),
      tokenStartsWithBearer: /^bearer/i.test(rawToken),
      tokenIssues: tokenIssues.length ? tokenIssues : 'NONE',
      storeIdSet: !!storeId,
      storeId: storeId || 'N/A',
      apiUrlUpstream: upstreamApiUrl,
      proxyUrl: proxyUrl || 'NOT SET',
      baseUrlInUse: baseUrl,
      usingProxy,
      linksUrlInUse: linksUrl,
      saleUrlOverride: process.env.PAYPHONE_SALE_URL ?? 'NOT SET',
      confirmUrlOverride: process.env.PAYPHONE_CONFIRM_URL ?? 'NOT SET',
      mode: process.env.PAYPHONE_MODE ?? 'NOT SET',
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'NOT SET',
      clientIdSet: !!process.env.PAYPHONE_CLIENT_ID,
      clientSecretSet: !!process.env.PAYPHONE_CLIENT_SECRET,
      proxySecretSet: !!process.env.PAYPHONE_PROXY_SECRET,
    },
  })
}

// Helper: make a raw fetch and return diagnostic
async function rawFetch(
  url: string,
  options: RequestInit
): Promise<{
  status: number
  body: string
  isHtml: boolean
  ok: boolean
  location?: string | null
  proxyUpstreamUrl?: string | null
  error?: string
}> {
  try {
    // Avoid following redirects: PayPhone sometimes responds with Location: /Errors/500.html
    // and the follow-up request would hit the Worker root and look like a proxy 404.
    const response = await fetch(url, { ...options, redirect: options.redirect ?? 'manual' })
    const text = await response.text()
    return {
      status: response.status,
      body: text.slice(0, 600),
      isHtml: /<html/i.test(text),
      ok: response.ok,
      location: response.headers.get('location'),
      proxyUpstreamUrl: response.headers.get('x-proxy-upstream-url'),
    }
  } catch (err) {
    return {
      status: 0,
      body: '',
      isHtml: false,
      ok: false,
      error: err instanceof Error ? err.message : 'fetch failed',
    }
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const totalCents = body.amount ?? 315 // default $3.15 (from docs example)
    const rawMode = body.raw ?? false
    const multiTest = body.multiTest ?? false

    const clientTransactionId = generateShortTransactionId()

    const { baseUrl, usingProxy } = getPayPhoneBaseUrlForTest()
    const rawToken = process.env.PAYPHONE_TOKEN ?? ''
    const storeId = process.env.PAYPHONE_STORE_ID ?? ''

    // Build Bearer token (handle if raw token already includes "Bearer " prefix)
    const cleanToken = rawToken.trim()
    const bearerToken = /^bearer\s+/i.test(cleanToken) ? cleanToken : `Bearer ${cleanToken}`
    const proxyHeaders = getProxyHeadersForTest()

    // ========================================
    // MULTI TEST — comprehensive diagnostics
    // ========================================
    if (multiTest) {
      const linksUrl = resolveLinksUrlForTest(baseUrl)

      // Body matching EXACT PayPhone docs example (no responseUrl!)
      const docsExampleBody = {
        amount: 315,
        amountWithoutTax: 200,
        amountWithTax: 100,
        tax: 15,
        currency: 'USD',
        reference: 'Payment via API Link',
        clientTransactionId,
        storeId,
      }

      // Our real body (also no responseUrl!)
      const realBody = {
        amount: totalCents,
        amountWithoutTax: 0,
        amountWithTax: Math.floor(totalCents / 1.15),
        tax: totalCents - Math.floor(totalCents / 1.15),
        service: 0,
        tip: 0,
        clientTransactionId: `AOE${Date.now().toString(36).toUpperCase().slice(0, 4)}`,
        currency: 'USD',
        storeId,
        reference: 'Test AOE v2',
        oneTime: true,
        expireIn: 1,
      }

      const jsonHeaders = { 'Content-Type': 'application/json', ...proxyHeaders }

      // Run ALL tests in parallel
      const [
        noAuthResult,
        bearerTokenResult,
        docsExampleResult,
        getHealthResult,
        bearerLowercaseResult,
      ] = await Promise.all([
        // 1. NO AUTH — if 500, server is broken. If 401/403, server works but needs auth
        rawFetch(linksUrl, {
          method: 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(docsExampleBody),
        }),

        // 2. Bearer token with our real body (current approach)
        rawFetch(linksUrl, {
          method: 'POST',
          headers: { ...jsonHeaders, Authorization: bearerToken },
          body: JSON.stringify(realBody),
        }),

        // 3. Bearer token with EXACT docs example body
        rawFetch(linksUrl, {
          method: 'POST',
          headers: { ...jsonHeaders, Authorization: bearerToken },
          body: JSON.stringify(docsExampleBody),
        }),

        // 4. GET request to API root (health check)
        rawFetch(`${baseUrl}`, { method: 'GET', headers: proxyHeaders }),

        // 5. Lowercase "bearer" (docs show lowercase)
        rawFetch(linksUrl, {
          method: 'POST',
          headers: { ...jsonHeaders, Authorization: bearerToken.replace(/^Bearer/i, 'bearer') },
          body: JSON.stringify(docsExampleBody),
        }),
      ])

      return NextResponse.json({
        multiTest: true,
        version: 3,
        baseUrlInUse: baseUrl,
        usingProxy,
        linksUrlInUse: linksUrl,
        tokenInfo: {
          length: rawToken.length,
          first10: rawToken.slice(0, 10),
          last5: rawToken.slice(-5),
          startsWithBearer: /^bearer/i.test(rawToken),
          hasNewlines: /[\n\r]/.test(rawToken),
          hasNonAscii: /[^\x20-\x7E]/.test(rawToken),
        },
        storeId,
        tests: {
          '1_NO_AUTH (server alive?)': {
            status: noAuthResult.status,
            ok: noAuthResult.ok,
            isHtml: noAuthResult.isHtml,
            location: noAuthResult.location,
            proxyUpstreamUrl: noAuthResult.proxyUpstreamUrl,
            verdict: noAuthResult.status === 401 ? 'SERVER OK - needs auth' :
                     noAuthResult.status === 500 ? 'SERVER ERROR (not auth issue!)' :
                     noAuthResult.ok ? 'UNEXPECTED SUCCESS' : `status ${noAuthResult.status}`,
            body: noAuthResult.body?.slice(0, 200),
          },
          '2_BEARER_REAL_BODY': {
            status: bearerTokenResult.status,
            ok: bearerTokenResult.ok,
            isHtml: bearerTokenResult.isHtml,
            location: bearerTokenResult.location,
            proxyUpstreamUrl: bearerTokenResult.proxyUpstreamUrl,
          },
          '3_BEARER_DOCS_EXAMPLE': {
            status: docsExampleResult.status,
            ok: docsExampleResult.ok,
            isHtml: docsExampleResult.isHtml,
            location: docsExampleResult.location,
            proxyUpstreamUrl: docsExampleResult.proxyUpstreamUrl,
            body: docsExampleResult.body?.slice(0, 300),
          },
          '4_GET_API_ROOT (health)': {
            status: getHealthResult.status,
            ok: getHealthResult.ok,
            isHtml: getHealthResult.isHtml,
            location: getHealthResult.location,
            proxyUpstreamUrl: getHealthResult.proxyUpstreamUrl,
            body: getHealthResult.body?.slice(0, 200),
          },
          '5_LOWERCASE_BEARER': {
            status: bearerLowercaseResult.status,
            ok: bearerLowercaseResult.ok,
            isHtml: bearerLowercaseResult.isHtml,
            location: bearerLowercaseResult.location,
            proxyUpstreamUrl: bearerLowercaseResult.proxyUpstreamUrl,
            body: bearerLowercaseResult.body?.slice(0, 200),
          },
        },
        sentBodies: {
          docsExample: docsExampleBody,
          realBody: realBody,
        },
      })
    }

    // ========================================
    // RAW MODE — single call with full response
    // ========================================
    if (rawMode) {
      // Use exact docs format (no responseUrl!)
      const requestBody = {
        amount: totalCents,
        amountWithoutTax: 0,
        amountWithTax: Math.floor(totalCents / 1.15),
        tax: totalCents - Math.floor(totalCents / 1.15),
        service: 0,
        tip: 0,
        clientTransactionId,
        currency: 'USD',
        storeId,
        reference: 'Test PayPhone - AOE',
        oneTime: true,
        expireIn: 1,
      }

      const ppResponse = await fetch(`${baseUrl}/Links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearerToken,
          ...proxyHeaders,
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
          url: `${baseUrl}/Links`,
          method: 'POST',
          authHeader: `${bearerToken.slice(0, 10)}...${bearerToken.slice(-5)}`,
          body: requestBody,
          usingProxy,
        },
      })
    }

    // ========================================
    // NORMAL MODE — use library function
    // ========================================
    const result = await createPaymentLink({
      amount: totalCents,
      amountWithoutTax: 0,
      amountWithTax: Math.floor(totalCents / 1.15),
      tax: totalCents - Math.floor(totalCents / 1.15),
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
