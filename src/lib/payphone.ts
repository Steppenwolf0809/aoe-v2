import {
  type PayPhonePrepareRequest,
  type PayPhonePrepareResponse,
  type PayPhoneConfirmRequest,
  type PayPhoneConfirmResponse,
  payphonePrepareResponseSchema,
  payphoneConfirmResponseSchema,
} from './validations/payment'

const PAYPHONE_API_URL =
  process.env.PAYPHONE_API_URL || 'https://pay.payphone.app/api'

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
    return 'PayPhone devolvio una pagina HTML de error (500). Verifique token, storeId y modo sandbox.'
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
 * Prepare payment with PayPhone (Step 1)
 * Returns URL for user to complete payment
 */
export async function preparePayment(
  request: PayPhonePrepareRequest
): Promise<PayPhonePrepareResponse> {
  const { token, storeId } = getPayPhoneConfig()

  const response = await fetch(`${PAYPHONE_API_URL}/button/Prepare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'AOE-v2/1.0',
    },
    body: JSON.stringify({
      ...request,
      storeId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[PayPhone Prepare] Status:', response.status)
    console.error('[PayPhone Prepare] Response:', errorText.slice(0, 500))
    console.error('[PayPhone Prepare] Token length:', token.length, 'last5:', token.slice(-5))
    console.error('[PayPhone Prepare] StoreId:', storeId, 'length:', storeId.length)
    console.error('[PayPhone Prepare] Request:', JSON.stringify({ ...request, storeId }))
    const summarizedError = summarizeHtmlError(errorText)
    throw new Error(
      `PayPhone Prepare failed: ${response.status} ${summarizedError}`
    )
  }

  const data = await response.json()
  return payphonePrepareResponseSchema.parse(data)
}

/**
 * Confirm payment with PayPhone (Step 2)
 * Verifies payment was completed successfully
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
      'Accept-Encoding': 'gzip',
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
