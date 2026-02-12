import {
  type PayPhoneLinkRequest,
  type PayPhoneLinkResponse,
  type PayPhoneConfirmRequest,
  type PayPhoneConfirmResponse,
  payphoneLinkResponseSchema,
  payphoneConfirmResponseSchema,
} from './validations/payment'

const PAYPHONE_API_URL =
  process.env.PAYPHONE_API_URL || 'https://pay.payphonetodoesposible.com/api'

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
    return 'PayPhone devolvio una pagina HTML de error (500). Verifique token, storeId y tipo de aplicacion.'
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

  const body = {
    ...request,
    storeId,
  }

  const response = await fetch(`${PAYPHONE_API_URL}/Links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[PayPhone Links] Status:', response.status)
    console.error('[PayPhone Links] Response:', errorText.slice(0, 500))
    console.error('[PayPhone Links] Token length:', token.length, 'last5:', token.slice(-5))
    console.error('[PayPhone Links] StoreId:', storeId, 'length:', storeId.length)
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

  const response = await fetch(`${PAYPHONE_API_URL}/Sale/${transactionId}`, {
    method: 'GET',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
    },
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

  const response = await fetch(`${PAYPHONE_API_URL}/button/V2/Confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'User-Agent': 'AOE-v2/1.0',
    },
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
