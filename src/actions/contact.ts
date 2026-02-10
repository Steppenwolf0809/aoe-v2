'use server'

import { z } from 'zod'
// import { Resend } from 'resend' 
// TODO: Uncomment when Resend is configured
// const resend = new Resend(process.env.RESEND_API_KEY)

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor ingresa un email válido' }),
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

export async function submitContactForm(prevState: ContactState | undefined, formData: FormData): Promise<ContactState> {
  // Validate form fields
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    serviceType: formData.get('serviceType'),
    message: formData.get('message'),
  })

  // If form validation fails, return errors early.
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor revisa los campos del formulario.',
    }
  }

  const { name, email, phone, serviceType, message } = validatedFields.data

  try {
    // 1. Store in Database (Supabase) if needed
    // const supabase = createClient()
    // await supabase.from('contacts').insert({ ... })

    // 2. Send Notification Email (Resend)
    /*
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Abogados Online Ecuador <noreply@abogadosonlineecuador.com>',
      replyTo: email, // El usuario que escribe
      to: process.env.EMAIL_REPLY_TO || 'info@abogadosonlineecuador.com',
      subject: `Nuevo contacto: ${serviceType}`,
      html: `
        <h1>Nuevo mensaje de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
        <p><strong>Servicio:</strong> ${serviceType}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    })
    */

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      success: false,
      message: 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.',
    }
  }
}
