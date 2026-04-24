'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calculator,
  FileCheck2,
  Handshake,
  MessageCircleWarning,
  Scale,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const intentGroups = [
  {
    title: 'Resolver una crisis financiera',
    description: 'Para mora, llamadas de cobro, cartas, acuerdos pendientes o riesgo judicial.',
    href: '#evaluador-deudas',
    cta: 'Evaluar mi caso',
    icon: ShieldCheck,
    accent: 'text-rose-600',
    dot: 'bg-rose-600',
    surface: 'border-rose-200 bg-rose-50',
    items: ['Negociación de deuda', 'Blindaje judicial', 'Preparación documental para acuerdo'],
  },
  {
    title: 'Completar un trámite notarial',
    description: 'Para formalizar actos, preparar documentos y llegar con requisitos claros.',
    href: '/servicios',
    cta: 'Iniciar trámite',
    icon: FileCheck2,
    accent: 'text-blue-700',
    dot: 'bg-blue-700',
    surface: 'border-blue-200 bg-blue-50',
    items: ['Escrituras', 'Poderes', 'Certificaciones', 'Contratos'],
  },
  {
    title: 'Calcular, aprender o prepararte',
    description: 'Para estimar costos, comparar escenarios y tomar decisiones con menos friccion.',
    href: '/calculadoras',
    cta: 'Calcular ahora',
    icon: Calculator,
    accent: 'text-emerald-700',
    dot: 'bg-emerald-700',
    surface: 'border-emerald-200 bg-emerald-50',
    items: ['Calculadoras notariales', 'Guias legales', 'Presupuestador inmobiliario'],
  },
]

const serviceCards = [
  {
    title: 'Negociación de Deuda',
    description: 'Diagnóstico guiado, estrategia de contención y preparación para negociar con método.',
    icon: Handshake,
    href: '#evaluador-deudas',
  },
  {
    title: 'Tramites Notariales Digitales',
    description: 'Escrituras, poderes, certificaciones y documentos con criterio legal ecuatoriano.',
    icon: FileCheck2,
    href: '/servicios',
  },
  {
    title: 'Calculadora de Escrituras',
    description: 'Referencia de costos notariales e inmobiliarios antes de iniciar el trámite.',
    icon: Calculator,
    href: '/calculadoras/inmuebles',
  },
  {
    title: 'Asesoria Legal Urgente',
    description: 'Orientacion para decisiones sensibles cuando necesitas claridad y siguiente paso.',
    icon: MessageCircleWarning,
    href: '/contacto',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Features() {
  return (
    <section className="relative overflow-hidden bg-[#f5f7fb] px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <Scale className="h-4 w-4 text-slate-500" />
            Soluciones por intencion
          </div>
          <h2 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Elige el camino legal segun lo que necesitas resolver hoy.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            La plataforma separa trámites, deuda y preparación para que no tengas que traducir
            un problema urgente a una lista genérica de servicios.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          {intentGroups.map((group) => {
            const Icon = group.icon

            return (
              <motion.div key={group.title} variants={cardVariants}>
                <Card className={`h-full border ${group.surface} shadow-sm`}>
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-white shadow-sm">
                      <Icon className={`h-6 w-6 ${group.accent}`} />
                    </div>
                    <h3 className="text-xl font-semibold leading-snug text-slate-950">{group.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{group.description}</p>
                    <ul className="mt-6 space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${group.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-7 w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-50">
                      <Link href={group.href}>
                        {group.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {serviceCards.map((service) => {
            const Icon = service.icon

            return (
              <motion.div key={service.title} variants={cardVariants}>
                <Link href={service.href} className="group block h-full">
                  <Card className="h-full border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold leading-snug text-slate-950">{service.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900">
                        Ver opcion
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
