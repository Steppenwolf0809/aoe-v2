import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-webhook-secret')
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    // TODO: procesar webhook de n8n
    console.log('[n8n Webhook]', body)
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
