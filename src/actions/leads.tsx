'use server'

import { createClient } from '@/lib/supabase/server'
import { leadCaptureSchema, calculatorSessionSchema } from '@/lib/validations/leads'
import type { LeadCaptureInput, CalculatorSessionInput } from '@/lib/validations/leads'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@/emails/welcome-email'

const resend = new Resend(process.env.RESEND_API_KEY)

interface CaptureLeadOptions {
  sendWelcomeEmail?: boolean
}

/* ----------------------------------------------------------------
   captureLead — Saves a lead from calculators or lead magnets
   ---------------------------------------------------------------- */
export async function captureLead(
  data: LeadCaptureInput,
  options: CaptureLeadOptions = {},
) {
  const parsed = leadCaptureSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false as const, error: 'Datos inválidos' }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.from('leads').insert({
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      source: parsed.data.source,
      calculator_type: parsed.data.source,
      data: { name: parsed.data.name || null },
    })

    if (error) {
      console.error('Supabase error capturing lead:', error)
      return { success: false as const, error: 'Error guardando datos' }
    }

    if (options.sendWelcomeEmail ?? true) {
      // --- Envío del Email de Bienvenida ---
      try {
        const emailHtml = await render(
          <WelcomeEmail clientName={parsed.data.name || 'Cliente'} />
        )

        await resend.emails.send({
          from:
            process.env.EMAIL_FROM ||
            'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>',
          replyTo: process.env.EMAIL_REPLY_TO || 'info@abogadosonlineecuador.com',
          to: parsed.data.email,
          subject: '¡Bienvenido a Abogados Online Ecuador! 🚀',
          html: emailHtml,
        })
      } catch (emailError) {
        // No bloqueamos el flujo principal si el email falla
        console.error('Error sending welcome email:', emailError)
      }
    }

    return { success: true as const }
  } catch (e) {
    console.error('captureLead exception:', e)
    return { success: false as const, error: 'Error del servidor' }
  }
}

/* ----------------------------------------------------------------
   trackCalculatorSession — Anonymous analytics for calculator usage
   ---------------------------------------------------------------- */
export async function trackCalculatorSession(data: CalculatorSessionInput) {
  const parsed = calculatorSessionSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false as const, error: 'Datos inválidos' }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.from('calculator_sessions').insert({
      visitor_id: parsed.data.visitorId || null,
      type: parsed.data.type,
      inputs: parsed.data.inputs,
      result: parsed.data.result,
    })

    if (error) {
      console.error('Supabase error tracking session:', error)
      return { success: false as const, error: 'Error guardando sesión' }
    }

    return { success: true as const }
  } catch (e) {
    console.error('trackCalculatorSession exception:', e)
    return { success: false as const, error: 'Error del servidor' }
  }
}

/* ----------------------------------------------------------------
   sendLeadMagnetEmail — Sends a PDF lead magnet via email
   Placeholder: Requires Resend API key configuration (PROMPT 12.5)
   ---------------------------------------------------------------- */
export async function sendLeadMagnetEmail(leadId: string, type: 'desglose' | 'checklist' | 'guia') {
  // TODO: Implement with Resend in PROMPT 12.5
  // 1. Fetch lead data from Supabase
  // 2. Generate or fetch the correct PDF
  // 3. Send via Resend with the PDF attachment
  // 4. Track open/click events

  console.log(`[sendLeadMagnetEmail] Would send ${type} to lead ${leadId}`)

  return {
    success: true as const,
    message: `Email de tipo "${type}" encolado para envío`,
  }
}
