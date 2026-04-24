'use client'

import { motion } from 'framer-motion'
import { ArrowRight, FileCheck2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const ctaPaths = [
  {
    title: 'Quiero iniciar un trámite notarial',
    description: 'Escrituras, poderes, contratos, certificaciones y calculadoras para preparar costos.',
    href: '/servicios',
    cta: 'Realizar Tramite Notarial',
    icon: FileCheck2,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  {
    title: 'Necesito negociar una deuda',
    description: 'Completa el evaluador, descarga tu pre-diagnóstico y activa la estrategia legal.',
    href: '#evaluador-deudas',
    cta: 'Negociar mi Deuda Ahora',
    icon: ShieldCheck,
    className: 'border-rose-200 bg-rose-50 text-rose-800',
  },
]

export function CTA() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            ¿Qué necesitas resolver primero?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Abogados Online Ecuador separa cada ruta para que avances con claridad:
            formalizar un trámite o contener una crisis financiera.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {ctaPaths.map((path, index) => {
            const Icon = path.icon

            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`rounded-[var(--radius-lg)] border p-6 ${path.className}`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold leading-snug text-slate-950">{path.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{path.description}</p>
                <Button asChild size="lg" className="mt-6 w-full bg-slate-950 text-white hover:bg-slate-800">
                  <Link href={path.href}>
                    {path.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
