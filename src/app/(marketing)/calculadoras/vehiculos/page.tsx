import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calculator,
  Car,
  Info,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
} from 'lucide-react'
import { VehicularCalculatorWidget } from '@/components/calculators/vehicular-widget'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Cotizador Vehicular Ecuador 2026 | Contrato Compraventa Vehículos',
  description:
    'Calcula el costo del contrato de compraventa vehicular en Ecuador: reconocimiento de firmas notariales + impuesto fiscal (1%) + servicio de contrato. Actualizado 2026.',
  keywords: [
    'contrato compraventa vehicular ecuador',
    'cuanto cuesta transferir un carro',
    'reconocimiento de firmas vehicular',
    'costo notarial vehiculo',
    'traspaso de vehiculo ecuador',
    'impuesto transferencia vehicular',
    'abogados online ecuador',
  ],
  openGraph: {
    title: 'Cotizador Vehicular Ecuador 2026 | Contrato Compraventa Vehículos',
    description:
      'Calcula el costo del contrato de compraventa vehicular: reconocimiento de firmas + impuesto fiscal. Servicio completo con AOE.',
    url: 'https://abogadosonlineecuador.com/calculadoras/vehiculos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotizador Vehicular Ecuador 2026',
    description: 'Calcula el costo del contrato de compraventa vehicular en Ecuador.',
  },
  alternates: {
    canonical: 'https://abogadosonlineecuador.com/calculadoras/vehiculos',
  },
}

const faqs = [
  {
    question: '¿Cuánto cuesta el contrato de compraventa de un vehículo?',
    answer:
      'El costo del contrato de compraventa vehicular depende del número de firmas que requieran reconocimiento notarial. Para una transferencia simple (comprador + vendedor), el costo notarial es de aproximadamente $28.92 más IVA (15%), para un total de $33.26 en reconocimiento de firmas. Adicionalmente, se paga el 1% del valor del vehículo como impuesto fiscal de transferencia de dominio. Con nuestro servicio AOE, el contrato generado tiene un costo de \$11.99.',
  },
  {
    question: '¿Qué es el reconocimiento de firmas y por qué lo necesito?',
    answer:
      'El reconocimiento de firmas es un acto notarial donde el notario certifica que las firmas en el contrato de compraventa pertenecen efectivamente a las personas que dicen ser. Es OBLIGATORIO para que el contrato tenga validez legal y puedas realizar el trámite de transferencia de dominio en la ANT (Agencia Nacional de Tránsito). Cada firma que aparece en el contrato debe ser reconocida ante notario.',
  },
  {
    question: '¿Qué impuestos debo pagar al transferir un vehículo?',
    answer:
      'Al transferir la propiedad de un vehículo en Ecuador, el comprador debe pagar el 1% del valor del vehículo como impuesto fiscal de transferencia de dominio. Este impuesto se paga en las oficinas de la ANT o en bancos autorizados antes de realizar el cambio de propietario. Además, el vehículo debe estar al día en matriculación y no tener multas pendientes.',
  },
  {
    question: '¿El contrato incluye el trámite en la ANT?',
    answer:
      'No, el contrato de compraventa con reconocimiento de firmas es un paso previo y separado del trámite de transferencia de dominio en la ANT. Una vez que tengas el contrato firmado y con las firmas reconocidas, debes acudir a la ANT con todos los documentos requeridos para completar el cambio de propietario. Los costos de la ANT (matriculación, revisión técnica vehicular, etc.) son adicionales.',
  },
  {
    question: '¿Cuántas firmas necesito en mi contrato?',
    answer:
      'Lo más común es que el contrato requiera 2 firmas: una del comprador y una del vendedor. Sin embargo, si alguna de las partes está casada bajo el régimen de sociedad conyugal, también debe firmar el cónyuge, aumentando a 4 firmas. Cada firma adicional incrementa el costo notarial en $14.46 + IVA. Nuestra calculadora te permite elegir entre 2 o 4 firmas.',
  },
]

export default function CotizadorVehicularPage() {
  return (
    <>
      {/* JSON-LD: SoftwareApplication */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Cotizador Vehicular Ecuador',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          description:
            'Calculadora gratuita para estimar el costo del contrato de compraventa vehicular en Ecuador.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          provider: {
            '@type': 'LegalService',
            name: 'Abogados Online Ecuador',
            url: 'https://abogadosonlineecuador.com',
            areaServed: {
              '@type': 'Country',
              name: 'Ecuador',
            },
          },
        }}
      />

      {/* JSON-LD: FAQPage */}
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
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-[var(--text-muted)]">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-accent-primary transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/calculadoras"
                className="hover:text-accent-primary transition-colors"
              >
                Calculadoras
              </Link>
            </li>
            <li>/</li>
            <li className="text-text-primary font-medium">Cotizador Vehicular</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm text-[var(--accent-primary)] font-medium">
              100% Gratuito
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Cotizador de
            <br className="hidden md:block" />
            <span className="text-accent-primary"> Compraventa Vehicular</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Calcula el costo del contrato de compraventa de tu vehículo: reconocimiento de firmas
            notariales + impuesto fiscal. Actualizado 2026.
          </p>
        </div>

        {/* Layout principal: Calculator + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Widget */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Cotizador Vehicular
                </h2>
              </div>
              <VehicularCalculatorWidget />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info card */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-text-primary">¿Qué incluye?</h3>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Reconocimiento de firmas</strong> ante
                    notario (3% SBU por firma)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">IVA (15%)</strong> sobre el costo
                    notarial
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Impuesto fiscal (1%)</strong> del valor
                    del vehículo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Servicio AOE</strong> — Contrato
                    generado por solo \$11.99
                  </span>
                </li>
              </ul>
            </div>

            {/* Warning card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">
                    ℹ️ Trámite completo
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Este cotizador incluye solo el contrato de compraventa con reconocimiento de
                    firmas. Los trámites en la ANT (matriculación, revisión técnica) son
                    adicionales.
                  </p>
                  <ul className="text-xs text-[var(--text-muted)] space-y-1">
                    <li>• Contrato de compraventa (aquí)</li>
                    <li>• Reconocimiento de firmas (notaría)</li>
                    <li>• Transferencia de dominio (ANT)</li>
                    <li>• Matriculación anual (ANT)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿Necesita el contrato generado?
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Generamos su contrato de compraventa vehicular con formato legal ecuatoriano por
                solo \$11.99.
              </p>
              <a
                href="https://wa.me/593979317579?text=Hola%2C%20necesito%20un%20contrato%20de%20compraventa%20vehicular"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
              >
                Solicitar Contrato por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SEO CONTENT SECTION (200-400 words) */}
        {/* ============================================ */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Todo sobre el contrato de compraventa vehicular en Ecuador
          </h2>

          <div className="prose prose-invert max-w-none space-y-6 text-[var(--text-secondary)] text-base leading-relaxed">
            <p>
              La compraventa de un vehículo en Ecuador requiere un{' '}
              <strong className="text-text-primary">contrato de compraventa</strong> con{' '}
              <strong className="text-text-primary">reconocimiento de firmas notariales</strong>.
              A diferencia de los inmuebles, los contratos vehiculares son documentos privados que
              NO requieren escritura pública, lo que los hace más económicos y rápidos de
              tramitar. El costo principal es el reconocimiento de firmas ante notario, calculado
              al 3% del Salario Básico Unificado (SBU) por cada firma.
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              ¿Qué es el reconocimiento de firmas notariales?
            </h3>
            <p>
              El <strong className="text-text-primary">reconocimiento de firmas</strong> es un
              acto notarial donde el notario certifica que las personas que firman el contrato son
              quienes dicen ser, verificando su identidad con la cédula de ciudadanía. Este
              reconocimiento es OBLIGATORIO para que la{' '}
              <strong className="text-text-primary">ANT (Agencia Nacional de Tránsito)</strong>{' '}
              acepte el contrato y procese la transferencia de dominio. Cada firma (comprador,
              vendedor y cónyuges si aplica) debe ser reconocida individualmente.
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              Impuestos y costos adicionales
            </h3>
            <p>
              Además del reconocimiento de firmas, el comprador debe pagar el{' '}
              <strong className="text-text-primary">1% del valor del vehículo</strong> como
              impuesto fiscal de transferencia de dominio. Este impuesto se paga en las oficinas
              de la ANT o en bancos autorizados. También es necesario que el vehículo esté al día
              en matriculación, revisión técnica vehicular, y que no tenga multas pendientes. Los
              trámites en la ANT tienen costos adicionales que varían según el tipo de vehículo y
              el año de fabricación.
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              ¿Puedo hacer el trámite sin notario?
            </h3>
            <p>
              No es posible. El reconocimiento de firmas notariales es un requisito legal
              OBLIGATORIO para la transferencia de dominio vehicular en Ecuador. Sin este
              reconocimiento, la ANT no procesará el cambio de propietario. Es importante que
              ambas partes (comprador y vendedor) acudan juntas a la notaría con sus cédulas
              originales para realizar el reconocimiento de firmas.
            </p>
          </div>
        </div>

        {/* ============================================ */}
        {/* FAQs */}
        {/* ============================================ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6"
              >
                <h3 className="font-semibold text-text-primary mb-2">{faq.question}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* INTERNAL LINKS */}
        {/* ============================================ */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/calculadoras"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white rounded-lg text-sm font-medium transition-all"
          >
            <Calculator className="w-4 h-4" />
            Ver todas las calculadoras
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-bg-tertiary hover:text-text-primary transition-all"
          >
            <Shield className="w-4 h-4" />
            Ver servicios legales
          </Link>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Valores referenciales:</strong> Los costos de reconocimiento de firmas se
              calculan con las tarifas oficiales del Consejo de la Judicatura (3% SBU por firma).
              El impuesto fiscal de transferencia es del 1% del valor del vehículo según normativa
              vigente. Los trámites en la ANT (matriculación, revisión técnica) tienen costos
              adicionales. Para un presupuesto personalizado exacto,{' '}
              <a
                href="https://wa.me/593979317579"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-300"
              >
                contáctenos
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
