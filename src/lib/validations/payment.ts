import { z } from 'zod'

// PayPhone Prepare Payment Request
// Regla: amount = amountWithoutTax + amountWithTax + tax + service + tip
export const payphonePrepareRequestSchema = z.object({
  amount: z.number().positive(), // Total en centavos
  amountWithoutTax: z.number().nonnegative().default(0), // Monto sin impuesto
  amountWithTax: z.number().nonnegative().default(0), // Monto gravado (base imponible)
  tax: z.number().nonnegative().default(0), // IVA calculado
  service: z.number().nonnegative().default(0), // Cargo por servicio
  tip: z.number().nonnegative().default(0), // Propina
  clientTransactionId: z.string().min(1),
  currency: z.literal('USD'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  documentId: z.string().optional(),
  lang: z.enum(['es', 'en']).default('es'),
  responseUrl: z.string().url(),
  reference: z.string().optional(),
  storeId: z.string().optional(), // Se inyecta desde env si no viene
})

export type PayPhonePrepareRequest = z.infer<typeof payphonePrepareRequestSchema>

// PayPhone Prepare Payment Response
export const payphonePrepareResponseSchema = z.object({
  paymentId: z.string(),
  payWithCard: z.string().url(),
  payWithPayPhone: z.string().url().optional(),
})

export type PayPhonePrepareResponse = z.infer<typeof payphonePrepareResponseSchema>

// PayPhone Confirm Payment Request
export const payphoneConfirmRequestSchema = z.object({
  id: z.string().min(1), // PayPhone transaction ID
  clientTxId: z.string().min(1), // Client transaction ID
})

export type PayPhoneConfirmRequest = z.infer<typeof payphoneConfirmRequestSchema>

// PayPhone Confirm Payment Response
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

// PayPhone Webhook Payload
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

// Helper function to validate payment status
export function isPaymentApproved(statusCode: number): boolean {
  return statusCode === 3
}

export function isPaymentPending(statusCode: number): boolean {
  return statusCode === 2
}

export function isPaymentCancelled(statusCode: number): boolean {
  return statusCode === 1
}
