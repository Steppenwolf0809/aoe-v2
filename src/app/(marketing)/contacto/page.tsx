import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | Abogados Online Ecuador',
  description: 'Contactanos para consultas legales, soporte o informacion sobre nuestros servicios en Ecuador.',
}

export default function ContactoPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contacto</h1>
      <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
        Estamos aqui para ayudarte con tus consultas legales.
      </p>
      {/* TODO: implementar formulario de contacto */}
    </div>
  )
}
