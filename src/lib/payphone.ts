import {
  type PayPhoneLinkRequest,
  type PayPhoneLinkResponse,
  type PayPhoneConfirmRequest,
  type PayPhoneConfirmResponse,
  payphoneLinkResponseSchema,
  payphoneConfirmRequestSchema,
  payphoneConfirmResponseSchema,
} from './validations/payment'

const PAYPHONE_UPSTREAM_API_URL =
  process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'

// Optional Cloudflare Worker / proxy to bypass PayPhone WAF blocking Vercel egress.
// If set, requests go to this URL instead of PAYPHONE_API_URL.
// Example: https://<worker>.<account>.workers.dev/api
const PAYPHONE_PROXY_URL = process.env.PAYPHONE_PROXY_URL
const PAYPHONE_PROXY_SECRET = process.env.PAYPHONE_PROXY_SECRET

// Optional per-endpoint overrides (useful for n8n/Railway proxy webhooks).
// If set, these should be full URLs.
const PAYPHONE_LINKS_URL = process.env.PAYPHONE_LINKS_URL
const PAYPHONE_SALE_URL = process.env.PAYPHONE_SALE_URL
const PAYPHONE_CONFIRM_URL = process.env.PAYPHONE_CONFIRM_URL

function getPayPhoneBaseUrl(): string {
  return (PAYPHONE_PROXY_URL || PAYPHONE_UPSTREAM_API_URL).replace(/\/+$/, '')
}

function applyIdTemplate(url: string, id: string): string {
  // Support common placeholder variants.
  return url
    .replace(/\{\{id\}\}/g, id)
    .replace(/\{id\}/g, id)
    .replace(/\{\{transactionId\}\}/g, id)
    .replace(/\{transactionId\}/g, id)
}

/**
 * Resolve the Button Prepare URL.
 * PAYPHONE_LINKS_URL → n8n webhook for Prepare (secret via query param).
 * PAYPHONE_PROXY_URL → Cloudflare Worker (secret via header).
 * Otherwise → direct to PayPhone API.
 */
function resolvePrepareUrl(): string {
  if (PAYPHONE_LINKS_URL) return appendN8nSecret(PAYPHONE_LINKS_URL.trim())
  const baseUrl = getPayPhoneBaseUrl()
  return `${baseUrl}/button/Prepare`
}

/**
 * Resolve the Sale/client/{id} URL for checking transaction status.
 * PAYPHONE_SALE_URL → n8n webhook (id passed as query param ?id=XX&secret=XX).
 */
function resolveSaleUrl(transactionId: string): string {
  if (PAYPHONE_SALE_URL) {
    const raw = PAYPHONE_SALE_URL.trim()
    const templated = applyIdTemplate(raw, transactionId)
    if (templated === raw) {
      // n8n webhook: pass id as query param (n8n reads $json.query.id)
      const baseWithSecret = appendN8nSecret(raw.replace(/\/+$/, ''))
      const separator = baseWithSecret.includes('?') ? '&' : '?'
      return `${baseWithSecret}${separator}id=${encodeURIComponent(transactionId)}`
    }
    return appendN8nSecret(templated)
  }
  const baseUrl = getPayPhoneBaseUrl()
  return `${baseUrl}/Sale/client/${transactionId}`
}

function resolveConfirmUrl(): string {
  if (PAYPHONE_CONFIRM_URL) return appendN8nSecret(PAYPHONE_CONFIRM_URL.trim())
  const baseUrl = getPayPhoneBaseUrl()
  return `${baseUrl}/button/V2/Confirm`
}

/**
 * Returns extra headers for Cloudflare Worker proxy.
 * Only used when PAYPHONE_PROXY_URL is set (generic proxy mode).
 * For n8n per-endpoint URLs, the secret is added as a query param instead.
 */
function getProxyHeaders(): Record<string, string> {
  if (!PAYPHONE_PROXY_URL) return {}
  if (!PAYPHONE_PROXY_SECRET) {
    throw new Error(
      'PAYPHONE_PROXY_URL is set but PAYPHONE_PROXY_SECRET is missing. Configure PAYPHONE_PROXY_SECRET in Vercel and PROXY_SECRET in the Cloudflare Worker.'
    )
  }
  return { 'X-Proxy-Secret': PAYPHONE_PROXY_SECRET }
}

/**
 * Append ?secret=XXX to a URL for n8n webhook authentication.
 * n8n validates the secret via query param, not header.
 */
function appendN8nSecret(url: string): string {
  const secret = process.env.PAYPHONE_PROXY_SECRET || process.env.N8N_PAYPHONE_SECRET
  if (!secret) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}secret=${encodeURIComponent(secret)}`
}

function looksLikePlaceholder(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return (
    normalized.includes('tu_') ||
    normalized.includes('_aqui') ||
    normalized.includes('your_') ||
    normalized.includes('example') ||
    normalized.includes('xxxx')
  )
}

function normalizeAuthToken(rawToken: string): string {
  const token = rawToken.trim()

  if (/^bearer\s+/i.test(token)) return token
  if (/^bearer_/i.test(token)) return `Bearer ${token.slice('Bearer_'.length)}`
  return `Bearer ${token}`
}

function summarizeHtmlError(htmlOrText: string): string {
  if (/<html/i.test(htmlOrText) || /<body/i.test(htmlOrText)) {
    // In our diagnostics this often indicates WAF / origin blocking (e.g. Vercel IPs),
    // not an auth/body/schema issue. Keep message actionable and not misleading.
    return 'PayPhone devolvio una pagina HTML de error (500). Si esto ocurre solo desde Vercel pero funciona desde tu PC, es probable bloqueo por IP/ASN (WAF).'
  }
  return htmlOrText
}

/**
 * Get PayPhone credentials from env
 */
function getPayPhoneConfig() {
  const rawToken = process.env.PAYPHONE_TOKEN
  const rawStoreId = process.env.PAYPHONE_STORE_ID

  if (!rawToken || !rawStoreId) {
    throw new Error(
      'PayPhone credentials not configured. Set PAYPHONE_TOKEN and PAYPHONE_STORE_ID in .env.local'
    )
  }

  if (looksLikePlaceholder(rawToken) || looksLikePlaceholder(rawStoreId)) {
    throw new Error(
      'PayPhone credentials look like placeholders. Replace PAYPHONE_TOKEN and PAYPHONE_STORE_ID with real sandbox/production values.'
    )
  }

  const storeId = rawStoreId.trim()
  if (storeId.length === 0) {
    throw new Error(
      'PAYPHONE_STORE_ID invalido. No puede estar vacio.'
    )
  }

  const token = normalizeAuthToken(rawToken)
  return { token, storeId }
}

/**
 * Generate a short client transaction ID (max 15 chars for PayPhone)
 * Format: AOE + base36 timestamp = ~11 chars
 */
export function generateShortTransactionId(): string {
  return `AOE${Date.now().toString(36).toUpperCase()}`
}

/**
 * Create payment via PayPhone Button/Prepare API (redirect flow).
 * Unlike the Links API, the Button API supports responseUrl for browser redirect
 * and requires a Confirm step within 5 minutes after payment.
 * Returns URL for user to complete payment.
 */
export async function createPaymentButton(
  request: PayPhoneLinkRequest
): Promise<PayPhoneLinkResponse> {
  const { token, storeId } = getPayPhoneConfig()

  const endpointUrl = resolvePrepareUrl()
  const body = {
    ...request,
    storeId,
  }

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
      ...getProxyHeaders(),
    },
    redirect: 'manual',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[PayPhone Prepare] Status:', response.status)
    console.error('[PayPhone Prepare] Response:', errorText.slice(0, 500))
    console.error('[PayPhone Prepare] Token length:', token.length, 'last5:', token.slice(-5))
    console.error('[PayPhone Prepare] StoreId:', storeId, 'length:', storeId.length)
    console.error('[PayPhone Prepare] Using proxy:', !!PAYPHONE_PROXY_URL, 'url:', endpointUrl)
    console.error('[PayPhone Prepare] Request:', JSON.stringify(body))

    let errorMsg = errorText
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.proxySource) {
        errorMsg = `[${errorJson.proxySource}] ${errorJson.error || `HTTP ${errorJson.statusCode}`}`
        if (errorJson.location) errorMsg += ` (redirect: ${errorJson.location})`
        if (errorJson.rawBody) errorMsg += ` | ${errorJson.rawBody.slice(0, 200)}`
      }
    } catch {
      errorMsg = summarizeHtmlError(errorText)
    }

    throw new Error(`PayPhone Prepare failed: ${response.status} ${errorMsg}`)
  }

  // Button Prepare may return JSON with paymentUrl or a plain URL string
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    // Handle n8n proxy wrapper
    const prepareData = data.body && typeof data.body === 'object' ? data.body : data
    return payphoneLinkResponseSchema.parse(prepareData)
  }

  // Plain text response = direct URL
  const url = (await response.text()).trim().replace(/^"|"$/g, '')
  return payphoneLinkResponseSchema.parse({ paymentUrl: url })
}

/**
 * Check transaction status via Sale endpoint
 * Used after PayPhone redirects back to verify payment
 */
export async function checkTransactionStatus(
  transactionId: string
): Promise<PayPhoneConfirmResponse> {
  const { token } = getPayPhoneConfig()
  const url = resolveSaleUrl(transactionId)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
      ...getProxyHeaders(),
    },
    redirect: 'manual',
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMsg = errorText
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.proxySource) {
        errorMsg = `[${errorJson.proxySource}] ${errorJson.error || `HTTP ${errorJson.statusCode}`}`
      }
    } catch {
      errorMsg = summarizeHtmlError(errorText)
    }
    throw new Error(`PayPhone status check failed: ${response.status} ${errorMsg}`)
  }

  // Handle n8n proxy JSON wrapper (Sale endpoint returns body as nested JSON)
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    // n8n proxy wraps PayPhone response in {body, statusCode} — unwrap if needed
    const saleData = data.body && typeof data.body === 'object' ? data.body : data
    return payphoneConfirmResponseSchema.parse(saleData)
  }

  const data = await response.json()
  return payphoneConfirmResponseSchema.parse(data)
}

/**
 * Confirm payment with PayPhone (V2 Confirm - kept for backward compatibility)
 */
export async function confirmPayment(
  request: PayPhoneConfirmRequest
): Promise<PayPhoneConfirmResponse> {
  const { token } = getPayPhoneConfig()
  const url = resolveConfirmUrl()

  // Ensure id is sent as integer per PayPhone docs
  const parsedRequest = payphoneConfirmRequestSchema.parse(request)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
      ...getProxyHeaders(),
    },
    redirect: 'manual',
    body: JSON.stringify(parsedRequest),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[PayPhone Confirm] Status:', response.status, 'Body:', errorText.slice(0, 500))
    const summarizedError = summarizeHtmlError(errorText)
    throw new Error(
      `PayPhone Confirm failed: ${response.status} ${summarizedError}`
    )
  }

  const data = await response.json()
  return payphoneConfirmResponseSchema.parse(data)
}

/**
 * Calculate PayPhone fees (5% + IVA)
 */
export function calculatePayPhoneFees(amount: number): {
  subtotal: number
  payphoneFee: number
  iva: number
  total: number
} {
  const subtotal = amount
  const payphoneFee = amount * 0.05 // 5%
  const iva = payphoneFee * 0.15 // 15% IVA sobre la comisión
  const total = subtotal + payphoneFee + iva

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    payphoneFee: Math.round(payphoneFee * 100) / 100,
    iva: Math.round(iva * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
