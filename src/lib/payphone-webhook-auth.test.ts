import { describe, expect, it } from 'vitest'
import {
  parseBearerSecret,
  resolveConfiguredPayPhoneWebhookSecrets,
  validatePayPhoneWebhookAuth,
} from './payphone-webhook-auth'

describe('payphone webhook auth', () => {
  it('allows non-production requests without secret', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'development',
      configuredSecrets: [],
    })

    expect(result).toEqual({ ok: true, reason: 'non_production' })
  })

  it('rejects production when no server secret is configured', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: [],
      headerSecret: 'abc',
    })

    expect(result).toEqual({ ok: false, reason: 'missing_secret_config' })
  })

  it('rejects production when secret is missing in request', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: ['secret-1'],
    })

    expect(result).toEqual({ ok: false, reason: 'missing_secret' })
  })

  it('rejects production when secret does not match', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: ['secret-1'],
      headerSecret: 'wrong-secret',
    })

    expect(result).toEqual({ ok: false, reason: 'invalid_secret' })
  })

  it('accepts matching secret via header', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: ['secret-1'],
      headerSecret: 'secret-1',
    })

    expect(result).toEqual({ ok: true, reason: 'authorized' })
  })

  it('accepts matching secret via query parameter', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: ['secret-1'],
      querySecret: 'secret-1',
    })

    expect(result).toEqual({ ok: true, reason: 'authorized' })
  })

  it('accepts matching secret via bearer token', () => {
    const result = validatePayPhoneWebhookAuth({
      nodeEnv: 'production',
      configuredSecrets: ['secret-1'],
      bearerSecret: parseBearerSecret('Bearer secret-1'),
    })

    expect(result).toEqual({ ok: true, reason: 'authorized' })
  })

  it('extracts and deduplicates configured secrets from env', () => {
    const secrets = resolveConfiguredPayPhoneWebhookSecrets({
      PAYPHONE_WEBHOOK_SECRET: '  alpha  ',
      N8N_WEBHOOK_SECRET: 'alpha',
      PAYPHONE_PROXY_SECRET: 'beta',
    })

    expect(secrets).toEqual(['alpha', 'beta'])
  })
})
