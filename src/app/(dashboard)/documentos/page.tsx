import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentos | Dashboard | Abogados Online Ecuador',
}

export default function DocumentosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Mis Documentos</h1>
      {/* TODO: implementar lista de documentos */}
    </div>
  )
}
