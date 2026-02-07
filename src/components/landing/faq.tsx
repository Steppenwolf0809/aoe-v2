'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Son validos legalmente los contratos generados?',
    answer: 'Si, todos los contratos generados cumplen con la legislacion ecuatoriana vigente y son validos para su uso en notarias.',
  },
  {
    question: 'Como funciona la calculadora notarial?',
    answer: 'Nuestras calculadoras utilizan las tablas oficiales del Consejo de la Judicatura para calcular aranceles notariales de forma precisa.',
  },
  {
    question: 'Cuanto tiempo toma generar un contrato?',
    answer: 'El proceso completo toma entre 5 y 10 minutos. Solo necesitas llenar el formulario con los datos requeridos.',
  },
  {
    question: 'Que metodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de credito/debito y transferencias bancarias a traves de nuestra pasarela de pago segura.',
  },
  {
    question: 'Puedo modificar un contrato despues de generarlo?',
    answer: 'Si, con el plan Profesional puedes solicitar modificaciones ilimitadas a tus contratos.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
