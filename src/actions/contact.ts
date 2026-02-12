'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { notifyN8NLead } from '@/lib/n8n'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor ingresa un email valido' }),
  phone: z.string().optional(),
  serviceType: z.string().min(1, { message: 'Por favor selecciona un tipo de servicio' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres' }),
})

export type ContactState = {
  success?: boolean
  message?: string
  errors?: {
    [key: string]: string[]
  }
}

function isSchemaMismatchError(error: { message?: string | null; code?: string | null } | null): boolean {
  if (!error) return false

  const text = `${error.code || ''} ${error.message || ''}`.toLowerCase()
  return text.includes('could not find') || text.includes('column') || text.includes('schema cache')
}

export async function submitContactForm(
  _prevState: ContactState | undefined,
  formData: FormData,
): Promise<ContactState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    serviceType: formData.get('serviceType'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor revisa los campos del formulario.',
    }
  }

  const { name, email, phone, serviceType, message } = validatedFields.data

  try {
    const supabase = await createClient()

    // Primary insert for the current schema.
    let { error: dbError } = await supabase.from('leads').insert({
      email,
      phone: phone || null,
      source: 'contacto',
      calculator_type: serviceType,
      data: { name, serviceType, message },
    })

    // Fallback for legacy schema (name + metadata).
    if (dbError && isSchemaMismatchError(dbError)) {
      const fallback = await supabase.from('leads').insert({
        name,
        email,
        phone: phone || null,
        source: 'contacto',
        status: 'new',
        metadata: { serviceType, message },
      })
      dbError = fallback.error
    }

    if (dbError) {
      console.error('Supabase error saving contact lead:', dbError)
    }

    const n8nSuccess = await notifyN8NLead({
      email,
      name,
      phone,
      source: 'contacto',
      interes: serviceType,
      metadata: { message },
    })

    let emailSent = true
    try {
      await resend.emails.send({
        from:
          process.env.EMAIL_FROM ||
          'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>',
        replyTo: email,
        to: process.env.EMAIL_REPLY_TO || 'info@abogadosonlineecuador.com',
        subject: `Nuevo contacto: ${serviceType}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefono:</strong> ${phone || 'N/A'}</p>
          <p><strong>Servicio:</strong> ${serviceType}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (error) {
      emailSent = false
      console.error('Error sending contact notification email:', error)
    }

    const dbSaved = !dbError
    if (!emailSent && !n8nSuccess) {
      if (dbSaved) {
        return {
          success: false,
          message:
            'Recibimos tu mensaje, pero fallo la notificacion interna. Intenta nuevamente en unos minutos.',
        }
      }
      return {
        success: false,
        message: 'No pudimos enviar tu mensaje en este momento. Intenta nuevamente en unos minutos.',
      }
    }

    return {
      success: true,
      message: 'Mensaje enviado con exito. Nos pondremos en contacto contigo pronto.',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.',
    }
  }
}
