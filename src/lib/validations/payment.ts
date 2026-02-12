import { z } from 'zod'

// ============================================
// PayPhone Links API (Tipo de app: API)
// ============================================

// Links Request
// Regla: amount = amountWithoutTax + amountWithTax + tax + service + tip
export const payphoneLinkRequestSchema = z.object({
  amount: z.number().positive(), // Total en centavos
  amountWithoutTax: z.number().nonnegative().default(0),
  amountWithTax: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  service: z.number().nonnegative().default(0),
  tip: z.number().nonnegative().default(0),
  clientTransactionId: z.string().min(1).max(15), // Max 15 chars para Links
  currency: z.literal('USD'),
  responseUrl: z.string().url(), // URL de retorno despues del pago
  reference: z.string().max(100).optional(),
  oneTime: z.boolean().default(true), // Link de un solo uso
  expireIn: z.number().optional(), // Horas hasta que expire
  additionalData: z.string().max(250).optional(), // Datos extra (contractId)
  storeId: z.string().optional(), // Se inyecta desde env
})

export type PayPhoneLinkRequest = z.infer<typeof payphoneLinkRequestSchema>

// Links Response - PayPhone devuelve una URL (string o JSON)
export const payphoneLinkResponseSchema = z.object({
  paymentUrl: z.string(), // URL del link de pago
})

export type PayPhoneLinkResponse = z.infer<typeof payphoneLinkResponseSchema>

// ============================================
// PayPhone Confirm / Status Check
// ============================================

// Confirm Request (para /button/V2/Confirm - backward compat)
export const payphoneConfirmRequestSchema = z.object({
  id: z.string().min(1),
  clientTxId: z.string().min(1),
})

export type PayPhoneConfirmRequest = z.infer<typeof payphoneConfirmRequestSchema>

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
