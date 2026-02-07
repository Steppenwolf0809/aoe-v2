'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function CalculatorPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Calculadoras Legales Gratuitas
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-6">
              Conoce los costos exactos de tus tramites notariales antes de ir a la notaria.
              Nuestras calculadoras son precisas y actualizadas.
            </p>
            <Link href="/calculadoras">
              <Button variant="glass">
                Probar Calculadoras
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Avaluo catastral</span>
                  <span className="text-sm font-semibold text-white">$50,000.00</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10">
                  <div className="w-1/2 h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">Arancel Notarial</div>
                    <div className="text-lg font-bold text-white">$245.00</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">Registro</div>
                    <div className="text-lg font-bold text-white">$180.00</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
