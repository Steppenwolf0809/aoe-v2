export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  category?: string
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  name: string
  slug: string
  count: number
}
