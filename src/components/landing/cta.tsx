'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-white/[0.08] p-12 md:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Listo para simplificar tus tramites legales?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl mx-auto">
            Genera tu primer contrato en minutos o prueba nuestras calculadoras gratuitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button size="lg">
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="glass" size="lg">
                Contactar
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
