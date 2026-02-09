import type { Metadata } from 'next'
import { Calculator, TrendingUp, ArrowRight, Home } from 'lucide-react'
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
          <span className="text-sm text-amber-400 font-medium">Impuesto Municipal</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Calculadora de Plusvalía
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-8">
          El impuesto de plusvalía (utilidad) es lo que paga el vendedor al transferir un inmueble.
          Puedes calcularlo junto con todos los demás costos en nuestro Presupuestador Inmobiliario.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/calculadoras/inmuebles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Calcular costo total del trámite
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calculadoras/alcabalas"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-bg-tertiary font-medium rounded-lg transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Solo alcabalas y utilidad
          </Link>
        </div>
      </div>

      <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          ¿Qué incluye el trámite de venta de un inmueble?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Vendedor paga: Plusvalía</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Impuesto sobre la ganancia obtenida por la venta, con deducciones por tiempo de
              posesión (5% por año, hasta 100%).
            </p>
          </div>
          <div className="p-4 bg-bg-tertiary rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Comprador paga: 4 rubros</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Notaría + Alcabalas + Registro de la Propiedad + Consejo Provincial. Usa el
              presupuestador para ver el total.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
