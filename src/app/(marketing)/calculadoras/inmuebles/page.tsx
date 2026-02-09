import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calculator,
  Home,
  FileText,
  Info,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
} from 'lucide-react'
import { InmobiliarioWidget } from '@/components/calculators/inmobiliario-widget'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: '¿Cuánto cuesta escriturar una casa en Quito? | Calculadora 2026',
  description:
    'Calcula gratis todos los gastos legales para comprar o vender un inmueble en Quito: notaría, alcabalas, registro de la propiedad y consejo provincial. Tarifas actualizadas 2026.',
  keywords: [
    'cuanto cuesta escriturar una casa en quito',
    'gastos de escrituración ecuador',
    'calculadora notarial inmueble',
    'costos compra vivienda quito',
    'alcabala quito 2026',
    'registro de la propiedad quito',
    'gastos legales compra casa ecuador',
    'plusvalía venta inmueble quito',
    'presupuesto escritura quito',
    'abogados online ecuador',
  ],
  openGraph: {
    title: '¿Cuánto cuesta escriturar una casa en Quito? | Calculadora 2026',
    description:
      'Calcula gratis todos los gastos legales para comprar o vender un inmueble en Quito. Notaría, alcabalas, registro y más. Actualizado 2026.',
    url: 'https://abogadosonlineecuador.com/calculadoras/inmuebles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Cuánto cuesta escriturar una casa en Quito? | Calculadora 2026',
    description:
      'Calcula gratis todos los gastos legales para comprar o vender un inmueble en Quito.',
  },
  alternates: {
    canonical: 'https://abogadosonlineecuador.com/calculadoras/inmuebles',
  },
}

const faqs = [
  {
    question: '¿Cuánto cuesta escriturar una casa en Quito en 2026?',
    answer:
      'El costo total de escriturar una casa en Quito depende del valor del inmueble. Incluye cuatro rubros principales: los aranceles notariales (tarifa gradual según la cuantía + 15% IVA), el impuesto de alcabala (1% del valor mayor entre precio de venta y avalúo catastral), el arancel del Registro de la Propiedad, y el impuesto del Consejo Provincial (10% de la alcabala + $1.60). En promedio, los gastos totales representan entre el 2% y el 5% del valor del inmueble.',
  },
  {
    question: '¿Quién paga los gastos de escrituración, el comprador o el vendedor?',
    answer:
      'En Ecuador, la costumbre es que el comprador asume la mayoría de los gastos: notaría, alcabalas, registro de la propiedad y consejo provincial. El vendedor paga únicamente el impuesto de plusvalía (utilidad), que se calcula sobre la ganancia entre el precio de compra original y el precio de venta actual. Nuestra calculadora te muestra los costos separados para cada parte.',
  },
  {
    question: '¿Qué es el avalúo catastral y cómo lo consulto?',
    answer:
      'El avalúo catastral es el valor que el Municipio de Quito asigna a tu propiedad para fines tributarios. Puedes descargar tu cédula catastral en pam.quito.gob.ec con tu número de predio. Es importante porque la alcabala se calcula sobre el valor mayor entre el precio de venta y el avalúo catastral. Si el avalúo es mayor que el precio declarado, pagarás más impuestos.',
  },
  {
    question: '¿Qué pasa si declaro un valor menor al real en la escritura?',
    answer:
      'Subdeclarar el valor de compraventa es una práctica riesgosa e ilegal. El SRI puede determinar valores de mercado y aplicar sanciones. Además, si alguna vez vendes el inmueble, la base para calcular tu plusvalía será el valor declarado, lo que resultará en un impuesto mucho mayor. Nuestra recomendación es siempre declarar el valor real de la transacción.',
  },
  {
    question: '¿Hay descuentos en los gastos de escrituración?',
    answer:
      'Sí, existen descuentos en algunos rubros. Para viviendas de interés social (hasta $60,000) hay un 25% de descuento en aranceles notariales. Los adultos mayores (65+) y personas con discapacidad tienen un 50% de descuento en el arancel del Registro de la Propiedad. Nuestra calculadora aplica estos descuentos automáticamente si seleccionas la opción correspondiente.',
  },
  {
    question: '¿Cuánto tiempo demora el trámite de escrituración?',
    answer:
      'El proceso completo de escrituración en Quito puede tomar entre 2 y 6 semanas. Esto incluye: la preparación de documentos (1 semana), la firma en notaría (1 día), el pago de alcabalas y consejo provincial (1-2 días), la inscripción en el Registro de la Propiedad (1-3 semanas). Tener todos los documentos listos puede acelerar significativamente el proceso.',
  },
]

export default function PresupuestadorInmobiliarioPage() {
  return (
    <>
      {/* JSON-LD: SoftwareApplication */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Presupuestador de Compra de Vivienda - Ecuador',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          description:
            'Calculadora gratuita que estima todos los gastos legales para comprar o vender un inmueble en Quito, Ecuador.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '243',
          },
          provider: {
            '@type': 'LegalService',
            name: 'Abogados Online Ecuador',
            url: 'https://abogadosonlineecuador.com',
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
            <li className="text-text-primary font-medium">Presupuestador Inmobiliario</li>
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
            ¿Cuánto cuesta escriturar
            <br className="hidden md:block" />
            <span className="text-accent-primary"> tu casa en Quito?</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Descubre en 30 segundos todos los gastos legales que necesitas para comprar o
            vender un inmueble. Sin sorpresas.
          </p>
        </div>

        {/* Layout principal: Calculator + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Widget */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">
                  Presupuestador de Compra de Vivienda
                </h2>
              </div>
              <InmobiliarioWidget />
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
                <h3 className="font-semibold text-text-primary">¿Qué incluye el cálculo?</h3>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Notaría</strong> — Aranceles según
                    tablas del Consejo de la Judicatura + IVA
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Alcabalas</strong> — 1% del valor
                    mayor (con rebajas por tiempo)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Registro</strong> — Arancel del
                    Registro de la Propiedad
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Consejo Provincial</strong> — 10%
                    de la alcabala + tarifa fija
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">Plusvalía</strong> — Impuesto a la
                    utilidad (solo vendedor)
                  </span>
                </li>
              </ul>
            </div>

            {/* Timeline */}
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-text-primary">Tiempo estimado</h3>
              </div>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Preparación de documentos: 1 semana
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Firma en notaría: 1 día
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Pago de impuestos: 1-2 días
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Inscripción en Registro: 1-3 semanas
                </li>
              </ul>
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-primary mb-2">
                ¿Necesita asesoría personalizada?
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Nuestro equipo legal puede guiarle en cada paso del proceso de escrituración.
              </p>
              <a
                href="https://wa.me/593979317579?text=Hola%2C%20necesito%20asesor%C3%ADa%20para%20escriturar%20un%20inmueble"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SEO CONTENT SECTION (300+ words) */}
        {/* ============================================ */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Todo lo que necesitas saber sobre los gastos de escrituración en Quito
          </h2>

          <div className="prose prose-invert max-w-none space-y-6 text-[var(--text-secondary)] text-base leading-relaxed">
            <p>
              Comprar o vender una vivienda en Quito implica una serie de{' '}
              <strong className="text-text-primary">gastos legales obligatorios</strong> que
              muchos compradores no consideran al momento de presupuestar. Estos costos
              adicionales pueden representar entre el 2% y el 5% del valor del inmueble, por
              lo que es fundamental conocerlos con anticipación para evitar sorpresas
              desagradables.
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              Gastos ocultos al comprar vivienda en Quito
            </h3>
            <p>
              Además del precio del inmueble, el comprador debe cubrir cuatro rubros
              principales: los <strong className="text-text-primary">aranceles notariales</strong>{' '}
              (que varían según el valor del inmueble y se calculan con tablas graduales
              establecidas por el Consejo de la Judicatura), el{' '}
              <strong className="text-text-primary">impuesto de alcabala</strong> (equivalente al
              1% del valor mayor entre el precio de venta y el avalúo catastral), el{' '}
              <strong className="text-text-primary">arancel del Registro de la Propiedad</strong>{' '}
              (necesario para inscribir la escritura y que el cambio de dueño sea legal), y el{' '}
              <strong className="text-text-primary">impuesto del Consejo Provincial</strong>{' '}
              (calculado como el 10% del valor de la alcabala más una tarifa fija de $1.80).
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              ¿Por qué NO debes subdeclarar el valor de compraventa?
            </h3>
            <p>
              Una práctica común pero peligrosa es declarar un valor menor al real en la
              escritura para ahorrar en impuestos. Esto puede traer consecuencias graves: el
              SRI tiene la facultad de determinar valores de mercado y aplicar sanciones, y si
              luego vendes el inmueble, el impuesto de plusvalía será mucho mayor porque la
              base de cálculo será el valor bajo que declaraste. Siempre recomendamos declarar
              el valor real de la transacción.
            </p>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              Requisitos para escriturar un inmueble en Quito
            </h3>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Cédulas de identidad de comprador y vendedor
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Certificado de gravámenes del Registro de la Propiedad
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Certificado de no adeudar al Municipio
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Pago de alcabalas y consejo provincial
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Carta de pago del impuesto predial al día
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-success shrink-0 mt-1" />
                Escritura anterior del inmueble (título de propiedad del vendedor)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-text-primary pt-4">
              Tiempos estimados del proceso
            </h3>
            <p>
              El proceso completo de escrituración puede tomar entre 2 y 6 semanas,
              dependiendo de la complejidad del caso y la disponibilidad de documentos. La
              preparación documental suele tomar 1 semana, la firma en notaría se realiza en
              un solo día, el pago de impuestos municipales requiere 1 a 2 días, y la
              inscripción en el Registro de la Propiedad puede demorar entre 1 y 3 semanas
              adicionales.
            </p>
          </div>
        </div>

        {/* ============================================ */}
        {/* HOW IT WORKS SECTION */}
        {/* ============================================ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            ¿Cómo funciona nuestro presupuestador?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">1</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Indica si compras o vendes
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Los costos varían según tu rol en la transacción. El comprador asume la mayoría
                de gastos, el vendedor solo paga plusvalía.
              </p>
            </div>
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">2</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Ingresa el valor del inmueble
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Usamos el precio de venta y el avalúo catastral para calcular cada impuesto
                con las tarifas oficiales vigentes.
              </p>
            </div>
            <div className="bg-bg-secondary border border-[var(--glass-border)] rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-[var(--accent-primary)]">3</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">
                Obtén tu presupuesto total
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                En segundos ves cuánto necesitas separar para gastos legales. Si quieres el
                desglose detallado, te lo enviamos a tu correo.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* INDIVIDUAL CALCULATOR LINKS */}
        {/* ============================================ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-4 text-center">
            Calculadoras individuales
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-8 max-w-2xl mx-auto">
            ¿Solo necesitas calcular un rubro específico? Usa nuestras calculadoras individuales.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CalculatorLink
              href="/calculadoras/notarial"
              label="Notarial"
              description="Aranceles de notaría"
            />
            <CalculatorLink
              href="/calculadoras/alcabalas"
              label="Alcabalas"
              description="Impuesto municipal"
            />
            <CalculatorLink
              href="/calculadoras/registro-propiedad"
              label="Registro"
              description="Registro de la Propiedad"
            />
            <CalculatorLink
              href="/calculadoras/consejo-provincial"
              label="Consejo Provincial"
              description="Impuesto provincial"
            />
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
            href="/servicios"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-bg-tertiary hover:text-text-primary transition-all"
          >
            <FileText className="w-4 h-4" />
            Ver nuestros servicios legales
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-bg-tertiary hover:text-text-primary transition-all"
          >
            <Shield className="w-4 h-4" />
            Contactar a un abogado
          </Link>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Nota Legal:</strong> Los valores calculados son referenciales y tienen
              carácter informativo. Los montos definitivos pueden variar según las normativas
              vigentes, la notaría seleccionada y las particularidades de cada caso. Esta
              herramienta se basa en las tarifas oficiales del Consejo de la Judicatura, el
              Municipio de Quito y el Registro de la Propiedad. Para un presupuesto exacto
              personalizado,{' '}
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

// ============================================
// SUB-COMPONENTS
// ============================================

function CalculatorLink({
  href,
  label,
  description,
}: {
  href: string
  label: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-4 bg-bg-secondary border border-[var(--glass-border)] rounded-xl hover:bg-bg-tertiary hover:border-[var(--glass-border-hover)] transition-all"
    >
      <div className="flex-1">
        <p className="font-medium text-text-primary text-sm group-hover:text-accent-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-accent-primary transition-colors" />
    </Link>
  )
}
