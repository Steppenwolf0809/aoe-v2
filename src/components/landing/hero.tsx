'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------------------------------
   Animated document visual — abstract contract assembling itself
   ---------------------------------------------------------------- */
function DocumentVisual() {
  return (
    <div className="relative w-full max-w-sm mx-auto perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateY: [-5, 5, -5],
          rotateX: [2, -2, 2],
          y: [-10, 10, -10]
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.5 },
          scale: { duration: 0.8, delay: 0.5 },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Outer glow */}
        <div className="absolute -inset-8 bg-accent-primary/5 rounded-full blur-[60px] translate-z-[-20px]" />

        {/* Document card - Light mode compliant */}
        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-glass-lg overflow-hidden translate-z-[10px]">
          {/* Document header bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="w-3 h-3 rounded-full bg-accent-error/60" />
            <div className="w-3 h-3 rounded-full bg-accent-warning/60" />
            <div className="w-3 h-3 rounded-full bg-accent-success/60" />
            <span className="ml-2 text-xs text-text-muted">contrato-compraventa.pdf</span>
          </div>

          {/* Document content lines — animate in staggered */}
          <div className="p-5 space-y-3">
            {/* Title line */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="h-4 w-3/4 rounded bg-gradient-to-r from-accent-primary/20 to-accent-primary/5"
            />

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="h-3 w-1/2 rounded bg-slate-100"
            />

            {/* Separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="h-px bg-slate-100 origin-left"
            />

            {/* Content lines */}
            {[0.6, 0.85, 0.7, 0.9, 0.55, 0.8].map((width, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.3 }}
                className="h-2.5 rounded bg-slate-100"
                style={{ width: `${width * 100}%` }}
              />
            ))}

            {/* Signature area */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.4 }}
              className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between"
            >
              <div className="space-y-1">
                <div className="h-2 w-20 rounded bg-slate-100" />
                <div className="h-px w-28 bg-accent-primary/20" />
                <div className="text-[10px] text-text-muted">Vendedor</div>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-20 rounded bg-slate-100" />
                <div className="h-px w-28 bg-accent-secondary/20" />
                <div className="text-[10px] text-text-muted">Comprador</div>
              </div>
            </motion.div>

            {/* Checkmark seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, type: 'spring', stiffness: 200, damping: 15 }}
              className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-accent-success/10 border border-accent-success/20 flex items-center justify-center backdrop-blur-sm shadow-sm"
            >
              <svg className="w-7 h-7 text-accent-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
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
      {/* Background — deep gradient with ambient orbs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(2,64,137,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(15,23,42,0.03) 0%, transparent 50%), var(--bg-primary)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Ambient light orbs */}
      <div className="absolute top-1/4 left-[16%] w-80 h-80 bg-accent-primary/[0.08] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[16%] w-64 h-64 bg-accent-secondary/[0.05] rounded-full blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success/75 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-success" />
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Plataforma legal digital de confianza
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6"
            >
              Tus trámites legales,{' '}
              <span className="bg-gradient-to-r from-accent-primary to-accent-primary-hover bg-clip-text text-transparent">
                desde donde estés
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed max-w-lg mb-10"
            >
              Genera contratos vehiculares válidos legalmente, calcula costos
              notariales y simplifica tus trámites legales con tecnología
              moderna. Rápido, seguro y confiable.
            </motion.p>

            {/* CTAs — 3 buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/servicios">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Ver Servicios
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/calculadoras">
                <Button size="lg" className="bg-accent-primary hover:bg-accent-primary-hover text-white shadow-lg shadow-accent-primary/25">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Costos
                  <Badge variant="info" size="sm" className="ml-2 border-none">
                    Gratis
                  </Badge>
                </Button>
              </Link>
              <Link href="/contacto">
                <Button size="lg" variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-slate-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-200"
            >
              {[
                { value: '500+', label: 'Clientes' },
                { value: '12+', label: 'Años exp.' },
                { value: '24/7', label: 'Disponible' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-muted">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — animated document visual */}
          <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
            <DocumentVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
