import type { Metadata } from 'next'
import { Calculator, Building2, MapPin, Info, ArrowRight } from 'lucide-react'
import { ConsejoProvincialCalculatorWidget } from '@/components/calculators/consejo-provincial-widget'
import { CtaPresupuestador } from '@/components/calculators/cta-presupuestador'
import { JsonLd } from '@/components/seo/json-ld'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculadora Consejo Provincial Pichincha | Contribución 2026',
  description:
    'Calcula la contribución al Consejo Provincial de Pichincha para transferencias de inmuebles. Fórmula: 10% del impuesto de alcabala + $1.80. Herramienta gratuita.',
  keywords: [
    'calculadora consejo provincial pichincha',
    'contribución consejo provincial',
    'impuesto consejo provincial quito',
    'calculadora alcabala y consejo provincial',
    'transferencia inmuebles pichincha',
    'impuestos municipales quito',
  ],
  openGraph: {
    title: 'Calculadora Consejo Provincial Pichincha | Contribución 2026',
    description:
      'Calcula la contribución al Consejo Provincial de Pichincha para transferencias de inmuebles.',
    url: 'https://abogadosonlineecuador.com/calculadoras/consejo-provincial',
    type: 'website',
  },
}

const faqs = [
  {
    question: '¿Qué es el Consejo Provincial de Pichincha?',
    answer:
      'Es el órgano de gobierno de la provincia de Pichincha que financia obras públicas y servicios provinciales a través de contribuciones específicas como la de transferencia de inmuebles.',
  },
  {
    question: '¿Cómo se calcula la contribución al Consejo Provincial?',
    answer:
      'Se calcula aplicando el 10% sobre el valor pagado por el impuesto de alcabala, más un valor fijo de $1.80. Es decir: (Alcabala × 10%) + $1.80.',
  },
  {
    question: '¿Quién paga la contribución al Consejo Provincial?',
    answer:
      'Al igual que la alcabala, esta contribución la paga el comprador o adquiriente del inmueble, ya que es un impuesto sobre la transferencia de propiedad.',
  },
  {
    question: '¿Dónde se paga esta contribución?',
    answer:
      'Se paga en las instituciones financieras autorizadas o en la página web del Consejo Provincial de Pichincha, junto con el pago de la alcabala municipal.',
  },
]

export default function CalculadoraConsejoProvincialPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Calculadora Consejo Provincial Pichincha',
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Herramienta Gratuita</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Calculadora Consejo Provincial
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Calcule la contribución al Consejo Provincial de Pichincha para transferencias de
            inmuebles. Fórmula: 10% del impuesto de alcabala + $1.80.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--text-secondary)]">
            <MapPin className="w-4 h-4" />
            <span>Aplica para inmuebles en Quito y provincia de Pichincha</span>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculadora Widget */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Calculadora Consejo Provincial de Pichincha
                </h2>
              </div>
              <ConsejoProvincialCalculatorWidget />

              {/* Funnel CTA → Presupuestador Inmobiliario */}
              <CtaPresupuestador
                costoActual="el Consejo Provincial"
                costosFaltantes={['Notaría', 'Alcabalas', 'Registro de la Propiedad']}
              />
            </div>
          </div>

          {/* Sidebar informativo */}
          <div className="space-y-6">
            {/* Info Card - Fórmula */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Fórmula de Cálculo</h3>
              </div>
              <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <code className="text-sm text-purple-600 block text-center">
                  (Alcabala × 10%) + $1.80
                </code>
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <strong className="text-text-primary">Paso 1:</strong> Calcular el impuesto de alcabala
                </p>
                <p>
                  <strong className="text-text-primary">Paso 2:</strong> Tomar el 10% del valor de la
                  alcabala
                </p>
                <p>
                  <strong className="text-text-primary">Paso 3:</strong> Sumar $1.80 (valor fijo)
                </p>
              </div>
            </div>

            {/* Info Card - Comparación */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Impuestos Relacionados</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-bg-tertiary rounded-lg">
                  <p className="text-text-primary font-medium mb-1">Alcabala (Municipio)</p>
                  <p className="text-[var(--text-secondary)]">1% sobre el valor de transferencia</p>
                </div>
                <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                  <p className="text-text-primary font-medium mb-1">Consejo Provincial</p>
                  <p className="text-[var(--text-secondary)]">10% de la alcabala + $1.80</p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] pt-2">
                  Ambos impuestos los paga el comprador del inmueble.
                </p>
              </div>
            </div>

            {/* Link a calculadora de alcabalas */}
            <Link
              href="/calculadoras/alcabalas"
              className="block bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">¿Necesita calcular la Alcabala?</h3>
                  <p className="text-sm text-text-secondary">
                    Use nuestra calculadora completa de impuestos municipales
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
            </Link>

            {/* CTA Contacto */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">¿Necesita asesoría?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Le ayudamos a calcular todos los impuestos de su transferencia de inmueble.
              </p>
              <a
                href="https://wa.me/593979317579"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Ejemplo práctico */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">Ejemplo Práctico</h2>
          <div className="max-w-3xl mx-auto bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-text-primary mb-4">Datos del Ejemplo</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">Valor de venta</span>
                    <span className="text-text-primary">$100,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">Avalúo catastral</span>
                    <span className="text-text-primary">$95,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">Base imponible</span>
                    <span className="text-text-primary">$100,000</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-4">Cálculo de Impuestos</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">Alcabala (1%)</span>
                    <span className="text-text-primary">$1,000.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">10% de Alcabala</span>
                    <span className="text-text-primary">$100.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[var(--glass-border)]">
                    <span className="text-[var(--text-secondary)]">Valor fijo</span>
                    <span className="text-text-primary">$1.80</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-purple-500/30 pt-3">
                    <span className="font-medium text-text-primary">Consejo Provincial</span>
                    <span className="font-bold text-purple-400">$101.80</span>
                  </div>
                </div>
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
            informativo. Las tarifas definitivas pueden variar según la normativa vigente del
            Consejo Provincial de Pichincha. Esta calculadora aplica únicamente para inmuebles
            ubicados en la provincia de Pichincha.
          </p>
        </div>
      </div>
    </>
  )
}
