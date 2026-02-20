import type { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPublishedPosts, getPublishedSlugs } from '@/actions/blog'
import { PostGrid } from '@/components/blog/post-grid'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { JsonLd } from '@/components/seo/json-ld'
import { formatBlogDate, injectHeadingIds } from '@/lib/blog/content'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const revalidate = 3600

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

const getCachedPostBySlug = cache(async (slug: string) => getPostBySlug(slug))

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getCachedPostBySlug(slug)

  if (!post) {
    return {
      title: 'Articulo no encontrado | Blog legal',
      description: 'El articulo solicitado no esta disponible.',
    }
  }

  const title = post.seoTitle ?? `${post.title} | Blog legal Ecuador`
  const description = post.seoDescription ?? post.excerpt

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getCachedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedResult = post.category
    ? await getPublishedPosts(1, post.category)
    : { posts: [] }
  const relatedPosts = relatedResult.posts
    .filter((relatedPost) => relatedPost.slug !== post.slug)
    .slice(0, 3)
  const postDate = formatBlogDate(post.publishedAt ?? post.createdAt)
  const contentHtml = injectHeadingIds(post.content)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    articleSection: post.category ?? undefined,
    keywords: post.tags,
    image: post.coverImage ? [post.coverImage] : undefined,
  }

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <JsonLd data={articleSchema} />

      <nav aria-label="Breadcrumbs" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
          <li>
            <Link href="/" className="hover:text-text-primary transition-colors duration-200">
              Inicio
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="hover:text-text-primary transition-colors duration-200">
              Blog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-text-primary">{post.title}</li>
        </ol>
      </nav>

      <header className="max-w-3xl mb-10">
        {post.category && (
          <p className="text-sm font-medium text-[var(--accent-primary)] mb-3">{post.category}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
          {post.title}
        </h1>
        {postDate && (
          <time className="text-sm text-[var(--text-muted)]">{postDate}</time>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-10 items-start">
        <article className="rounded-2xl border border-[var(--glass-border)] bg-white p-6 sm:p-8">
          <div
            className="blog-content text-[var(--text-secondary)] leading-7 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text-primary [&_ul]:list-disc [&_ol]:list-decimal"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        <aside className="xl:sticky xl:top-28 rounded-2xl border border-[var(--glass-border)] bg-white p-5">
          <TableOfContents content={post.content} />
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-text-primary mb-6">Articulos relacionados</h2>
          <PostGrid posts={relatedPosts} />
        </section>
      )}
    </section>
  )
}
