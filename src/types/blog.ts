export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  category: string | null
  publishedAt: string | null
}

export interface BlogPost extends BlogPostSummary {
  content: string
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PublishedPostsResult {
  posts: BlogPostSummary[]
  categories: string[]
  pagination: BlogPagination
}
