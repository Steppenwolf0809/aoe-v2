import { z } from 'zod'

// ============================================
// PayPhone Button/Prepare API (redirect flow)
// ============================================

// Prepare Request
// Regla: amount = amountWithoutTax + amountWithTax + tax + service + tip
export const payphoneLinkRequestSchema = z.object({
  amount: z.number().positive(), // Total en centavos
  amountWithoutTax: z.number().nonnegative().default(0),
  amountWithTax: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  service: z.number().nonnegative().default(0),
  tip: z.number().nonnegative().default(0),
  clientTransactionId: z.string().min(1),
  currency: z.literal('USD'),
  reference: z.string().max(100).optional(),
  optionalParameter: z.string().max(250).optional(), // Datos extra (contractId)
  responseUrl: z.string().url(), // Required — PayPhone redirects here after payment
  cancellationUrl: z.string().url().optional(), // URL para cuando el usuario cancela el pago
  storeId: z.string().optional(), // Se inyecta desde env
})

export type PayPhoneLinkRequest = z.infer<typeof payphoneLinkRequestSchema>

// Prepare Response - PayPhone devuelve payWithCard, payWithPayPhone y paymentId
export const payphoneLinkResponseSchema = z.object({
  paymentId: z.number().optional(),
  payWithCard: z.string().optional(),
  payWithPayPhone: z.string().optional(),
  paymentUrl: z.string().optional(), // Legacy/alias — computed below
}).transform((data) => ({
  ...data,
  // Normalize: use payWithCard as the primary payment URL
  paymentUrl: data.paymentUrl || data.payWithCard || data.payWithPayPhone || '',
}))

export type PayPhoneLinkResponse = z.infer<typeof payphoneLinkResponseSchema>

// ============================================
// PayPhone Confirm / Status Check
// ============================================

// Confirm Request (para /button/V2/Confirm)
// PayPhone docs: id is integer, clientTxId is string
export const payphoneConfirmRequestSchema = z.object({
  id: z.coerce.number().int(), // PayPhone expects integer — coerces string→number
  clientTxId: z.string().min(1),
})

// Input type allows string|number for id (from URL query params)
export type PayPhoneConfirmRequest = {
  id: string | number
  clientTxId: string
}

// Confirm/Status Response (shared between Confirm and GET /Sale/{id})
export const payphoneConfirmResponseSchema = z.object({
  transactionId: z.coerce.string(),
  clientTransactionId: z.string().optional(),
  statusCode: z.number(), // 3 = approved, 2 = pending, 1 = cancelled
  status: z.string().optional(),
  transactionStatus: z.string().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  authorizationCode: z.string().optional(),
  bin: z.string().optional(),
  lastDigits: z.string().optional(),
  cardBrand: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  reference: z.string().optional(),
})

export type PayPhoneConfirmResponse = z.infer<typeof payphoneConfirmResponseSchema>

// ============================================
// Webhook
// ============================================

export const payphoneWebhookSchema = z.object({
  id: z.string(),
  clientTransactionId: z.string(),
  statusCode: z.number(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  timestamp: z.string().optional(),
})

export type PayPhoneWebhook = z.infer<typeof payphoneWebhookSchema>

// ============================================
// Helpers
// ============================================

export function isPaymentApproved(statusCode: number): boolean {
  return statusCode === 3
}

export function isPaymentPending(statusCode: number): boolean {
  return statusCode === 2
}

export function isPaymentCancelled(statusCode: number): boolean {
  return statusCode === 1
}
