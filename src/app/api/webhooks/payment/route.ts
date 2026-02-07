import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // TODO: verificar firma del webhook
    // TODO: procesar pago y actualizar contrato
    console.log('[Payment Webhook]', body)
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
