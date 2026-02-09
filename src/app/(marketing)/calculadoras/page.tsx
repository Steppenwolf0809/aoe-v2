import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, Building, TrendingUp, Landmark, Building2, Home, Star, ArrowRight, Car } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Calculadoras Legales Gratuitas | Abogados Online Ecuador',
  description:
    'Calcula gratis todos los costos legales para comprar o vender un inmueble en Ecuador: notaría, alcabalas, registro y consejo provincial. Herramientas actualizadas 2026.',
  keywords: [
    'calculadora notarial ecuador',
    'calculadora alcabalas quito',
    'calculadora registro propiedad',
    'costos escrituración ecuador',
    'gastos compra vivienda quito',
  ],
}

const featured = {
  href: '/calculadoras/inmuebles',
  title: 'Presupuestador de Compra de Vivienda',
  description:
    'Calcula el costo TOTAL de comprar o vender un inmueble: notaría + alcabalas + registro + consejo provincial + plusvalía. Todo en un solo lugar.',
  icon: Home,
}

const calculadoras = [
  {
    href: '/calculadoras/notarial',
    title: 'Calculadora Notarial',
    description: 'Aranceles notariales para escrituras públicas de compra-venta, hipotecas, poderes y más.',
    icon: Calculator,
  },
  {
    href: '/calculadoras/alcabalas',
    title: 'Calculadora de Alcabalas',
    description: 'Impuesto de alcabalas e impuesto a la utilidad para transferencia de inmuebles en Quito.',
    icon: Building,
  },
  {
    href: '/calculadoras/registro-propiedad',
    title: 'Calculadora Registro de la Propiedad',
    description: 'Aranceles de inscripción en el Registro de la Propiedad del Ecuador.',
    icon: Landmark,
  },
  {
    href: '/calculadoras/consejo-provincial',
    title: 'Calculadora Consejo Provincial',
    description: 'Contribución al Consejo Provincial de Pichincha (10% de alcabala + $1.80).',
    icon: Building2,
  },
  {
    href: '/calculadoras/plusvalia',
    title: 'Calculadora de Plusvalía',
    description: 'Impuesto a la utilidad municipal por venta de inmuebles.',
    icon: TrendingUp,
  },
  {
    href: '/calculadoras/vehiculos',
    title: 'Cotizador Vehicular',
    description: 'Contrato de compraventa vehicular con reconocimiento de firmas + impuesto fiscal.',
    icon: Car,
  },
]

export default function CalculadorasPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Badge variant="success" size="md" className="mb-4">
          100% Gratuito
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          ¿Cuánto cuesta tu trámite legal?
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Herramientas gratuitas y precisas para estimar los costos de tus trámites legales en
          Ecuador. Tarifas actualizadas 2026.
        </p>
      </div>

      {/* Featured: Presupuestador Inmobiliario */}
      <Link href={featured.href} className="block mb-8 group">
        <div className="relative overflow-hidden rounded-2xl border-2 border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-accent-primary/5 to-transparent p-6 md:p-8 hover:border-accent-primary/50 transition-all duration-300">
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl bg-accent-primary/10 group-hover:bg-accent-primary/15 transition-colors" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-glow-blue group-hover:scale-110 transition-transform duration-200">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  {featured.title}
                </h2>
                <Badge variant="info" size="sm" className="gap-1">
                  <Star className="w-3 h-3" />
                  Recomendado
                </Badge>
              </div>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                {featured.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-accent-primary font-medium text-sm shrink-0">
              Calcular ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>

      {/* Individual calculators */}
      <h2 className="text-lg font-semibold text-[var(--text-secondary)] mb-5">
        Calculadoras individuales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculadoras.map((calc) => {
          const Icon = calc.icon
          return (
            <Link key={calc.href} href={calc.href}>
              <Card className="h-full p-6 hover:bg-bg-secondary hover:border-[var(--glass-border-hover)] transition-all duration-200 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                    {calc.title}
                  </h3>
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
