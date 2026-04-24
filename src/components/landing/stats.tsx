'use client'

import { motion } from 'framer-motion'
import { Clock, Headphones, ShieldCheck, Users } from 'lucide-react'
import { useAnimatedCounter } from '@/hooks/use-animated-counter'
import type { LucideIcon } from 'lucide-react'

interface StatItem {
  value: number
  suffix: string
  label: string
  icon: LucideIcon
  gradient: string
}

const stats: StatItem[] = [
  {
    value: 200,
    suffix: '+',
    label: 'Usuarios y clientes orientados',
    icon: Users,
    gradient: 'from-blue-600/20 to-indigo-600/20',
  },
  {
    value: 12,
    suffix: '+',
    label: 'Años de experiencia',
    icon: Clock,
    gradient: 'from-slate-600/20 to-gray-600/20',
  },
  {
    value: 2,
    suffix: '',
    label: 'Rutas legales principales',
    icon: ShieldCheck,
    gradient: 'from-rose-500/20 to-blue-500/20',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Atención online',
    icon: Headphones,
    gradient: 'from-sky-500/20 to-blue-500/20',
  },
]

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { ref, displayValue, isInView } = useAnimatedCounter({
    value: stat.value,
    duration: 2,
  })

  const Icon = stat.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="relative"
    >
      <div className="flex flex-col items-center rounded-[var(--radius-md)] border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:p-8">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br ${stat.gradient}`}
        >
          <Icon className="h-6 w-6 text-indigo-700" />
        </div>

        <div className="mb-1 text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
          {isInView ? (
            <>
              <motion.span>{displayValue}</motion.span>
              <span>{stat.suffix}</span>
            </>
          ) : (
            <span>0{stat.suffix}</span>
          )}
        </div>

        <div className="text-sm font-medium text-slate-600">{stat.label}</div>
      </div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="hidden border-y border-slate-100 bg-slate-50/70 px-4 py-16 sm:px-6 md:block">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Respaldo para decisiones legales criticas
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            Notaría digital, calculadoras jurídicas y negociación de deudas bajo una misma plataforma.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
