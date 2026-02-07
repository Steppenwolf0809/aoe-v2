import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precios | Abogados Online Ecuador',
  description: 'Precios transparentes para contratos vehiculares y servicios legales en Ecuador. Desde $15 USD.',
}

export default function PreciosPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
        Precios Simples y Transparentes
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-12 text-center max-w-2xl mx-auto">
        Sin costos ocultos. Paga solo por lo que necesitas.
      </p>
      {/* TODO: implementar tabla de precios */}
    </div>
  )
}
