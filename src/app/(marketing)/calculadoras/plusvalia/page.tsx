import type { Metadata } from 'next'
import { Calculator, TrendingUp, ArrowRight } from 'lucide-react'
import { MunicipalCalculatorWidget } from '@/components/calculators/municipal-widget'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculadora de Plusvalía Quito | Impuesto Municipal',
  description:
    'Calcula el impuesto de plusvalía para transferencia de inmuebles en Quito. Herramienta gratuita basada en la ordenanza municipal.',
}

export default function CalculadoraPlusvaliaPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full mb-6">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400 font-medium">Redireccionando</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Calculadora de Plusvalía
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-8">
          El cálculo de plusvalía está integrado en nuestra Calculadora de Alcabalas, que incluye
          tanto el impuesto a la utilidad (vendedor) como el impuesto de alcabala (comprador).
        </p>
        <Link
          href="/calculadoras/alcabalas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-medium rounded-lg transition-colors"
        >
          <Calculator className="w-5 h-5" />
          Ir a Calculadora de Alcabalas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          ¿Qué incluye la Calculadora de Alcabalas?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-medium text-white mb-2">Impuesto a la Utilidad</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Calcula el impuesto que paga el vendedor sobre la ganancia obtenida, considerando
              deducciones por tiempo de posesión.
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-medium text-white mb-2">Impuesto de Alcabala</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Calcula el impuesto que paga el comprador sobre el valor de la transferencia, con
              rebajas según el tiempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
