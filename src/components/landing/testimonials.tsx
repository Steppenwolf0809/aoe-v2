'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    quote: 'El proceso fue increiblemente rapido. En menos de 10 minutos tenia mi contrato listo.',
    name: 'Maria Garcia',
    role: 'Compradora de vehiculo',
  },
  {
    quote: 'Las calculadoras notariales me ahorraron tiempo y me dieron confianza antes de ir a la notaria.',
    name: 'Carlos Mendoza',
    role: 'Agente inmobiliario',
  },
  {
    quote: 'Excelente servicio. El contrato fue aceptado sin problemas en la notaria.',
    name: 'Ana Torres',
    role: 'Vendedora de vehiculo',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full p-6">
                <CardContent className="p-0">
                  <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-medium text-white">{testimonial.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
