import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug} | Servicios | Abogados Online Ecuador`,
    description: `Informacion detallada sobre nuestro servicio de ${slug}.`,
  }
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      {/* TODO: implementar detalle del servicio */}
    </div>
  )
}
