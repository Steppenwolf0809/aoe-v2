'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ----------------------------------------------------------------
   FAQ data — 5 questions per PROMPT 07
   ---------------------------------------------------------------- */
const faqs = [
  {
    question: '¿Son válidos legalmente los contratos generados?',
    answer:
      'Sí, todos los contratos generados cumplen con la legislación ecuatoriana vigente y son válidos para su uso en notarías. Nuestros documentos están respaldados por 12+ años de experiencia notarial en Quito.',
  },
  {
    question: '¿Cómo funciona la calculadora notarial?',
    answer:
      'Nuestras calculadoras utilizan las tablas oficiales del Consejo de la Judicatura y las tarifas municipales vigentes para calcular aranceles notariales de forma precisa. Solo necesitas ingresar el valor del inmueble o vehículo y obtendrás un estimado detallado.',
  },
  {
    question: '¿Cuánto tiempo toma generar un contrato?',
    answer:
      'El proceso completo toma entre 5 y 10 minutos. Solo necesitas llenar el formulario con los datos requeridos, realizar el pago y recibirás tu contrato por correo electrónico listo para imprimir y firmar.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjetas de crédito y débito a través de nuestra pasarela de pago segura. También puedes realizar transferencias bancarias. Todos los pagos están protegidos con encriptación de última generación.',
  },
  {
    question: '¿Puedo modificar un contrato después de generarlo?',
    answer:
      'Sí, con el plan Profesional puedes solicitar modificaciones ilimitadas a tus contratos. Para el plan básico, puedes generar un nuevo contrato con los datos corregidos a un precio reducido.',
  },
]

/* ----------------------------------------------------------------
   FAQ Section — accordion with AnimatePresence
   ---------------------------------------------------------------- */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Resolvemos tus dudas sobre nuestros servicios legales y calculadoras.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={cn(
                'rounded-xl border overflow-hidden transition-colors duration-200',
                openIndex === index
                  ? 'border-blue-200 bg-white shadow-sm'
                  : 'border-slate-200 bg-white/90 hover:bg-white',
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
              >
                <span
                  className={cn(
                    'text-sm font-medium pr-4 transition-colors duration-200',
                    openIndex === index ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900',
                  )}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 transition-colors duration-200',
                      openIndex === index ? 'text-blue-700' : 'text-slate-400',
                    )}
                  />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
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
