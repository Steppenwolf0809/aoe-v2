'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  quote: string
  name: string
  city: string
  role: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'En una tarde entendi el costo de mi escritura y pude avanzar sin vueltas.',
    name: 'MSP',
    city: 'Riobamba',
    role: 'Tramite inmobiliario',
    initials: 'MS',
  },
  {
    quote:
      'Llegue con miedo por llamadas de cobro; sali con una estrategia y pasos claros.',
    name: 'JAC',
    city: 'Quito',
    role: 'Evaluación de deuda',
    initials: 'JA',
  },
  {
    quote:
      'La plataforma me ayudó a organizar documentos, tiempos y opciones reales.',
    name: 'LVT',
    city: 'Guayaquil',
    role: 'Preparacion legal',
    initials: 'LV',
  },
  {
    quote:
      'Calcule gastos, revise requisitos y llegue a la llamada con preguntas concretas.',
    name: 'PRM',
    city: 'Cuenca',
    role: 'Calculadoras notariales',
    initials: 'PR',
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
  }),
}

export function Testimonials() {
  const [[page, direction], setPage] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const currentIndex = ((page % testimonials.length) + testimonials.length) % testimonials.length

  const paginate = useCallback((newDirection: number) => {
    setPage(([prev]) => [prev + newDirection, newDirection])
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => paginate(1), 5200)
    return () => clearInterval(timer)
  }, [isPaused, paginate])

  const current = testimonials[currentIndex]

  return (
    <section className="bg-bg-primary px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Historias discretas, resultados concretos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            En servicios legales, la privacidad tambien es parte de la confianza.
          </p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex min-h-[280px] items-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-bg-secondary p-8 sm:p-12">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full"
              >
                <Quote className="mb-6 h-10 w-10 text-accent-primary/30" />

                <blockquote className="mb-8 text-lg leading-relaxed text-text-secondary sm:text-xl">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <span className="text-sm font-semibold text-text-primary">{current.initials}</span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{current.name}</div>
                    <div className="text-sm text-text-muted">
                      {current.role} - {current.city}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--glass-border)] bg-bg-secondary text-text-secondary backdrop-blur-sm transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary sm:-translate-x-5"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--glass-border)] bg-bg-secondary text-text-secondary backdrop-blur-sm transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary sm:translate-x-5"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-6 bg-accent-primary'
                  : 'w-2 bg-[var(--glass-border)] hover:bg-text-muted',
              )}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
