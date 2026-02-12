import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatBlogDate } from '@/lib/blog/content'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  category?: string | null
  coverImage?: string | null
  publishedAt?: string | null
}

export function PostCard({
  slug,
  title,
  excerpt,
  category,
  coverImage,
  publishedAt,
}: PostCardProps) {
  const dateLabel = formatBlogDate(publishedAt)

  return (
    <Link href={`/blog/${slug}`} className="block h-full group">
      <Card
        hover
        className="h-full overflow-hidden transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[var(--accent-primary)]"
      >
        <div className="relative h-44 overflow-hidden bg-[var(--bg-secondary)]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={`Imagen del articulo ${title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]" />
          )}
        </div>

        <CardContent className="p-5">
          {category && (
            <Badge variant="info" className="mb-3">{category}</Badge>
          )}

          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {title}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>

          {dateLabel && (
            <time className="text-xs text-[var(--text-muted)]">{dateLabel}</time>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
