import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
}

function buildCategoryHref(category: string | null) {
  if (!category) {
    return '/blog'
  }

  const params = new URLSearchParams({ category })
  return `/blog?${params.toString()}`
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-2">
        <Link
          href={buildCategoryHref(null)}
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-full text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
            selectedCategory === null
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          )}
        >
          Todos
        </Link>

        {categories.map((category) => (
          <Link
            key={category}
            href={buildCategoryHref(category)}
            className={cn(
              'inline-flex items-center px-4 py-2 rounded-full text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
              selectedCategory === category
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            )}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  )
}
