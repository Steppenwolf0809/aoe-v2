import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora Consejo Provincial Ecuador | Contribucion por Transferencia',
  description: 'Calcula la contribucion al Consejo Provincial por transferencia de dominio de inmuebles en Ecuador.',
}

export default function CalculadoraConsejoProvincialPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadora Consejo Provincial
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Calcula la contribucion al Consejo Provincial por transferencia de dominio.
      </p>
      {/* TODO: implementar calculadora interactiva */}
    </div>
  )
}
