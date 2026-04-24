import { Resend } from 'resend'

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return null
  }

  return new Resend(apiKey)
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || 'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>'
}

export function getEmailReplyTo(): string {
  return process.env.EMAIL_REPLY_TO || 'info@abogadosonlineecuador.com'
}

