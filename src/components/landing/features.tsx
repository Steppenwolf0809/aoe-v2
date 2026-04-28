'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calculator,
  Car,
  CheckCircle2,
  FileText,
  Gauge,
  Handshake,
  Home,
  PenLine,
  ShieldAlert,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const entryCards = [
  {
    title: 'Calcular costos legales',
    eyebrow: 'Calculadoras',
    description:
      'Empieza por una referencia clara antes de comprar, vender, firmar o iniciar un tramite.',
    href: '/calculadoras',
    cta: 'Ver calculadoras',
    icon: Calculator,
    tone: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    button: 'border-cyan-200 bg-white text-slate-950 hover:bg-cyan-50',
    featured: false,
    items: [
      'Presupuestador inmobiliario',
      'Notaria, alcabalas y registro',
      'Plusvalia y vehiculos',
    ],
  },
  {
    title: 'Negociar una deuda',
    eyebrow: 'Riesgo y estrategia',
    description:
      'Mide riesgo, ordena documentos y prepara una estrategia antes de aceptar acuerdos o refinanciaciones.',
    href: '#evaluador-deudas',
    cta: 'Empezar evaluacion',
    icon: ShieldAlert,
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
    button: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100',
    featured: true,
    items: [
      'Cobranza, mora o demanda',
      'Pagare, contrato o estado de cuenta',
      'Propuesta antes de firmar',
    ],
  },
  {
    title: 'Generar documentos legales',
    eyebrow: 'Generadores',
    description:
      'Crea documentos guiados y prepara nuevos actos como contratos, poderes, minutas y promesas.',
    href: '/contratos/vehicular',
    cta: 'Generar contrato',
    icon: PenLine,
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
    button: 'border-blue-200 bg-white text-slate-950 hover:bg-blue-50',
    featured: false,
    items: [
      'Contrato vehicular disponible',
      'Poderes y minutas en expansion',
      'Promesas y acuerdos de pago',
    ],
  },
] as const

const quickLinks = [
  {
    label: 'Transferencia de dominio',
    href: '/calculadoras/inmuebles',
    icon: Home,
  },
  {
    label: 'Evaluador de deuda',
    href: '#evaluador-deudas',
    icon: Handshake,
  },
  {
    label: 'Contrato vehicular',
    href: '/contratos/vehicular',
    icon: Car,
  },
  {
    label: 'Tramites notariales',
    href: '/servicios',
    icon: FileText,
  },
] as const

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

function DebtSignal() {
  return (
    <div className="mt-6 rounded-2xl border border-rose-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Riesgo preliminar
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-950">Medio / Alto</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Gauge className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-amber-300 via-rose-400 to-rose-500" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Antes del WhatsApp, el evaluador captura datos clave y genera un pre-diagnostico.
      </p>
    </div>
  )
}

export function Features() {
  return (
    <section id="servicios-principales" className="relative overflow-hidden bg-[#f6f8fb] px-4 py-20 sm:px-6 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-cyan-100/55 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-cyan-600" />
            Acceso rapido a servicios principales
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.025em] text-slate-950 sm:text-5xl">
            Que necesitas resolver hoy?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            La plataforma no empieza con una lista de servicios: te lleva al camino correcto
            segun si necesitas calcular, negociar o generar un documento legal.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          {entryCards.map((card) => {
            const Icon = card.icon

            return (
              <motion.div key={card.title} variants={cardVariants}>
                <Card
                  className={`h-full overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    card.featured ? 'ring-1 ring-rose-200' : ''
                  }`}
                >
                  <CardContent className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${card.tone}`}>
                        <Icon className="h-4 w-4" />
                        {card.eyebrow}
                      </div>
                      {card.featured && (
                        <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700">
                          Prioritario
                        </span>
                      )}
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.description}</p>

                    {card.featured && <DebtSignal />}

                    <div className="mt-6 space-y-3">
                      {card.items.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={card.href}
                      className={`mt-7 inline-flex min-h-11 h-auto w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${card.button}`}
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-8 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-3 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{link.label}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
