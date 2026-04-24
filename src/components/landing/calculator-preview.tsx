'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Building, Calculator, FileSignature, Star } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const calculators = [
  {
    title: 'Presupuestador Inmobiliario',
    description:
      'Calcula el costo total de comprar o vender un inmueble: notaria, alcabalas, registro y consejo provincial.',
    icon: Calculator,
    href: '/calculadoras/inmuebles',
    featured: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Calculadora Notarial',
    description:
      'Calcula aranceles notariales segun tablas oficiales del Consejo de la Judicatura. Incluye IVA.',
    icon: Building,
    href: '/calculadoras/notarial',
    featured: false,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Impuestos Municipales',
    description:
      'Calcula alcabalas, plusvalia y utilidad para transferencias de dominio en el Municipio de Quito.',
    icon: FileSignature,
    href: '/calculadoras/alcabalas',
    featured: false,
    gradient: 'from-slate-600 to-blue-500',
  },
]

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

export function CalculatorPreview() {
  return (
    <section className="relative overflow-hidden bg-bg-secondary px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <Badge variant="success" size="md" className="mb-4">
            100% Gratuito
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-4xl">
            Calcula una referencia antes de iniciar tu trámite
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Las calculadoras siguen como utilidad notarial: estiman costos, impuestos
            y aranceles antes de avanzar con documentos o asesoría.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {calculators.map((calc) => {
            const Icon = calc.icon
            return (
              <motion.div key={calc.title} variants={cardVariants}>
                <Link href={calc.href} className="block h-full">
                  <Card
                    className={`group relative h-full cursor-pointer overflow-hidden p-6 transition-all duration-200 ${
                      calc.featured
                        ? 'border-accent-primary/30 bg-accent-primary/[0.04] hover:border-accent-primary/50 hover:bg-accent-primary/[0.08]'
                        : 'hover:border-[var(--glass-border-hover)] hover:bg-bg-tertiary'
                    }`}
                  >
                    {calc.featured && (
                      <div className="absolute right-4 top-4">
                        <Badge variant="info" size="sm" className="gap-1">
                          <Star className="h-3 w-3" />
                          Recomendado
                        </Badge>
                      </div>
                    )}

                    <CardContent className="relative z-10 p-0">
                      <div
                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-gradient-to-br ${calc.gradient} ${
                          calc.featured ? 'shadow-glow-blue' : ''
                        } transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors duration-200 group-hover:text-accent-primary">
                        {calc.title}
                      </h3>

                      <p className="mb-5 text-sm leading-relaxed text-text-secondary">
                        {calc.description}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary transition-all duration-200 group-hover:gap-2.5">
                        Calcular ahora
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/calculadoras">
            <Button variant="outline" size="lg">
              Ver todas las calculadoras
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
