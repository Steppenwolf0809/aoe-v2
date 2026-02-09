'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ----------------------------------------------------------------
   Testimonial data
   ---------------------------------------------------------------- */
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
      'El proceso fue increíblemente rápido. En menos de 10 minutos tenía mi contrato listo para firmar en la notaría.',
    name: 'María García',
    city: 'Quito',
    role: 'Compradora de vehículo',
    initials: 'MG',
  },
  {
    quote:
      'Las calculadoras notariales me ahorraron tiempo y me dieron confianza antes de ir a la notaría. Sabía exactamente cuánto debía pagar.',
    name: 'Carlos Mendoza',
    city: 'Guayaquil',
    role: 'Agente inmobiliario',
    initials: 'CM',
  },
  {
    quote:
      'Excelente servicio. El contrato fue aceptado sin problemas en la notaría. Todo el proceso fue muy profesional.',
    name: 'Ana Torres',
    city: 'Cuenca',
    role: 'Vendedora de vehículo',
    initials: 'AT',
  },
  {
    quote:
      'La plataforma es muy intuitiva y los costos son transparentes. Ya la recomendé a mis colegas abogados.',
    name: 'Roberto Salazar',
    city: 'Quito',
    role: 'Abogado independiente',
    initials: 'RS',
  },
  {
    quote:
      'Me sorprendió la exactitud de la calculadora. El monto coincidió con lo que me cobraron en la notaría.',
    name: 'Lucía Andrade',
    city: 'Ambato',
    role: 'Compradora de inmueble',
    initials: 'LA',
  },
]

/* ----------------------------------------------------------------
   Slide animation variants
   ---------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
   Testimonials Section — carousel with arrows, dots, auto-play
   ---------------------------------------------------------------- */
export function Testimonials() {
  const [[page, direction], setPage] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const currentIndex = ((page % testimonials.length) + testimonials.length) % testimonials.length

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prev]) => [prev + newDirection, newDirection])
    },
    [],
  )

  // Auto-play every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => paginate(1), 5000)
    return () => clearInterval(timer)
  }, [isPaused, paginate])

  const current = testimonials[currentIndex]

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-bg-primary">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Miles de ecuatorianos ya confían en nuestra plataforma para sus trámites legales.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card container */}
          <div className="overflow-hidden rounded-2xl bg-bg-secondary border border-[var(--glass-border)] p-8 sm:p-12 min-h-[280px] flex items-center">
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
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-accent-primary/30 mb-6" />

                {/* Quote text */}
                <blockquote className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 border border-[var(--glass-border)] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-text-primary">
                      {current.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{current.name}</div>
                    <div className="text-sm text-text-muted">
                      {current.role} — {current.city}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-5 w-10 h-10 rounded-full bg-bg-secondary border border-[var(--glass-border)] flex items-center justify-center text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 cursor-pointer backdrop-blur-sm"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-5 w-10 h-10 rounded-full bg-bg-secondary border border-[var(--glass-border)] flex items-center justify-center text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all duration-200 cursor-pointer backdrop-blur-sm"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300 cursor-pointer',
                index === currentIndex
                  ? 'bg-accent-primary w-6'
                  : 'bg-[var(--glass-border)] hover:bg-text-muted',
              )}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
