import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuevo Contrato | Dashboard | Abogados Online Ecuador',
}

export default function NuevoContratoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Nuevo Contrato</h1>
      {/* TODO: implementar WizardForm */}
    </div>
  )
}
