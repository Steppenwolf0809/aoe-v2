'use client'

import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
  activeId?: string
}

export function TableOfContents({ items, activeId }: TableOfContentsProps) {
  return (
    <nav className="space-y-1">
      <h4 className="text-sm font-semibold text-white mb-3">Contenido</h4>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block text-sm py-1 transition-colors',
            item.level === 2 ? 'pl-0' : 'pl-4',
            activeId === item.id
              ? 'text-[var(--accent-primary)]'
              : 'text-[var(--text-muted)] hover:text-white'
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
