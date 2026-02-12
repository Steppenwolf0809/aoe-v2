import type { BlogPostSummary } from '@/types/blog'
import { PostCard } from './post-card'

interface PostGridProps {
  posts: BlogPostSummary[]
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}
