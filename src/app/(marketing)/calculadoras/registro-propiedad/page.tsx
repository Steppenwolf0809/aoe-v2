import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora Registro de la Propiedad Ecuador | Costos de Inscripcion',
  description: 'Calcula los costos de inscripcion en el Registro de la Propiedad para tu escritura en Ecuador.',
}

export default function CalculadoraRegistroPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Calculadora Registro de la Propiedad
      </h1>
      <p className="text-[var(--text-secondary)] text-lg mb-8">
        Calcula los costos de inscripcion en el Registro de la Propiedad.
      </p>
      {/* TODO: implementar calculadora interactiva */}
    </div>
  )
}
