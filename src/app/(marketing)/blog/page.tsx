import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Legal Ecuador | Abogados Online Ecuador',
  description: 'Articulos, guias y noticias sobre derecho notarial, contratos y tramites legales en Ecuador.',
}

export default function BlogPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Blog Legal</h1>
      <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-2xl">
        Guias, articulos y noticias sobre derecho notarial y tramites legales en Ecuador.
      </p>
      {/* TODO: implementar grid de posts */}
    </div>
  )
}
