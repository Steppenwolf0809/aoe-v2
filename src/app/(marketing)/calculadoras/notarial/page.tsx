import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora Notarial Ecuador | Aranceles Notariales 2026',
  description: 'Calcula los aranceles notariales para escrituras publicas de compra-venta de inmuebles en Ecuador. Herramienta gratuita y precisa.',
}

export default function CalculadoraNotarialPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadora Notarial
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Calcula los aranceles notariales para tu escritura publica de compra-venta.
      </p>
      {/* TODO: implementar calculadora interactiva */}
    </div>
  )
}
