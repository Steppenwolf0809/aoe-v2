import { timingSafeEqual } from 'node:crypto'

export type PayPhoneWebhookAuthFailureReason =
  | 'missing_secret_config'
  | 'missing_secret'
  | 'invalid_secret'

export type PayPhoneWebhookAuthResult =
  | { ok: true; reason: 'non_production' | 'authorized' }
  | { ok: false; reason: PayPhoneWebhookAuthFailureReason }

export interface ValidatePayPhoneWebhookAuthInput {
  nodeEnv?: string
  configuredSecrets: string[]
  headerSecret?: string | null
  querySecret?: string | null
  bearerSecret?: string | null
}

function normalizeSecret(value?: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  return trimmed
}

function secureEquals(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function parseBearerSecret(
  authorizationHeader?: string | null
): string | null {
  const value = authorizationHeader?.trim()
  if (!value) return null
  const match = /^Bearer\s+(.+)$/i.exec(value)
  return match?.[1]?.trim() || null
}

export function resolveConfiguredPayPhoneWebhookSecrets(
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const values = [
    env.PAYPHONE_WEBHOOK_SECRET,
    env.N8N_WEBHOOK_SECRET,
    env.PAYPHONE_PROXY_SECRET,
  ]
    .map(normalizeSecret)
    .filter((value): value is string => !!value)

  return [...new Set(values)]
}

export function validatePayPhoneWebhookAuth(
  input: ValidatePayPhoneWebhookAuthInput
): PayPhoneWebhookAuthResult {
  if (input.nodeEnv !== 'production') {
    return { ok: true, reason: 'non_production' }
  }

  if (input.configuredSecrets.length === 0) {
    return { ok: false, reason: 'missing_secret_config' }
  }

  const incomingSecret =
    normalizeSecret(input.headerSecret) ||
    normalizeSecret(input.querySecret) ||
    normalizeSecret(input.bearerSecret)

  if (!incomingSecret) {
    return { ok: false, reason: 'missing_secret' }
  }

  const isAuthorized = input.configuredSecrets.some((secret) =>
    secureEquals(secret, incomingSecret)
  )

  if (!isAuthorized) {
    return { ok: false, reason: 'invalid_secret' }
  }

  return { ok: true, reason: 'authorized' }
}
