'use client'

import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm transition-all cursor-pointer',
          selected === null
            ? 'bg-[var(--accent-primary)] text-white'
            : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
        )}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            'px-4 py-2 rounded-full text-sm transition-all cursor-pointer',
            selected === cat
              ? 'bg-[var(--accent-primary)] text-white'
              : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
