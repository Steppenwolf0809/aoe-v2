import type { Metadata } from 'next'
import { WizardForm } from '@/components/contracts/wizard-form'

export const metadata: Metadata = {
  title: 'Nuevo Contrato | Dashboard | Abogados Online Ecuador',
}

export default function NuevoContratoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          Nuevo contrato vehicular
        </h2>
        <p className="text-sm text-text-secondary">
          Completa los datos del vehiculo, comprador y vendedor para generar tu
          contrato de compraventa.
        </p>
      </div>

      <WizardForm />
    </div>
  )
}
