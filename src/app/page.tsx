import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants'
import { Hero } from '@/components/landing/hero'
import { Stats } from '@/components/landing/stats'
import { Narrative } from '@/components/landing/narrative'
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

/* ----------------------------------------------------------------
   SEO Metadata — generateMetadata per PROMPT 06
   ---------------------------------------------------------------- */
export const metadata: Metadata = {
  title: `${SITE_NAME} | Servicios Notariales y Legales en Quito`,
  description:
    'Genera contratos vehiculares válidos legalmente, calcula costos notariales y simplifica tus trámites legales en Ecuador. Rápido, seguro y confiable.',
  keywords: [
    'abogados online ecuador',
    'contratos vehiculares',
    'calculadora notarial',
    'servicios notariales quito',
    'compra venta vehicular',
    'aranceles notariales ecuador',
    'registro de la propiedad',
  ],
  openGraph: {
    title: `${SITE_NAME} | Servicios Notariales y Legales en Quito`,
    description:
      'Genera contratos vehiculares válidos legalmente, calcula costos notariales y simplifica tus trámites legales en Ecuador.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'es_EC',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Servicios Notariales y Legales en Quito`,
    description:
      'Genera contratos vehiculares válidos legalmente, calcula costos notariales y simplifica tus trámites legales en Ecuador.',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

/* ----------------------------------------------------------------
   FAQ data for schema + component
   ---------------------------------------------------------------- */
const faqs = [
  {
    question: '¿Son válidos legalmente los contratos generados?',
    answer:
      'Sí, todos los contratos generados cumplen con la legislación ecuatoriana vigente y son válidos para su uso en notarías. Nuestros documentos están respaldados por 12+ años de experiencia notarial en Quito.',
  },
  {
    question: '¿Cómo funciona la calculadora notarial?',
    answer:
      'Nuestras calculadoras utilizan las tablas oficiales del Consejo de la Judicatura y las tarifas municipales vigentes para calcular aranceles notariales de forma precisa. Solo necesitas ingresar el valor del inmueble o vehículo y obtendrás un estimado detallado.',
  },
  {
    question: '¿Cuánto tiempo toma generar un contrato?',
    answer:
      'El proceso completo toma entre 5 y 10 minutos. Solo necesitas llenar el formulario con los datos requeridos, realizar el pago y recibirás tu contrato por correo electrónico listo para imprimir y firmar.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjetas de crédito y débito a través de nuestra pasarela de pago segura. También puedes realizar transferencias bancarias. Todos los pagos están protegidos con encriptación de última generación.',
  },
  {
    question: '¿Puedo modificar un contrato después de generarlo?',
    answer:
      'Sí, con el plan Profesional puedes solicitar modificaciones ilimitadas a tus contratos. Para el plan básico, puedes generar un nuevo contrato con los datos corregidos a un precio reducido.',
  },
]

/* ----------------------------------------------------------------
   Home Page
   ---------------------------------------------------------------- */
export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
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
                  name: 'Calculadoras Notariales',
                  description:
                    'Cálculo de aranceles notariales y de registro de la propiedad.',
                },
              },
            ],
          },
        }}
      />
      <FaqSchema faqs={faqs} />

      <Header />
      <main className="pt-16">
        <Hero />
        <Stats />
        <Narrative />
        <Features />
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
