import type { Metadata } from 'next'
import { Calculator, Landmark, FileCheck, Users } from 'lucide-react'
import { RegistroCalculatorWidget } from '@/components/calculators/registro-widget'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Calculadora Registro de la Propiedad Ecuador | Aranceles 2026',
  description:
    'Calcula los aranceles de inscripción en el Registro de la Propiedad de Ecuador. Herramienta gratuita basada en la tabla oficial de aranceles registrales.',
  keywords: [
    'calculadora registro propiedad ecuador',
    'aranceles registro propiedad',
    'costos inscripción escritura',
    'calculadora registral',
    'inscripción inmuebles',
    'registro propiedad quito',
  ],
  openGraph: {
    title: 'Calculadora Registro de la Propiedad Ecuador | Aranceles 2026',
    description:
      'Calcula los aranceles de inscripción en el Registro de la Propiedad de Ecuador.',
    url: 'https://abogadosonlineecuador.com/calculadoras/registro-propiedad',
    type: 'website',
  },
}

const faqs = [
  {
    question: '¿Qué es el arancel de inscripción?',
    answer:
      'Es el costo que se paga al Registro de la Propiedad por inscribir un acto o contrato (compraventa, hipoteca, etc.) en los registros públicos. Este valor varía según el valor del contrato.',
  },
  {
    question: '¿Cuál es el arancel máximo?',
    answer:
      'Según la normativa vigente, en ningún caso el arancel de inscripción puede exceder los $500, independientemente del valor del inmueble.',
  },
  {
    question: '¿Quiénes tienen descuento en el Registro?',
    answer:
      'Las personas adultas mayores (65+ años) y personas con discapacidad tienen derecho a un descuento del 50% en los aranceles de inscripción, previa presentación de documentación que acredite su condición.',
  },
  {
    question: '¿Qué documentos se inscriben en el Registro?',
    answer:
      'Se inscriben escrituras públicas de compraventa, hipotecas, prohibiciones, embargos, sentencias, posesiones efectivas, cancelaciones de gravámenes, entre otros actos y contratos relacionados con bienes inmuebles.',
  },
]

export default function CalculadoraRegistroPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Calculadora Registro de la Propiedad Ecuador',
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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Calculadora Registro de la Propiedad
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Calcule los aranceles de inscripción para escrituras públicas, hipotecas y otros actos
            en el Registro de la Propiedad del Ecuador.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculadora Widget */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Calculadora de Aranceles Registrales
                </h2>
              </div>
              <RegistroCalculatorWidget />
            </div>
          </div>

          {/* Sidebar informativo */}
          <div className="space-y-6">
            {/* Info Card - Límite máximo */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white">Límite Máximo Legal</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                La normativa establece que en ningún caso el arancel de inscripción puede superar
                los:
              </p>
              <p className="text-3xl font-bold text-green-400">$500.00</p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Aplica para todos los actos y contratos, sin importar su valor.
              </p>
            </div>

            {/* Info Card - Descuentos */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">Descuentos Especiales</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-white">Adulto Mayor (65+)</span>
                  <span className="text-green-400 font-medium">50%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white">Discapacidad</span>
                  <span className="text-green-400 font-medium">50%</span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-3">
                *Requiere presentación de documentación que acredite la condición.
              </p>
            </div>

            {/* Trámites frecuentes */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white">Trámites Frecuentes</h3>
              </div>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Compraventa de inmuebles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Hipotecas y cancelaciones
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Prohibiciones y embargos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Posesiones efectivas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Rectificaciones y aclaratorias
                </li>
              </ul>
            </div>

            {/* CTA Contacto */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-2">¿Necesita inscribir su escritura?</h3>
              <p className="text-sm text-white/70 mb-4">
                Le asesoramos en todo el proceso de inscripción en el Registro de la Propiedad.
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
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            ¿Cómo funciona el Registro de la Propiedad?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Presentación</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                La escritura pública se presenta en el Registro de la Propiedad junto con los
                documentos requeridos y el pago correspondiente.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Calificación</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                El registrador revisa que el documento cumpla con todos los requisitos legales y
                registrales para su inscripción.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Inscripción</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Una vez calificado favorablemente, el acto se inscribe y queda registrado a nombre
                del nuevo propietario.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nota legal */}
        <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-200/80 text-center">
            <strong>Nota Legal:</strong> Los valores calculados son referenciales y tienen carácter
            informativo. Los aranceles definitivos pueden variar según la normativa vigente del
            Registro de la Propiedad. Se recomienda verificar los valores actualizados antes de
            realizar el pago.
          </p>
        </div>
      </div>
    </>
  )
}
