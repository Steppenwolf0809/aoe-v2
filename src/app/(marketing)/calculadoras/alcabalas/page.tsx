import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora de Alcabalas Ecuador | Impuesto de Transferencia',
  description: 'Calcula el impuesto de alcabalas para transferencia de dominio de inmuebles en Ecuador.',
}

export default function CalculadoraAlcabalasPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadora de Alcabalas
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Calcula el impuesto de alcabalas para la transferencia de dominio.
      </p>
      {/* TODO: implementar calculadora interactiva */}
    </div>
  )
}
