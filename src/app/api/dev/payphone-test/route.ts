import { NextRequest, NextResponse } from 'next/server'
import { preparePayment } from '@/lib/payphone'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  const devSecret = process.env.DEV_SECRET
  if (!devSecret) return process.env.NODE_ENV !== 'production'
  return secret === devSecret
}

/**
 * Test PayPhone Prepare endpoint directly
 * Protected by DEV_SECRET query param (works in prod too)
 *
 * GET  /api/dev/payphone-test?secret=xxx  → shows config status
 * POST /api/dev/payphone-test?secret=xxx  → fires a test transaction
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const token = process.env.PAYPHONE_TOKEN
  const storeId = process.env.PAYPHONE_STORE_ID
  const apiUrl = process.env.PAYPHONE_API_URL || 'https://pay.payphone.app/api'

  return NextResponse.json({
    status: 'ready',
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
    const amount = body.amount ?? 100 // default $1.00
    const email = body.email ?? 'dev-test@aoe.ec'

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const prefix = process.env.PAYPHONE_REGION_PREFIX || 'DEV-AOE-'
    const clientTransactionId = `${prefix}test-${Date.now()}`

    console.log('[PayPhone Test] Firing Prepare with:', {
      amount,
      email,
      clientTransactionId,
      apiUrl: process.env.PAYPHONE_API_URL || 'https://pay.payphone.app/api',
    })

    const result = await preparePayment({
      amount,
      amountWithoutTax: amount,
      clientTransactionId,
      currency: 'USD',
      email,
      responseUrl: `${appUrl}/contratos/pago/callback?contractId=dev-test`,
      lang: 'es',
      tip: 0,
      tax: 0,
    })

    return NextResponse.json({
      success: true,
      clientTransactionId,
      payWithCard: result.payWithCard,
      paymentId: result.paymentId,
      payWithPayPhone: result.payWithPayPhone ?? null,
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
