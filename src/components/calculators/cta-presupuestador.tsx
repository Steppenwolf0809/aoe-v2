'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Home, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CtaPresupuestadorProps {
  /** What cost is missing, shown in the message */
  costoActual: string
  /** What other costs are missing */
  costosFaltantes: string[]
  className?: string
}

/**
 * CTA Banner that funnels users from individual calculators
 * to the main Presupuestador Inmobiliario page.
 *
 * SEO Strategy: Each calculator is an entry point that pushes
 * to /calculadoras/inmuebles for the total cost + lead capture.
 */
export function CtaPresupuestador({
  costoActual,
  costosFaltantes,
  className,
}: CtaPresupuestadorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn('mt-6', className)}
    >
      <Link href="/calculadoras/inmuebles" className="block group">
        <div className="relative overflow-hidden rounded-xl border border-accent-primary/30 bg-gradient-to-br from-accent-primary/15 via-accent-primary/5 to-transparent p-5 hover:border-accent-primary/50 transition-all duration-300">
          {/* Ambient glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors" />

          <div className="relative z-10">
            {/* Alert icon + heading */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm leading-snug">
                  Este es solo el costo de {costoActual}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Tu trámite inmobiliario también incluye:
                </p>
              </div>
            </div>

            {/* Missing costs */}
            <div className="flex flex-wrap gap-2 mb-4 ml-12">
              {costosFaltantes.map((costo) => (
                <span
                  key={costo}
                  className="inline-flex items-center px-2.5 py-1 bg-bg-secondary/80 border border-[var(--glass-border)] rounded-md text-xs text-[var(--text-secondary)]"
                >
                  + {costo}
                </span>
              ))}
            </div>

            {/* CTA link */}
            <div className="flex items-center gap-2 ml-12">
              <Home className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-accent-primary group-hover:underline">
                Calcular el costo TOTAL de mi trámite
              </span>
              <ArrowRight className="w-4 h-4 text-accent-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
