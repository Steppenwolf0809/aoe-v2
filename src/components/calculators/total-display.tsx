'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'

interface TotalDisplayProps {
  total: number
  label?: string
  sublabel?: string
  disclaimer?: string
  className?: string
}

export function TotalDisplay({
  total,
  label = 'Total estimado para gastos legales',
  sublabel,
  disclaimer = 'Valores referenciales para Quito. Tarifas vigentes al ' +
    new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long' }),
  className,
}: TotalDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className={cn('overflow-hidden', className)}>
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

        <CardContent className="p-6 text-center space-y-4">
          {/* Label */}
          <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">
            {label}
          </p>

          {/* Animated Total */}
          <div className="py-4">
            <span className="text-sm text-[var(--text-muted)]">$</span>
            <AnimatedCounter
              value={total}
              formatAsCurrency={false}
              duration={600}
              className="text-4xl md:text-5xl font-bold text-text-primary tabular-nums"
            />
          </div>

          {/* Sublabel */}
          {sublabel && (
            <p className="text-sm text-[var(--text-secondary)]">{sublabel}</p>
          )}

          {/* Disclaimer */}
          {disclaimer && (
            <div className="flex items-start gap-2 bg-white/[0.03] rounded-lg p-3 text-left">
              <AlertTriangle className="w-4 h-4 text-accent-warning shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {disclaimer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
