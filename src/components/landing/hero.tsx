'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Bot, Calculator, Calendar, FileCheck2, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------------------------------
   Hero visual - legal automation flow
   ---------------------------------------------------------------- */
interface FlowStep {
  title: string
  detail: string
  icon: LucideIcon
  delay: number
}

const flowSteps: FlowStep[] = [
  {
    title: 'Datos y validacion inicial',
    detail: 'La plataforma verifica cedula, placa y campos obligatorios.',
    icon: Bot,
    delay: 0.1,
  },
  {
    title: 'Revision legal automatizada',
    detail: 'Reglas notariales se aplican de forma inmediata y consistente.',
    icon: ShieldCheck,
    delay: 0.2,
  },
  {
    title: 'Contrato listo para firma',
    detail: 'Documento final en minutos, listo para presentar en notaria.',
    icon: FileCheck2,
    delay: 0.3,
  },
]

function AutomationFlowVisual() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute -inset-8 bg-accent-primary/10 blur-3xl rounded-full" />
      <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-cyan-300/30 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative rounded-3xl bg-white/80 border border-white/70 backdrop-blur-xl shadow-2xl shadow-accent-primary/10 p-5 sm:p-6 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-primary/10 to-transparent" />

        <div className="relative rounded-2xl border border-slate-200 bg-white/90 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <p className="text-sm font-semibold text-slate-800">Motor de Automatizacion Legal</p>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">En vivo</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[1.35rem] top-6 bottom-6 w-px bg-gradient-to-b from-accent-primary/20 via-accent-primary/60 to-accent-primary/20" />

            <motion.div
              className="absolute left-[1.05rem] top-6 h-3 w-3 rounded-full bg-accent-primary shadow-[0_0_0_6px_rgba(2,64,137,0.16)]"
              animate={{ y: [0, 79, 158, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="space-y-3">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: step.delay }}
                  className="relative pl-11"
                >
                  <div className="absolute left-0 top-5 h-7 w-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-accent-primary shadow-sm">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/75 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{step.detail}</p>
                  </div>
                  {index < flowSteps.length - 1 ? <div className="h-0.5" /> : null}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950"
          >
            <div className="relative h-36 sm:h-40">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"
                alt="Automatizacion de documentos legales"
                className="h-full w-full object-cover opacity-80"
              />
              <motion.div
                className="absolute inset-x-0 h-px bg-cyan-200/80"
                animate={{ y: [0, 160, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-300">Salida del proceso</p>
                  <p className="text-sm font-semibold text-white">Contrato listo para firma</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-300/20">
                  Validado
                </span>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
              <p className="text-[10px] text-slate-500">Tiempo medio</p>
              <p className="text-sm font-semibold text-slate-900">6 min</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
              <p className="text-[10px] text-slate-500">Revision</p>
              <p className="text-sm font-semibold text-slate-900">100%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2">
              <p className="text-[10px] text-slate-500">Disponibilidad</p>
              <p className="text-sm font-semibold text-slate-900">24/7</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ----------------------------------------------------------------
   Hero Section
   ---------------------------------------------------------------- */
export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 50% at 18% 8%, rgba(2,64,137,0.13) 0%, transparent 68%), radial-gradient(ellipse 50% 42% at 84% 72%, rgba(15,23,42,0.08) 0%, transparent 70%), linear-gradient(165deg, #f8fbff 0%, #eef3fa 46%, #ffffff 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="absolute top-20 left-[12%] h-72 w-72 rounded-full bg-accent-primary/[0.1] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-16 right-[12%] h-64 w-64 rounded-full bg-cyan-400/[0.09] blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-slate-200 shadow-sm mb-8 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success/75 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-success" />
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Automatizacion legal con respaldo notarial
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6"
            >
              Convierte tramites legales en{' '}
              <span className="bg-gradient-to-r from-accent-primary to-accent-primary-hover bg-clip-text text-transparent">
                procesos automaticos y claros
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed max-w-lg mb-10"
            >
              Activa flujos que validan requisitos, calculan valores notariales y
              generan contratos listos para firma. Menos friccion para tu cliente,
              mas control para tu operacion legal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/servicios">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Ver Servicios
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/calculadoras">
                <Button
                  size="lg"
                  className="bg-accent-primary hover:bg-accent-primary-hover text-white shadow-lg shadow-accent-primary/25"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Costos
                  <Badge variant="info" size="sm" className="ml-2 border-none">
                    Gratis
                  </Badge>
                </Button>
              </Link>
              <Link href="/contacto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-text-secondary hover:text-text-primary hover:bg-slate-100"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
            <AutomationFlowVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
