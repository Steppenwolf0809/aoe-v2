import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Plusvalia Ecuador | Impuesto Municipal',
  description: 'Estima el impuesto de plusvalia municipal para tu transaccion inmobiliaria en Ecuador.',
}

export default function CalculadoraPlusvaliaPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadora de Plusvalia
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Estima el impuesto de plusvalia municipal en tu transaccion.
      </p>
      {/* TODO: implementar calculadora interactiva */}
    </div>
  )
}
