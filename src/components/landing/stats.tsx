'use client'

import { motion } from 'framer-motion'
import { Users, Clock, UserCheck, Headphones } from 'lucide-react'
import { useAnimatedCounter } from '@/hooks/use-animated-counter'
import type { LucideIcon } from 'lucide-react'

/* ----------------------------------------------------------------
   Stat data — matches PROMPT 07 spec
   ---------------------------------------------------------------- */
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
    label: 'Clientes Satisfechos',
    icon: Users,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    value: 12,
    suffix: '+',
    label: 'Años de Experiencia',
    icon: Clock,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    value: 5,
    suffix: '+',
    label: 'Profesionales',
    icon: UserCheck,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Atención Online',
    icon: Headphones,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
]

/* ----------------------------------------------------------------
   Individual stat card with animated counter
   ---------------------------------------------------------------- */
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
      className="relative group"
    >
      <div className="flex flex-col items-center text-center rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Animated counter */}
        <div className="text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">
          {isInView ? (
            <>
              <motion.span>{displayValue}</motion.span>
              <span>{stat.suffix}</span>
            </>
          ) : (
            <span>0{stat.suffix}</span>
          )}
        </div>

        {/* Label */}
        <div className="text-sm text-text-muted">{stat.label}</div>
      </div>
    </motion.div>
  )
}

/* ----------------------------------------------------------------
   Stats Section
   ---------------------------------------------------------------- */
export function Stats() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 border-y border-white/[0.05] bg-bg-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nuestros Números
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Respaldados por años de experiencia legal y cientos de clientes satisfechos.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
