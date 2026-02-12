/**
 * n8n Webhook Integration
 * Fire-and-forget notifications to n8n for automation workflows.
 * Server-side only, webhook URL stays hidden from client.
 */

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET

interface LeadPayload {
  email: string
  name?: string | null
  phone?: string | null
  source: string
  interes?: string | null
  fecha?: string | null
  metadata?: Record<string, unknown>
}

function resolveLeadCaptureWebhookUrl(rawUrl: string): string {
  const normalized = rawUrl.trim().replace(/\/+$/, '')

  try {
    const parsed = new URL(normalized)
    const path = parsed.pathname.replace(/\/+$/, '')

    if (path.endsWith('/lead-capture')) {
      return parsed.toString()
    }

    if (path.endsWith('/webhook') || path.endsWith('/webhook-test')) {
      parsed.pathname = `${path}/lead-capture`
      return parsed.toString()
    }

    parsed.pathname = `${path}/webhook/lead-capture`
    return parsed.toString()
  } catch {
    if (normalized.endsWith('/lead-capture')) {
      return normalized
    }

    if (normalized.endsWith('/webhook') || normalized.endsWith('/webhook-test')) {
      return `${normalized}/lead-capture`
    }

    return `${normalized}/webhook/lead-capture`
  }
}

/**
 * Sends a lead notification to n8n (fire-and-forget).
 * Never throws, failures are logged but do not block the main flow.
 */
export async function notifyN8NLead(data: LeadPayload): Promise<void> {
  if (!N8N_WEBHOOK_URL) {
    console.warn('[n8n] N8N_WEBHOOK_URL not configured, skipping notification')
    return
  }

  try {
    const webhookUrl = resolveLeadCaptureWebhookUrl(N8N_WEBHOOK_URL)

    const payload = JSON.parse(
      JSON.stringify({
        email: data.email,
        name: data.name || null,
        phone: data.phone || null,
        source: data.source,
        interes: data.interes || null,
        fecha: data.fecha || new Date().toISOString().split('T')[0],
        ...(data.metadata ? { metadata: data.metadata } : {}),
      }),
    ) as Record<string, unknown>

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': N8N_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const responseText = await response.text().catch(() => '')
      console.error(
        `[n8n] Webhook returned ${response.status} at ${webhookUrl}${responseText ? `: ${responseText}` : ''}`,
      )
    }
  } catch (error) {
    console.error('[n8n] Webhook notification failed:', error)
  }
}
