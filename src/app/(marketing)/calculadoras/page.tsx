import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, Building, TrendingUp, Landmark, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Calculadoras Legales Gratuitas | Abogados Online Ecuador',
  description: 'Calcula costos notariales, alcabalas, plusvalia y registro de la propiedad en Ecuador. Herramientas gratuitas y precisas.',
}

const calculadoras = [
  {
    href: '/calculadoras/notarial',
    title: 'Calculadora Notarial',
    description: 'Calcula aranceles notariales para escrituras publicas de compra-venta.',
    icon: Calculator,
  },
  {
    href: '/calculadoras/alcabalas',
    title: 'Calculadora de Alcabalas',
    description: 'Calcula el impuesto de alcabalas para transferencia de dominio.',
    icon: Building,
  },
  {
    href: '/calculadoras/plusvalia',
    title: 'Calculadora de Plusvalia',
    description: 'Estima el impuesto de plusvalia municipal en tu transaccion.',
    icon: TrendingUp,
  },
  {
    href: '/calculadoras/registro-propiedad',
    title: 'Calculadora Registro de la Propiedad',
    description: 'Calcula los costos de inscripcion en el Registro de la Propiedad.',
    icon: Landmark,
  },
  {
    href: '/calculadoras/consejo-provincial',
    title: 'Calculadora Consejo Provincial',
    description: 'Calcula la contribucion al Consejo Provincial por transferencia de dominio.',
    icon: Building2,
  },
]

export default function CalculadorasPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadoras Legales Gratuitas
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
        Herramientas precisas para estimar costos de tus tramites legales en Ecuador.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculadoras.map((calc) => {
          const Icon = calc.icon
          return (
            <Link key={calc.href} href={calc.href}>
              <Card className="h-full p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                    {calc.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">{calc.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
