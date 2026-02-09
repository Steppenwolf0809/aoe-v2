'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Car,
  Handshake,
  Scale,
  Home,
  Plane,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   Service definitions — 6 cards per PROMPT 06
   ---------------------------------------------------------------- */
const services = [
  {
    title: 'Generación de Documentos',
    description:
      'Genera contratos y documentos legales personalizados en minutos. Válidos para uso notarial en Ecuador.',
    icon: FileText,
    gradient: 'from-blue-600/20 to-indigo-600/20',
    href: '/servicios',
  },
  {
    title: 'Compraventas',
    description:
      'Contratos de compra-venta vehicular y de bienes. Incluye todas las cláusulas legales necesarias.',
    icon: Car,
    gradient: 'from-slate-600/20 to-gray-600/20',
    href: '/servicios',
  },
  {
    title: 'Promesas de Compraventa',
    description:
      'Promesas de compra-venta de inmuebles con cláusulas de garantía y condiciones suspensivas.',
    icon: Handshake,
    gradient: 'from-indigo-500/20 to-blue-500/20',
    href: '/servicios',
  },
  {
    title: 'Poderes',
    description:
      'Poderes generales y especiales para representación legal, trámites vehiculares y más.',
    icon: Scale,
    gradient: 'from-slate-500/20 to-zinc-500/20',
    href: '/servicios',
  },
  {
    title: 'Posesiones Efectivas',
    description:
      'Trámite de posesión efectiva de bienes hereditarios. Asesoría completa del proceso.',
    icon: Home,
    gradient: 'from-blue-500/20 to-slate-500/20',
    href: '/servicios',
  },
  {
    title: 'Salidas del País',
    description:
      'Autorizaciones de viaje para menores de edad. Documento notarial con validez migratoria.',
    icon: Plane,
    gradient: 'from-sky-600/20 to-blue-600/20',
    href: '/servicios',
  },
]

/* ----------------------------------------------------------------
   Stagger variants for viewport animation
   ---------------------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

/* ----------------------------------------------------------------
   Features / Servicios Section
   ---------------------------------------------------------------- */
export function Features() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#024089] relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Soluciones Legales a su Alcance
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para tus trámites legales en un solo lugar.
            Servicio profesional con respaldo de 12+ años de experiencia.
          </p>
        </motion.div>

        {/* Cards grid — 3 cols on lg, 2 on md, 1 on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.title} variants={cardVariants}>
                <Link href={service.href} className="block h-full">
                  <Card className="h-full p-6 bg-white/5 border-white/10 backdrop-blur-sm shadow-sm hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    {/* Ambient gradient blob */}
                    <div
                      className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <CardContent className="p-0 relative z-10">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-200">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-blue-100 leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Link indicator */}
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
                        Saber más
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/servicios">
            <Button variant="outline" size="lg" className="border-blue-300 text-blue-100 hover:bg-white hover:text-blue-900 border-opacity-50 hover:border-opacity-100">
              Ver todos nuestros servicios
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
