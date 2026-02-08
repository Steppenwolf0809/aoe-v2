'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calculator, Building, FileSignature, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------------------------------
   Calculator cards — 3 featured cards per PROMPT 06
   ---------------------------------------------------------------- */
const calculators = [
  {
    title: 'Calculadora Notarial',
    description:
      'Calcula los aranceles notariales según las tablas oficiales del Consejo de la Judicatura. Incluye IVA y desglose completo.',
    icon: Calculator,
    href: '/calculadoras/notarial',
    featured: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Impuestos Municipales',
    description:
      'Calcula alcabalas, plusvalía y utilidad para transferencias de dominio en el Municipio de Quito.',
    icon: Building,
    href: '/calculadoras/alcabalas',
    featured: false,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Registro de la Propiedad',
    description:
      'Calcula los aranceles del Registro de la Propiedad para inscripción de escrituras y contratos.',
    icon: FileSignature,
    href: '/calculadoras/registro-propiedad',
    featured: false,
    gradient: 'from-purple-500 to-pink-500',
  },
]

/* ----------------------------------------------------------------
   Stagger variants
   ---------------------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

/* ----------------------------------------------------------------
   Calculator Preview Section
   ---------------------------------------------------------------- */
export function CalculatorPreview() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-bg-secondary relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <Badge variant="success" size="md" className="mb-4">
            100% Gratuito
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Calculadora de Valor de Escrituras
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Herramientas gratuitas para calcular costos notariales, impuestos
            municipales y aranceles de registro antes de tu trámite.
          </p>
        </motion.div>

        {/* 3 Calculator cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {calculators.map((calc) => {
            const Icon = calc.icon
            return (
              <motion.div key={calc.title} variants={cardVariants}>
                <Link href={calc.href} className="block h-full">
                  <Card
                    className={`h-full p-6 relative overflow-hidden cursor-pointer group transition-all duration-200 ${
                      calc.featured
                        ? 'border-accent-primary/30 hover:border-accent-primary/50 bg-accent-primary/[0.04] hover:bg-accent-primary/[0.08]'
                        : 'hover:bg-white/[0.05] hover:border-white/[0.12]'
                    }`}
                  >
                    {/* Featured badge */}
                    {calc.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="info" size="sm" className="gap-1">
                          <Star className="w-3 h-3" />
                          Recomendado
                        </Badge>
                      </div>
                    )}

                    {/* Ambient glow for featured */}
                    {calc.featured && (
                      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl bg-accent-primary/10 group-hover:bg-accent-primary/15 transition-colors" />
                    )}

                    <CardContent className="p-0 relative z-10">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center mb-5 ${
                          calc.featured ? 'shadow-glow-blue' : ''
                        } group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-primary transition-colors duration-200">
                        {calc.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed mb-5">
                        {calc.description}
                      </p>

                      {/* Link */}
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary group-hover:gap-2.5 transition-all duration-200">
                        Calcular ahora
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/calculadoras">
            <Button variant="outline" size="lg">
              Ver todas las calculadoras
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
