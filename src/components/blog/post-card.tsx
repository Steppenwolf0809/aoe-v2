import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  category?: string
  date: string
}

export function PostCard({ slug, title, excerpt, category, date }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 cursor-pointer group">
        <CardContent className="p-0">
          {category && (
            <Badge variant="info" className="mb-3">{category}</Badge>
          )}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">{excerpt}</p>
          <time className="text-xs text-[var(--text-muted)]">{date}</time>
        </CardContent>
      </Card>
    </Link>
  )
}
