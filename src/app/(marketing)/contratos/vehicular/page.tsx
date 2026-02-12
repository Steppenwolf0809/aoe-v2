import type { Metadata } from 'next'
import { WizardForm } from '@/components/contracts/wizard-form'

export const metadata: Metadata = {
  title: 'Crear Contrato de Compraventa de Vehículo | Abogados Online Ecuador',
  description:
    'Genera tu contrato de compraventa vehicular en minutos. Solo $9.99. Paga después de completar los datos.',
  openGraph: {
    title: 'Crear Contrato de Compraventa de Vehículo',
    description: 'Genera tu contrato vehicular en minutos. Solo $9.99',
  },
}

export default function ContratoVehicularPage() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Crea tu contrato de compraventa vehicular
          </h1>
          <p className="text-lg text-text-secondary">
            Completa los datos y paga solo $9.99 para generar tu contrato
            vehicular listo para su legalización en cualquier notaría
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No necesitas cuenta
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Paga después de completar
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Descarga inmediata
            </span>
          </div>
        </div>

        {/* Wizard */}
        <WizardForm />

        {/* Trust badges */}
        <div className="border-t border-[var(--glass-border)] pt-8 text-center">
          <p className="text-sm text-text-muted mb-4">
            Servicio legal digital independiente
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
            <span>🔒 Pago seguro con PayPhone</span>
            <span>⚡ Descarga instantánea</span>
            <span>✅ Válido legalmente</span>
          </div>
        </div>
      </div>
    </div>
  )
}
