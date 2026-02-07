import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios Legales | Abogados Online Ecuador',
  description: 'Servicios legales digitales en Ecuador: contratos vehiculares, calculadoras notariales, consultas legales y mas.',
}

export default function ServiciosPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Nuestros Servicios
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
        Soluciones legales digitales para simplificar tus tramites en Ecuador.
      </p>
      {/* TODO: implementar grid de servicios */}
    </div>
  )
}
