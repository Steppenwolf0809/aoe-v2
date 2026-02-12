import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPublishedPosts } from '@/actions/blog'
import { CategoryFilter } from '@/components/blog/category-filter'
import { PostGrid } from '@/components/blog/post-grid'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

type BlogPageProps = {
  searchParams: Promise<{
    page?: string
    category?: string
  }>
}

function parsePage(pageParam: string | undefined) {
  const parsedPage = Number.parseInt(pageParam ?? '1', 10)
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
}

function buildPageHref(page: number, category: string | null) {
  const params = new URLSearchParams()

  if (category) {
    params.set('category', category)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  if (params.size === 0) {
    return '/blog'
  }

  return `/blog?${params.toString()}`
}

function buildPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog legal Ecuador | Abogados Online Ecuador',
    description:
      'Guias practicas sobre notaria, poderes, contratos y tramites legales en Ecuador con enfoque SEO local.',
    alternates: {
      canonical: `${SITE_URL}/blog`,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentPage = parsePage(params.page)
  const selectedCategory = params.category?.trim() ? params.category.trim() : null
  const result = await getPublishedPosts(currentPage, selectedCategory)

  if (result.pagination.total > 0 && currentPage > result.pagination.totalPages) {
    redirect(buildPageHref(result.pagination.totalPages, selectedCategory))
  }

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, result.pagination.totalPages)
  )
  const pageNumbers = buildPageNumbers(safeCurrentPage, result.pagination.totalPages)

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Blog legal</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-3xl leading-relaxed">
          Articulos y guias practicas para resolver tramites notariales y contractuales en
          Ecuador, incluyendo recursos para ecuatorianos en el exterior.
        </p>
      </header>

      <div className="mb-8">
        <CategoryFilter
          categories={result.categories}
          selectedCategory={selectedCategory}
        />
      </div>

      {result.posts.length > 0 ? (
        <PostGrid posts={result.posts} />
      ) : (
        <div className="rounded-2xl border border-[var(--glass-border)] bg-white p-8 text-center">
          <p className="text-[var(--text-secondary)]">
            No hay articulos para esta categoria en este momento.
          </p>
        </div>
      )}

      {result.pagination.totalPages > 1 && (
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
          aria-label="Paginacion del blog"
        >
          <Link
            href={buildPageHref(Math.max(1, safeCurrentPage - 1), selectedCategory)}
            aria-disabled={safeCurrentPage === 1}
            className="px-4 py-2 rounded-lg border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] hover:text-text-primary transition-colors duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Anterior
          </Link>

          {pageNumbers.map((pageNumber) => (
            <Link
              key={pageNumber}
              href={buildPageHref(pageNumber, selectedCategory)}
              aria-current={pageNumber === safeCurrentPage ? 'page' : undefined}
              className={
                pageNumber === safeCurrentPage
                  ? 'px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm'
                  : 'px-4 py-2 rounded-lg border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] hover:text-text-primary transition-colors duration-200'
              }
            >
              {pageNumber}
            </Link>
          ))}

          <Link
            href={buildPageHref(
              Math.min(result.pagination.totalPages, safeCurrentPage + 1),
              selectedCategory
            )}
            aria-disabled={safeCurrentPage === result.pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-[var(--glass-border)] text-sm text-[var(--text-secondary)] hover:text-text-primary transition-colors duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            Siguiente
          </Link>
        </nav>
      )}
    </section>
  )
}
