'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: '¿La evaluación de deuda tiene costo?',
    answer:
      'La evaluación inicial desde la home es gratuita y genera un PDF de pre-diagnóstico. Una asesoría personalizada o una estrategia de negociación se cotiza después de revisar el caso.',
  },
  {
    question: '¿Pueden garantizar que eliminarán mi deuda?',
    answer:
      'No prometemos eliminar deudas ni detener procesos de forma garantizada. Evaluamos documentos, riesgo y capacidad de pago para proponer una negociación o defensa responsable.',
  },
  {
    question: '¿Qué pasa si ya recibí una notificación de cobro?',
    answer:
      'Guarda la notificacion, revisa fechas y evita firmar acuerdos sin entender sus efectos. El evaluador ayuda a ordenar la informacion para una primera estrategia.',
  },
  {
    question: '¿La negociación es extrajudicial o también hay defensa judicial?',
    answer:
      'La oferta se plantea como Negociación Extrajudicial con Blindaje Judicial: buscamos acuerdo, pero revisamos documentos y plazos por si el conflicto escala.',
  },
  {
    question: '¿Qué necesito para empezar un trámite notarial?',
    answer:
      'Depende del acto, pero normalmente necesitas datos de las partes, documentos de identidad y antecedentes del bien o contrato. Puedes iniciar en servicios o calcular costos antes de avanzar.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Respuestas prudentes para trámites notariales y negociación de deudas.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={cn(
                'overflow-hidden rounded-[var(--radius-md)] border bg-white transition-colors duration-200',
                openIndex === index ? 'border-slate-300 shadow-sm' : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left"
              >
                <span className="pr-4 text-sm font-semibold text-slate-900">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-slate-500" />
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
                    <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
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
