import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants'
import { HeroSection } from '@/components/landing/HeroSection'
import { Stats } from '@/components/landing/stats'
import { DebtEvaluatorPreview } from '@/components/landing/debt-evaluator-preview'
import { Features } from '@/components/landing/features'
import { CalculatorPreview } from '@/components/landing/calculator-preview'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { BlogPreview } from '@/components/landing/blog-preview'
import { CTA } from '@/components/landing/cta'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqSchema } from '@/components/seo/faq-schema'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Notaría Digital y Negociación de Deudas`,
  description:
    'Soluciones legales ágiles para trámites notariales, calculadoras jurídicas y negociación de deudas en Ecuador. Tecnología legal con 12 años de experiencia.',
  keywords: [
    'abogados online ecuador',
    'negociación de deudas ecuador',
    'deudas en mora ecuador',
    'blindaje judicial ecuador',
    'notaria digital ecuador',
    'contratos vehiculares',
    'calculadora notarial',
    'trámites notariales ecuador',
    'escrituras ecuador',
  ],
  openGraph: {
    title: `${SITE_NAME} | Notaría Digital y Negociación de Deudas`,
    description:
      'Plataforma legal para trámites notariales, calculadoras jurídicas y negociación extrajudicial con blindaje judicial.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Notaría Digital y Negociación de Deudas`,
    description:
      'Soluciones legales ágiles para trámites notariales y crisis de deuda en Ecuador.',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const faqs = [
  {
    question: '¿La evaluación de deuda tiene costo?',
    answer:
      'La evaluación inicial desde la home es gratuita y genera un PDF de pre-diagnóstico. Una asesoría personalizada o una estrategia de negociación se cotiza después de revisar el caso.',
  },
  {
    question: '¿Pueden garantizar que eliminarán mi deuda?',
    answer:
      'No prometemos eliminar deudas ni detener procesos de forma garantizada. Evaluamos documentos, riesgo y capacidad de pago para proponer una negociación o defensa responsable.',
  },
  {
    question: '¿Qué pasa si ya recibí una notificación de cobro?',
    answer:
      'Debes guardar la notificacion, revisar fechas y evitar firmar acuerdos sin entender sus efectos. El evaluador ayuda a ordenar la informacion para una primera estrategia.',
  },
  {
    question: '¿La negociación es extrajudicial o también hay defensa judicial?',
    answer:
      'La oferta se plantea como Negociación Extrajudicial con Blindaje Judicial: buscamos acuerdo, pero revisamos documentos y plazos por si el conflicto escala.',
  },
  {
    question: '¿Qué necesito para empezar un trámite notarial?',
    answer:
      'Depende del acto, pero normalmente necesitas datos de las partes, documentos de identidad y antecedentes del bien o contrato. Puedes iniciar en servicios o calcular costos antes de avanzar.',
  },
]

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LegalService',
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
          areaServed: {
            '@type': 'Country',
            name: 'Ecuador',
          },
          provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Quito',
              addressRegion: 'Pichincha',
              addressCountry: 'EC',
            },
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios Legales',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Contratos Vehiculares Automatizados',
                  description:
                    'Generación de contratos de compra-venta vehicular válidos legalmente.',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Tramites Notariales Digitales',
                  description:
                    'Orientación y preparación de escrituras, poderes, certificaciones y documentos notariales.',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Calculadoras Notariales',
                  description:
                    'Cálculo de aranceles notariales y de registro de la propiedad.',
                },
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Negociación de Deudas',
                  description:
                    'Evaluación inicial de riesgo, negociación extrajudicial y preparación de blindaje judicial.',
                },
              },
            ],
          },
        }}
      />
      <FaqSchema faqs={faqs} />

      <Header />
      <main className="pt-16">
        <HeroSection />
        <Features />
        <Stats />
        <DebtEvaluatorPreview />
        <CalculatorPreview />
        <Testimonials />
        <BlogPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
