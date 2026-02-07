import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Stats } from '@/components/landing/stats'
import { CalculatorPreview } from '@/components/landing/calculator-preview'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { CTA } from '@/components/landing/cta'
import { JsonLd } from '@/components/seo/json-ld'
import { FaqSchema } from '@/components/seo/faq-schema'

const faqs = [
  {
    question: 'Son validos legalmente los contratos generados?',
    answer: 'Si, todos los contratos generados cumplen con la legislacion ecuatoriana vigente y son validos para su uso en notarias.',
  },
  {
    question: 'Como funciona la calculadora notarial?',
    answer: 'Nuestras calculadoras utilizan las tablas oficiales del Consejo de la Judicatura para calcular aranceles notariales de forma precisa.',
  },
  {
    question: 'Cuanto tiempo toma generar un contrato?',
    answer: 'El proceso completo toma entre 5 y 10 minutos. Solo necesitas llenar el formulario con los datos requeridos.',
  },
  {
    question: 'Que metodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de credito/debito y transferencias bancarias a traves de nuestra pasarela de pago segura.',
  },
  {
    question: 'Puedo modificar un contrato despues de generarlo?',
    answer: 'Si, con el plan Profesional puedes solicitar modificaciones ilimitadas a tus contratos.',
  },
]

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LegalService',
          name: 'Abogados Online Ecuador',
          description:
            'Plataforma legal tecnologica para generacion de contratos y calculadoras notariales en Ecuador.',
          url: 'https://abogadosonlineecuador.com',
          areaServed: {
            '@type': 'Country',
            name: 'Ecuador',
          },
          provider: {
            '@type': 'Organization',
            name: 'Abogados Online Ecuador',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Quito',
              addressCountry: 'EC',
            },
          },
        }}
      />
      <FaqSchema faqs={faqs} />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <CalculatorPreview />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
