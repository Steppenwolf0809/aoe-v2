'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Car,
  CheckCircle2,
  FileCheck2,
  Files,
  Handshake,
  Home,
  LockKeyhole,
  PenLine,
  Scale,
  ShieldAlert,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SLIDE_INTERVAL_MS = 4000

type SlideTone = 'cyan' | 'rose' | 'blue' | 'amber'

type HeroSlide = {
  id: 'inmueble' | 'deuda' | 'vehiculo' | 'documentos'
  label: string
  eyebrow: string
  title: string
  amountLabel: string
  amount: string
  summary: string
  status: string
  nextAction: string
  cta: string
  href: string
  icon: LucideIcon
  accentIcon: LucideIcon
  tone: SlideTone
  checklist: string[]
  metrics: { label: string; value: string }[]
}

const toneStyles: Record<
  SlideTone,
  {
    tab: string
    glow: string
    card: string
    button: string
    metric: string
    line: string
  }
> = {
  cyan: {
    tab: 'border-cyan-300/40 bg-cyan-300/15 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.22)]',
    glow: 'from-cyan-300/35 via-cyan-500/10',
    card: 'border-cyan-200/25 bg-cyan-300/[0.08]',
    button: 'bg-cyan-300 text-slate-950 hover:bg-cyan-200',
    metric: 'text-cyan-100',
    line: 'bg-cyan-300',
  },
  rose: {
    tab: 'border-rose-300/40 bg-rose-300/15 text-rose-50 shadow-[0_0_24px_rgba(251,113,133,0.18)]',
    glow: 'from-rose-300/28 via-rose-500/10',
    card: 'border-rose-200/25 bg-rose-300/[0.08]',
    button: 'bg-rose-400 text-white hover:bg-rose-300',
    metric: 'text-rose-100',
    line: 'bg-rose-300',
  },
  blue: {
    tab: 'border-blue-300/40 bg-blue-300/15 text-blue-50 shadow-[0_0_24px_rgba(96,165,250,0.18)]',
    glow: 'from-blue-300/30 via-blue-500/10',
    card: 'border-blue-200/25 bg-blue-300/[0.08]',
    button: 'bg-blue-400 text-white hover:bg-blue-300',
    metric: 'text-blue-100',
    line: 'bg-blue-300',
  },
  amber: {
    tab: 'border-amber-300/40 bg-amber-300/15 text-amber-50 shadow-[0_0_24px_rgba(252,211,77,0.14)]',
    glow: 'from-amber-300/24 via-amber-500/10',
    card: 'border-amber-200/25 bg-amber-300/[0.08]',
    button: 'bg-amber-300 text-slate-950 hover:bg-amber-200',
    metric: 'text-amber-100',
    line: 'bg-amber-300',
  },
}

const slides: HeroSlide[] = [
  {
    id: 'inmueble',
    label: 'Inmueble',
    eyebrow: 'Transferencia de dominio',
    title: 'Compra/venta de inmueble',
    amountLabel: 'Valor referencial',
    amount: 'USD 120.000',
    summary:
      'Calcula notaria, alcabala, registro, consejo provincial y plusvalia antes de firmar.',
    status: 'Costo total en preparacion',
    nextAction: 'Calcula el presupuesto total y revisa documentos clave antes de avanzar.',
    cta: 'Calcular transferencia',
    href: '/calculadoras/inmuebles',
    icon: Home,
    accentIcon: Building2,
    tone: 'cyan',
    checklist: ['Gravamenes', 'Predio', 'Cedulas', 'Minuta'],
    metrics: [
      { label: 'Tiempo estimado', value: '10 min' },
      { label: 'Riesgo inicial', value: 'Medio' },
    ],
  },
  {
    id: 'deuda',
    label: 'Deuda',
    eyebrow: 'Evaluacion y negociacion',
    title: 'Deuda vencida con estrategia',
    amountLabel: 'Monto vencido',
    amount: 'USD 8.450',
    summary:
      'Ordena el caso, mide riesgo y prepara una propuesta antes de responder cobranza.',
    status: 'Plan de negociacion',
    nextAction: 'Evalua documentos, capacidad de pago y posibles escenarios de acuerdo.',
    cta: 'Negociar deuda',
    href: '#evaluador-deudas',
    icon: ShieldAlert,
    accentIcon: Handshake,
    tone: 'rose',
    checklist: ['Contrato o pagare', 'Estado de cuenta', 'Notificaciones', 'Capacidad de pago'],
    metrics: [
      { label: 'Riesgo estimado', value: 'Alto' },
      { label: 'Ruta sugerida', value: 'Acuerdo' },
    ],
  },
  {
    id: 'vehiculo',
    label: 'Vehiculo',
    eyebrow: 'Contrato y transferencia',
    title: 'Compraventa vehicular',
    amountLabel: 'Documento',
    amount: 'Listo para generar',
    summary:
      'Prepara comprador, vendedor, placa, CUV, forma de pago y clausulas principales.',
    status: 'Generador disponible',
    nextAction: 'Genera el contrato con datos completos y listo para revision legal.',
    cta: 'Generar contrato',
    href: '/contratos/vehicular',
    icon: Car,
    accentIcon: FileCheck2,
    tone: 'blue',
    checklist: ['Placa/CUV', 'Matricula', 'Cedulas', 'Pago'],
    metrics: [
      { label: 'Campos guiados', value: '24' },
      { label: 'Salida', value: 'Contrato' },
    ],
  },
  {
    id: 'documentos',
    label: 'Documentos',
    eyebrow: 'Minutas y contratos',
    title: 'Documentos legales guiados',
    amountLabel: 'Categoria',
    amount: 'En expansion',
    summary:
      'Explora documentos para tramites frecuentes con requisitos, datos y ruta de revision.',
    status: 'Ruta documental',
    nextAction: 'Elige el tramite, revisa requisitos y prepara la informacion necesaria.',
    cta: 'Ver servicios',
    href: '/servicios',
    icon: Files,
    accentIcon: PenLine,
    tone: 'amber',
    checklist: ['Partes', 'Acto', 'Clausulas', 'Requisitos'],
    metrics: [
      { label: 'Formatos', value: 'Guiados' },
      { label: 'Revision', value: 'Legal' },
    ],
  },
]

const primaryActions = [
  { label: 'Calcular mi tramite', href: '/calculadoras', icon: Calculator },
  { label: 'Negociar deuda', href: '#evaluador-deudas', icon: ShieldAlert },
  { label: 'Generar contrato', href: '/contratos/vehicular', icon: FileCheck2 },
] as const

const trustItems = [
  { title: 'Respaldo legal', detail: 'Normativa ecuatoriana', icon: BadgeCheck },
  { title: 'Seguro y confidencial', detail: 'Datos protegidos', icon: LockKeyhole },
  { title: 'Rapido y confiable', detail: 'Resultado al instante', icon: Zap },
] as const

function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [])

  const controls = useMemo(
    () => ({
      previous: () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length),
      next: () => setActiveIndex((current) => (current + 1) % slides.length),
      select: (index: number) => setActiveIndex(index),
    }),
    []
  )

  return { activeIndex, controls }
}

function FloatingCaseCard({
  slide,
  side,
}: {
  slide: HeroSlide
  side: 'left' | 'right'
}) {
  const Icon = slide.icon
  const tone = toneStyles[slide.tone]

  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: side === 'left' ? [0, -10, 0] : [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className={cn(
        'pointer-events-none absolute top-[31%] hidden w-32 rounded-2xl border bg-slate-950/70 p-3 text-left shadow-2xl shadow-black/40 backdrop-blur-xl xl:block',
        side === 'left' ? '-left-10 rotate-[-7deg]' : '-right-10 rotate-[8deg]',
        tone.card
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
          {slide.label}
        </p>
        <Icon className={cn('h-4 w-4', tone.metric)} />
      </div>
      <p className="text-xs font-semibold leading-snug text-white">{slide.title}</p>
      <p className={cn('mt-3 font-mono text-xs font-semibold', tone.metric)}>{slide.amount}</p>
    </motion.div>
  )
}

function HeroDashboard() {
  const { activeIndex, controls } = useCarousel()
  const activeSlide = slides[activeIndex]
  const ActiveIcon = activeSlide.icon
  const AccentIcon = activeSlide.accentIcon
  const tone = toneStyles[activeSlide.tone]

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none lg:pl-10 xl:pl-14">
      <div className="absolute inset-x-8 bottom-6 h-10 rounded-full bg-cyan-300/40 blur-2xl" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 sm:h-[520px] sm:w-[520px]" aria-hidden="true" />
      <div className="absolute left-8 right-4 bottom-10 hidden h-20 rounded-[50%] border border-cyan-300/20 bg-slate-950/70 shadow-[0_0_44px_rgba(34,211,238,0.35)] lg:block" aria-hidden="true" />
      <FloatingCaseCard slide={slides[(activeIndex + 1) % slides.length]} side="left" />
      <FloatingCaseCard slide={slides[(activeIndex + 3) % slides.length]} side="right" />

      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hero-dashboard-shell relative overflow-hidden rounded-[22px] border border-white/15 bg-slate-950/75 p-2.5 shadow-[0_34px_130px_-70px_rgba(34,211,238,0.75),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl sm:p-3"
        style={{
          backgroundColor: 'rgba(2, 6, 23, 0.84)',
        }}
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              activeSlide.tone === 'rose'
                ? 'radial-gradient(circle at 20% 10%, rgba(251,113,133,0.28), rgba(251,113,133,0.08) 28%, transparent 58%)'
                : activeSlide.tone === 'blue'
                  ? 'radial-gradient(circle at 20% 10%, rgba(96,165,250,0.3), rgba(96,165,250,0.08) 28%, transparent 58%)'
                  : activeSlide.tone === 'amber'
                    ? 'radial-gradient(circle at 20% 10%, rgba(252,211,77,0.24), rgba(252,211,77,0.07) 28%, transparent 58%)'
                    : 'radial-gradient(circle at 20% 10%, rgba(34,211,238,0.35), rgba(34,211,238,0.1) 28%, transparent 58%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
          aria-hidden="true"
        />

        <div
          className="relative rounded-[19px] border border-white/10 bg-slate-950/80"
          style={{ backgroundColor: 'rgba(8, 17, 32, 0.86)' }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
                <Scale className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold uppercase tracking-[0.28em] text-white">
                  Centro legal inteligente
                </p>
                <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
                  Costos, riesgos, documentos y accion
                </p>
              </div>
            </div>
            <span className="hidden rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-200 sm:inline-flex">
              ACTIVO
            </span>
          </div>

          <div className="border-b border-white/10 px-3 py-2.5 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Servicios principales">
              {slides.map((slide, index) => {
                const Icon = slide.icon
                const isActive = slide.id === activeSlide.id

                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => controls.select(index)}
                    className={cn(
                      'inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition sm:text-sm',
                      isActive
                        ? toneStyles[slide.tone].tab
                        : 'border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/18 hover:bg-white/[0.07] hover:text-slate-100'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {slide.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 16, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="grid gap-3 md:grid-cols-2"
              >
                <div className={cn('rounded-2xl border p-3.5', tone.card)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-300">
                        {activeSlide.eyebrow}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold leading-tight text-white sm:text-xl">
                        {activeSlide.title}
                      </h2>
                    </div>
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white">
                      <AccentIcon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <p className="text-sm text-slate-300">{activeSlide.amountLabel}</p>
                      <p className={cn('mt-1 font-mono text-xl font-semibold sm:text-2xl', tone.metric)}>
                        {activeSlide.amount}
                      </p>
                    </div>
                    <span className="w-fit rounded-2xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-medium leading-relaxed text-slate-200">
                      {activeSlide.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-300 sm:text-sm">{activeSlide.summary}</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {activeSlide.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-xl border border-white/10 bg-slate-950/35 p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                          {metric.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3.5">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Documentos clave
                    </p>
                    <div className="mt-4 space-y-3">
                      {activeSlide.checklist.map((item) => (
                        <div key={item} className="flex min-w-0 items-center gap-3 text-sm text-slate-200">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-200" />
                          <span className="min-w-0 break-words">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/8 text-slate-100">
                        <ActiveIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Siguiente accion
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-200 sm:text-sm">{activeSlide.nextAction}</p>
                      </div>
                    </div>

                    <Button
                      asChild
                      size="md"
                      className={cn('mt-3 min-h-10 h-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-none', tone.button)}
                    >
                      <Link href={activeSlide.href}>
                        {activeSlide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="relative mt-3 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Servicio anterior"
          onClick={controls.previous}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition hover:border-cyan-200/35 hover:bg-cyan-300/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Ver ${slide.label}`}
              onClick={() => controls.select(index)}
              className={cn(
                'h-2.5 rounded-full transition-all',
                index === activeIndex ? 'w-8 bg-cyan-300' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Servicio siguiente"
          onClick={controls.next}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition hover:border-cyan-200/35 hover:bg-cyan-300/10 hover:text-white"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ backgroundColor: '#050914' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% 18%, rgba(34,211,238,0.22), transparent 28%), radial-gradient(circle at 82% 8%, rgba(59,130,246,0.18), transparent 24%), linear-gradient(180deg, #050914 0%, #08111f 58%, #050914 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-7 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/[0.08] px-4 py-2 text-sm font-medium text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">Plataforma legal inteligente en Ecuador</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold leading-none tracking-normal text-white sm:text-5xl lg:text-[3.6rem] xl:text-[4.15rem]">
            Calcula, diagnostica y resuelve tus tramites legales{' '}
            <span className="text-cyan-300">importantes.</span>
          </h1>

          <div className="mt-5 h-0.5 w-16 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Calcula transferencias de dominio, evalua deudas vencidas, genera contratos y
            prepara tramites notariales con respaldo legal en Ecuador.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {primaryActions.map((action, index) => {
              const Icon = action.icon

              return (
                <Button
                  key={action.label}
                  asChild
                  size="lg"
                  variant={index === 0 ? 'primary' : 'outline'}
                  className={cn(
                    'min-h-12 h-auto justify-between rounded-xl border px-5 py-3 text-sm shadow-none xl:text-base',
                    index === 0
                      ? 'border-cyan-200/25 bg-cyan-300 text-slate-950 hover:bg-cyan-200'
                      : 'border-white/15 bg-white/[0.045] text-white hover:bg-white/[0.08]',
                    index === 2 && 'sm:col-span-1'
                  )}
                >
                  <Link href={action.href}>
                    <span className="inline-flex min-w-0 items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0" />
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="mt-6 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-2 backdrop-blur-xl sm:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.title} className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-cyan-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                    <p className="truncate text-xs text-slate-400">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <HeroDashboard />
      </div>
    </section>
  )
}
