import {
  type PayPhoneLinkRequest,
  type PayPhoneLinkResponse,
  type PayPhoneConfirmRequest,
  type PayPhoneConfirmResponse,
  payphoneLinkResponseSchema,
  payphoneConfirmResponseSchema,
} from './validations/payment'

const PAYPHONE_UPSTREAM_API_URL =
  process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'

// Optional Cloudflare Worker / proxy to bypass PayPhone WAF blocking Vercel egress.
// If set, requests go to this URL instead of PAYPHONE_API_URL.
// Example: https://<worker>.<account>.workers.dev/api
const PAYPHONE_PROXY_URL = process.env.PAYPHONE_PROXY_URL
const PAYPHONE_PROXY_SECRET = process.env.PAYPHONE_PROXY_SECRET

function getPayPhoneBaseUrl(): string {
  return (PAYPHONE_PROXY_URL || PAYPHONE_UPSTREAM_API_URL).replace(/\/+$/, '')
}

function getProxyHeaders(): Record<string, string> {
  if (!PAYPHONE_PROXY_URL) return {}
  if (!PAYPHONE_PROXY_SECRET) {
    throw new Error(
      'PAYPHONE_PROXY_URL is set but PAYPHONE_PROXY_SECRET is missing. Configure PAYPHONE_PROXY_SECRET in Vercel and PROXY_SECRET in the Cloudflare Worker.'
    )
  }
  return { 'X-Proxy-Secret': PAYPHONE_PROXY_SECRET }
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
 * Generate a short client transaction ID (max 15 chars for PayPhone Links)
 * Format: AOE + base36 timestamp = ~11 chars
 */
export function generateShortTransactionId(): string {
  return `AOE${Date.now().toString(36).toUpperCase()}`
}

/**
 * Create payment link with PayPhone Links API
 * Returns URL for user to complete payment
 */
export async function createPaymentLink(
  request: PayPhoneLinkRequest
): Promise<PayPhoneLinkResponse> {
  const { token, storeId } = getPayPhoneConfig()

  const baseUrl = getPayPhoneBaseUrl()
  const body = {
    ...request,
    storeId,
  }

  const response = await fetch(`${baseUrl}/Links`, {
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
    console.error('[PayPhone Links] Status:', response.status)
    console.error('[PayPhone Links] Response:', errorText.slice(0, 500))
    console.error('[PayPhone Links] Token length:', token.length, 'last5:', token.slice(-5))
    console.error('[PayPhone Links] StoreId:', storeId, 'length:', storeId.length)
    console.error('[PayPhone Links] Using proxy:', !!PAYPHONE_PROXY_URL, 'baseUrl:', baseUrl)
    console.error('[PayPhone Links] Request:', JSON.stringify(body))
    const summarizedError = summarizeHtmlError(errorText)
    throw new Error(
      `PayPhone Links failed: ${response.status} ${summarizedError}`
    )
  }

  // Links API may return a plain URL string or a JSON object
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    return payphoneLinkResponseSchema.parse(data)
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
  const baseUrl = getPayPhoneBaseUrl()

  const response = await fetch(`${baseUrl}/Sale/${transactionId}`, {
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
    const summarizedError = summarizeHtmlError(errorText)
    throw new Error(
      `PayPhone status check failed: ${response.status} ${summarizedError}`
    )
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
  const baseUrl = getPayPhoneBaseUrl()

  const response = await fetch(`${baseUrl}/button/V2/Confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
      ...getProxyHeaders(),
    },
    redirect: 'manual',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
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
