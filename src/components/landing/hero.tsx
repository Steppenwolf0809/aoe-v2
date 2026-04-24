'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  FileCheck2,
  Fingerprint,
  MessageSquareText,
  Route,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const intentCards = [
  {
    eyebrow: 'Ruta notarial',
    title: 'Resolver un trámite',
    description: 'Escrituras, poderes, contratos, requisitos y calculadoras para avanzar sin vueltas.',
    cta: 'Ir a Notaría Digital',
    href: '/servicios',
    icon: FileCheck2,
    tone: 'cyan',
    button: 'bg-sky-300 text-slate-950 hover:bg-sky-200',
  },
  {
    eyebrow: 'Ruta financiera',
    title: 'Contener una deuda',
    description: 'Mora, llamadas, cartas, riesgo de juicio y negociación con blindaje judicial.',
    cta: 'Evaluar mi deuda',
    href: '#evaluador-deudas',
    icon: ShieldCheck,
    tone: 'rose',
    button: 'bg-rose-400 text-white hover:bg-rose-300',
  },
]

const proofPoints = [
  { value: '12 años', label: 'experiencia jurídica' },
  { value: 'EC', label: 'criterio local' },
  { value: 'PDF', label: 'pre-diagnóstico' },
]

function IntentCard({ card }: { card: (typeof intentCards)[number] }) {
  const Icon = card.icon
  const isDebt = card.tone === 'rose'

  return (
    <motion.div
      className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 hover:bg-white/[0.065] sm:p-5"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
    >
      <div
        className={`absolute inset-y-4 left-0 w-1 rounded-r-full ${isDebt ? 'bg-rose-300' : 'bg-sky-300'}`}
        aria-hidden="true"
      />
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            isDebt
              ? 'border-rose-200/20 bg-rose-300/10 text-rose-100'
              : 'border-sky-200/20 bg-sky-300/10 text-sky-100'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {card.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">{card.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
        </div>
      </div>

      <Button
        asChild
        size="md"
        className={`mt-5 min-h-11 h-auto w-full rounded-2xl px-4 py-3 text-sm font-semibold shadow-none transition-transform active:translate-y-px ${card.button}`}
      >
        <Link href={card.href}>
          {card.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  )
}

function LegalSignalPanel() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1020]/90 p-4 shadow-[0_36px_110px_-64px_rgba(15,23,42,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(125,211,252,0.18), transparent 28%), radial-gradient(circle at 82% 4%, rgba(251,113,133,0.14), transparent 30%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
        aria-hidden="true"
      />

      <div className="relative rounded-[22px] border border-white/10 bg-slate-950/65">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Legal OS
            </span>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-slate-400">
            AOE-EC
          </span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_0.82fr]">
          <div className="space-y-3">
            {[
              { label: 'Entrada', value: 'Necesidad legal detectada', icon: Fingerprint },
              { label: 'Ruta', value: 'Notaría o deuda', icon: Route },
              { label: 'Salida', value: 'Documento, estrategia o llamada', icon: MessageSquareText },
            ].map((item, index) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  {index < 2 && (
                    <span className="absolute -bottom-3 left-8 h-3 w-px bg-white/15" aria-hidden="true" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-snug text-white">{item.value}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid content-between gap-3">
            <div className="rounded-2xl border border-sky-200/15 bg-sky-300/10 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-100/70">
                Trámite
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">08m</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">inicio guiado</p>
            </div>
            <div className="rounded-2xl border border-rose-200/15 bg-rose-300/10 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-rose-100/70">
                Deuda
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">15q</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">pre-diagnóstico</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-white/10">
          {proofPoints.map((point) => (
            <div key={point.label} className="border-r border-white/10 p-4 last:border-r-0">
              <p className="text-sm font-semibold text-white">{point.value}</p>
              <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.14em] text-slate-500">
                {point.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#080b13]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(14,165,233,0.18) 0%, rgba(8,11,19,0) 36%), linear-gradient(248deg, rgba(244,63,94,0.15) 0%, rgba(8,11,19,0) 32%), linear-gradient(180deg, #080b13 0%, #0d1324 100%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Sparkles className="h-3.5 w-3.5 text-sky-200" />
            Plataforma legal crítica
            <span className="h-1 w-1 rounded-full bg-slate-500" />
            Ecuador
          </div>

          <h1 className="max-w-3xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Legal OS para trámites y crisis de deuda.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Dos rutas claras: notaría digital para avanzar documentos y negociación de deudas
            con blindaje judicial cuando la presión ya no puede esperar.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="border-white/10 bg-white/10 text-slate-200">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" />
              Ecuador
            </Badge>
            <Badge className="border-white/10 bg-white/10 text-slate-200">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Método jurídico
            </Badge>
            <Badge className="border-white/10 bg-white/10 text-slate-200">
              <Calculator className="mr-1 h-3.5 w-3.5" />
              Calculadoras reales
            </Badge>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {intentCards.map((card) => (
              <IntentCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        <LegalSignalPanel />
      </div>
    </section>
  )
}
