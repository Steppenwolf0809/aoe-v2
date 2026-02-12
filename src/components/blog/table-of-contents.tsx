import { cn } from '@/lib/utils'
import { extractHeadingsFromHtml } from '@/lib/blog/content'

interface TableOfContentsProps {
  content: string
  className?: string
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const items = extractHeadingsFromHtml(content)

  if (!items.length) {
    return null
  }

  return (
    <nav className={cn('space-y-1', className)} aria-label="Tabla de contenidos">
      <h2 className="text-sm font-semibold text-text-primary mb-3">Contenido</h2>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block text-sm py-1 transition-colors duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:text-[var(--accent-primary)]',
            item.level === 2 ? 'pl-0' : 'pl-4',
            'text-[var(--text-muted)]'
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
