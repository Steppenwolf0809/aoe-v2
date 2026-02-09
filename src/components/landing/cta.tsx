'use client'

import { motion } from 'framer-motion'
import { Calculator, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------------------------------
   CTA Final Section — per PROMPT 07 spec
   "¿Listo para simplificar sus trámites legales?"
   Buttons: "Calcular Costos" + "Contactar Ahora"
   ---------------------------------------------------------------- */
export function CTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)]"
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 0%, rgba(139,92,246,0.06) 0%, transparent 50%), var(--bg-secondary)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-5 leading-tight">
              ¿Listo para simplificar sus trámites legales?
            </h2>
            <p className="text-text-secondary text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Calcula tus costos notariales en segundos o habla con nuestro equipo de asesores legales.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calculadoras">
                <Button size="lg">
                  <Calculator className="w-5 h-5" />
                  Calcular Costos
                  <Badge variant="success" size="sm" className="ml-1">
                    Gratis
                  </Badge>
                </Button>
              </Link>
              <Link href="/contacto">
                <Button variant="outline" size="lg">
                  <MessageCircle className="w-5 h-5" />
                  Contactar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
