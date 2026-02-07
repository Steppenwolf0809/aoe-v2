import { JsonLd } from './json-ld'

interface FaqItem {
  question: string
  answer: string
}

interface FaqSchemaProps {
  faqs: FaqItem[]
}

export function FaqSchema({ faqs }: FaqSchemaProps) {
  const data = {
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
  }

  return <JsonLd data={data} />
}
