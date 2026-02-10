import { Metadata } from 'next'
import { MapPin, Mail, Phone, Clock, MessageSquare } from 'lucide-react'

import { ContactForm } from '@/components/marketing/contact-form'

export const metadata: Metadata = {
  title: 'Contacto | Abogados Online Ecuador',
  description: 'Contáctanos para asesoría legal en Quito. Trámites notariales, inmobiliarios y societarios. Ubicados en Av. Amazonas y Azuay.',
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen pb-20 pt-24 lg:pt-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left Column: Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Hablemos de tu caso
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg">
                Estamos aquí para simplificar tus trámites legales. Visítanos, llámanos o escríbenos.
              </p>
            </div>

            <div className="grid gap-6">
              <ContactCard
                icon={MapPin}
                title="Visítanos"
                description="Calle Azuay E2-231 y Av. Amazonas"
                details="Quito, Ecuador"
                delay={0.1}
              />
              <ContactCard
                icon={Mail}
                title="Escríbenos"
                description="info@abogadosonlineecuador.com"
                details="Respuesta en menos de 24h"
                delay={0.2}
              />
              <ContactCard
                icon={Phone}
                title="Llámanos"
                description="+593 97 931 7579"
                details="Lunes a Viernes, 9:00 - 18:00"
                delay={0.3}
              />
            </div>

            {/* Map Placeholder or Embed */}
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative bg-slate-100 dark:bg-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.896739988587!2d-78.4891696885376!3d-0.18420300000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a7c6c4c0767%3A0x1d5267866763076!2sCalle%20Azuay%20E2-231%2C%20Quito%20170135!5e0!3m2!1sen!2sec!4v1707500000000!5m2!1sen!2sec"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            {/* Decorative blob behind form */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl -z-10 transform scale-105" />

            <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 p-2 rounded-3xl shadow-2xl">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function ContactCard({ icon: Icon, title, description, details, delay }: any) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{details}</p>
      </div>
    </div>
  )
}
