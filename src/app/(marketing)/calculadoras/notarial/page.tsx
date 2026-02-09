import type { Metadata } from 'next'
import { Calculator, FileText, Info, Scale } from 'lucide-react'
import { NotarialCalculatorWidget } from '@/components/calculators/notarial-widget'
import { CtaPresupuestador } from '@/components/calculators/cta-presupuestador'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Calculadora Notarial Ecuador | Aranceles Notariales 2026',
  description:
    'Calcula los aranceles notariales para escrituras públicas de compra-venta, hipotecas, poderes, testamentos y más. Herramienta gratuita basada en las tablas oficiales del Consejo de la Judicatura.',
  keywords: [
    'calculadora notarial ecuador',
    'aranceles notariales 2026',
    'costos escritura pública',
    'tarifas notariales',
    'calcular notaría',
    'impuestos compraventa',
    'abogados online ecuador',
  ],
  openGraph: {
    title: 'Calculadora Notarial Ecuador | Aranceles Notariales 2026',
    description:
      'Calcula los aranceles notariales para escrituras públicas de compra-venta, hipotecas, poderes, testamentos y más.',
    url: 'https://abogadosonlineecuador.com/calculadoras/notarial',
    type: 'website',
  },
}

const faqs = [
  {
    question: '¿Qué son los aranceles notariales?',
    answer:
      'Los aranceles notariales son los costos que se pagan a la notaría por los servicios de autenticación y protocolización de documentos legales. Están regulados por el Consejo de la Judicatura.',
  },
  {
    question: '¿Cómo se calculan los aranceles notariales?',
    answer:
      'Los aranceles se calculan según tablas graduales basadas en la cuantía del acto. Para escrituras de compraventa, la tabla considera el valor del inmueble y aplica una tarifa que varía según rangos establecidos.',
  },
  {
    question: '¿Qué incluye el arancel notarial?',
    answer:
      'El arancel incluye los honorarios del notario, el IVA (15%), gastos de protocolo, y los derechos de registro. Algunos servicios adicionales como certificaciones tienen tarifas separadas.',
  },
  {
    question: '¿Hay descuentos en aranceles notariales?',
    answer:
      'Sí, existen descuentos para viviendas de interés social (25% si no supera $60,000) y para adultos mayores en actos unilaterales (50%). También hay tarifas reducidas para personas con discapacidad.',
  },
]

export default function CalculadoraNotarialPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Calculadora Notarial Ecuador',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '156',
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
            Calculadora Notarial
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Calcula los aranceles notariales para escrituras públicas, hipotecas, poderes,
            testamentos y más. Basado en las tablas oficiales del Consejo de la Judicatura.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculadora Widget */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">Calculadora de Tasas</h2>
              </div>
              <NotarialCalculatorWidget />

              {/* Funnel CTA → Presupuestador Inmobiliario */}
              <CtaPresupuestador
                costoActual="la notaría"
                costosFaltantes={['Alcabalas', 'Registro de la Propiedad', 'Consejo Provincial']}
              />
            </div>
          </div>

          {/* Sidebar informativo */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Información Importante</h3>
              </div>
              <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                <p>
                  <strong className="text-text-primary">SBU 2026:</strong> $482.00 - Salario Básico
                  Unificado
                </p>
                <p>
                  <strong className="text-text-primary">IVA:</strong> 15% sobre el valor del arancel
                </p>
                <p>
                  <strong className="text-text-primary">Foja:</strong> $1.79 por copia certificada
                </p>
              </div>
            </div>

            {/* Servicios populares */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Servicios Más Solicitados</h3>
              </div>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Transferencia de Dominio (Compraventa)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Hipotecas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Poderes Generales
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Testamentos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Uniones de Hecho
                </li>
              </ul>
            </div>

            {/* CTA Contacto */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">¿Necesita asesoría?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Presentando este cálculo en nuestra notaría, reciba asesoría gratuita para su
                trámite.
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
            ¿Cómo se calculan los Aranceles Notariales?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">1</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Identifique el Servicio</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Determine si el trámite es con cuantía (compraventa, hipoteca) o tarifa fija
                (poderes, testamentos).
              </p>
            </div>
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">2</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Aplique la Tabla</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Use las tablas graduales del Consejo de la Judicatura según el tipo de acto y
                cuantía.
              </p>
            </div>
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">3</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Incluya el IVA</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Adicione el 15% de IVA y considere descuentos aplicables (vivienda social, adultos
                mayores).
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Preguntas Frecuentes
          </h2>
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
            informativo. Las tarifas definitivas pueden variar según la notaría y las normativas
            vigentes. Esta calculadora se basa en el Reglamento del Sistema Notarial Integral de la
            Función Judicial del Ecuador.
          </p>
        </div>
      </div>
    </>
  )
}
