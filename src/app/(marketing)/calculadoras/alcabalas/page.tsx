import type { Metadata } from 'next'
import { Calculator, Building2, Info, TrendingUp } from 'lucide-react'
import { MunicipalCalculatorWidget } from '@/components/calculators/municipal-widget'
import { CtaPresupuestador } from '@/components/calculators/cta-presupuestador'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Calculadora de Alcabalas Quito | Impuestos Municipales 2026',
  description:
    'Calcula el impuesto de alcabalas y utilidad para transferencia de inmuebles en Quito. Herramienta gratuita basada en la ordenanza municipal vigente.',
  keywords: [
    'calculadora alcabalas quito',
    'impuesto alcabala ecuador',
    'impuesto utilidad municipal',
    'calculadora municipal quito',
    'transferencia inmuebles',
    'impuestos compraventa',
  ],
  openGraph: {
    title: 'Calculadora de Alcabalas Quito | Impuestos Municipales 2026',
    description:
      'Calcula el impuesto de alcabalas y utilidad para transferencia de inmuebles en Quito.',
    url: 'https://abogadosonlineecuador.com/calculadoras/alcabalas',
    type: 'website',
  },
}

const faqs = [
  {
    question: '¿Qué es el impuesto de alcabala?',
    answer:
      'El impuesto de alcabala es un tributo municipal que pagan los compradores de inmuebles. En Quito corresponde al 1% del valor de la transferencia o avalúo catastral, el que sea mayor.',
  },
  {
    question: '¿Qué es el impuesto a la utilidad?',
    answer:
      'Es el impuesto que paga el vendedor sobre la ganancia obtenida por la venta del inmueble. La tarifa varía según el tipo de vendedor: 10% persona natural, 4% inmobiliaria, 1% donación.',
  },
  {
    question: '¿Cuándo aplica la rebaja en alcabala?',
    answer:
      'Existen rebajas por tiempo de posesión: 40% si vende antes de 1 año, 30% entre 1-2 años, 20% entre 2-3 años. Después de 3 años no hay rebaja.',
  },
  {
    question: '¿Cómo se calcula la deducción por tiempo en utilidad?',
    answer:
      'Se aplica una deducción del 5% por cada año de posesión, hasta un máximo de 20 años (100% deducción). Si tiene el inmueble 20+ años, no paga impuesto a la utilidad.',
  },
]

export default function CalculadoraAlcabalasPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Calculadora de Alcabalas Quito',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm text-[var(--accent-primary)] font-medium">
              Herramienta Gratuita
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Calculadora de Alcabalas
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Calcule el impuesto de alcabalas (comprador) y el impuesto a la utilidad (vendedor)
            para transferencias de inmuebles en la ciudad de Quito.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculadora Widget */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Calculadora de Impuestos Municipales
                </h2>
              </div>
              <MunicipalCalculatorWidget />

              {/* Funnel CTA → Presupuestador Inmobiliario */}
              <CtaPresupuestador
                costoActual="los impuestos municipales"
                costosFaltantes={['Notaría', 'Registro de la Propiedad', 'Consejo Provincial']}
              />
            </div>
          </div>

          {/* Sidebar informativo */}
          <div className="space-y-6">
            {/* Info Card - Alcabala */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Impuesto de Alcabala</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-text-primary">Quién paga:</strong> El comprador del inmueble
                </p>
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-text-primary">Tarifa base:</strong> 1% del valor
                </p>
                <div className="pt-2 border-t border-[var(--glass-border)]">
                  <p className="text-text-primary font-medium mb-2">Rebajas por tiempo:</p>
                  <ul className="space-y-1 text-[var(--text-secondary)]">
                    <li>• Primer año: 40% rebaja</li>
                    <li>• Segundo año: 30% rebaja</li>
                    <li>• Tercer año: 20% rebaja</li>
                    <li>• Más de 3 años: Sin rebaja</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Info Card - Utilidad */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Impuesto a la Utilidad</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-text-primary">Quién paga:</strong> El vendedor del inmueble
                </p>
                <div className="space-y-1 text-[var(--text-secondary)]">
                  <p>
                    <strong className="text-text-primary">Tarifas:</strong>
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• Persona natural: 10%</li>
                    <li>• Inmobiliaria: 4%</li>
                    <li>• Donación: 1%</li>
                  </ul>
                </div>
                <p className="pt-2 border-t border-[var(--glass-border)] text-[var(--text-secondary)]">
                  <strong className="text-text-primary">Deducción:</strong> 5% por año de tenencia (máx
                  20 años = 100%)
                </p>
              </div>
            </div>

            {/* CTA Contacto */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">¿Necesita asesoría tributaria?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Le ayudamos a optimizar sus impuestos municipales y gestionar su trámite.
              </p>
              <a
                href="https://wa.me/593999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Sección educativa */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            ¿Cómo funcionan los Impuestos de Transferencia?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Para el Comprador: Alcabala
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                El impuesto de alcabala se calcula sobre el mayor valor entre el precio de venta y
                el avalúo catastral. Aplica una tarifa del 1% con posibles rebajas según el tiempo
                de posesión del vendedor anterior.
              </p>
              <div className="text-sm text-[var(--text-secondary)]">
                <strong className="text-text-primary">Base imponible:</strong> Mayor entre valor de venta y
                avalúo catastral.
              </div>
            </div>
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Para el Vendedor: Utilidad
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                El impuesto a la utilidad grava la ganancia obtenida por la venta. Se calcula
                restando el valor de adquisición y mejoras del valor de venta, aplicando deducciones
                por tiempo de posesión.
              </p>
              <div className="text-sm text-[var(--text-secondary)]">
                <strong className="text-text-primary">Utilidad:</strong> Valor venta - (Adquisición +
                Mejoras) - Deducción tiempo.
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
                <h3 className="font-semibold text-text-primary mb-2">{faq.question}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nota legal */}
        <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-700 text-center">
            <strong>Nota Legal:</strong> Los valores calculados son referenciales y tienen carácter
            informativo. Las tarifas definitivas pueden variar según las ordenanzas municipales
            vigentes del Distrito Metropolitano de Quito. Se recomienda verificar los valores con el
            Municipio antes de realizar el pago.
          </p>
        </div>
      </div>
    </>
  )
}
