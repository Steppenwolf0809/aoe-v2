import {
  type PayPhonePrepareRequest,
  type PayPhonePrepareResponse,
  type PayPhoneConfirmRequest,
  type PayPhoneConfirmResponse,
  payphonePrepareResponseSchema,
  payphoneConfirmResponseSchema,
} from './validations/payment'

const PAYPHONE_API_URL = 'https://pay.payphonetodoesposible.com/api'

/**
 * Get PayPhone credentials from env
 */
function getPayPhoneConfig() {
  const token = process.env.PAYPHONE_TOKEN
  const storeId = process.env.PAYPHONE_STORE_ID

  if (!token || !storeId) {
    throw new Error(
      'PayPhone credentials not configured. Set PAYPHONE_TOKEN and PAYPHONE_STORE_ID in .env.local'
    )
  }

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
    },
    body: JSON.stringify({
      ...request,
      storeId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `PayPhone Prepare failed: ${response.status} ${errorText}`
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
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `PayPhone Confirm failed: ${response.status} ${errorText}`
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
