import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')} | Blog | Abogados Online Ecuador`,
    description: `Articulo sobre ${slug.replace(/-/g, ' ')} en el blog de Abogados Online Ecuador.`,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  return (
    <article className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-4 capitalize">
        {slug.replace(/-/g, ' ')}
      </h1>
      {/* TODO: implementar renderizado de post */}
    </article>
  )
}
