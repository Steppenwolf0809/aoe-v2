'use server'

import { unstable_cache } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { BlogPost, BlogPostSummary, PublishedPostsResult } from '@/types/blog'

const POSTS_PER_PAGE = 6
const BLOG_REVALIDATE_SECONDS = 3600

function createBlogClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridas para cargar el blog.'
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function normalizePage(page: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1
  }

  return Math.floor(page)
}

function emptyPublishedPostsResult(page: number): PublishedPostsResult {
  return {
    posts: [],
    categories: [],
    pagination: {
      page,
      pageSize: POSTS_PER_PAGE,
      total: 0,
      totalPages: 1,
    },
  }
}

function mapSummaryPost(post: {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category: string | null
  published_at: string | null
}): BlogPostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? 'Lee la guia legal completa en Abogados Online Ecuador.',
    coverImage: post.cover_image,
    category: post.category,
    publishedAt: post.published_at,
  }
}

async function fetchPublishedPosts(
  page: number,
  category: string | null
): Promise<PublishedPostsResult> {
  const safePage = normalizePage(page)
  const normalizedCategory = category?.trim() ? category.trim() : null
  const from = (safePage - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  try {
    const supabase = createBlogClient()

    const baseQuery = supabase
      .from('blog_posts')
      .select(
        'id, slug, title, excerpt, cover_image, category, published_at',
        { count: 'exact' }
      )
      .eq('published', true)

    const filteredQuery = normalizedCategory
      ? baseQuery.eq('category', normalizedCategory)
      : baseQuery

    const postsPromise = filteredQuery
      .order('published_at', { ascending: false })
      .range(from, to)

    const categoriesPromise = supabase
      .from('blog_posts')
      .select('category')
      .eq('published', true)
      .not('category', 'is', null)

    const [{ data: postsData, error: postsError, count }, { data: categoriesData, error: categoriesError }] =
      await Promise.all([postsPromise, categoriesPromise])

    if (postsError || categoriesError) {
      console.error('[getPublishedPosts]', postsError ?? categoriesError)
      return emptyPublishedPostsResult(safePage)
    }

    const categories = [...new Set(
      (categoriesData ?? [])
        .map((item) => item.category)
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
    )].sort((a, b) => a.localeCompare(b, 'es'))

    const total = count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
    const posts = (postsData ?? []).map(mapSummaryPost)

    return {
      posts,
      categories,
      pagination: {
        page: safePage,
        pageSize: POSTS_PER_PAGE,
        total,
        totalPages,
      },
    }
  } catch (error) {
    console.error('[getPublishedPosts]', error)
    return emptyPublishedPostsResult(safePage)
  }
}

const getPublishedPostsCached = unstable_cache(
  async (page: number, category: string | null) => fetchPublishedPosts(page, category),
  ['blog-published-posts'],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ['blog-posts'],
  }
)

export async function getPublishedPosts(
  page = 1,
  category: string | null = null
): Promise<PublishedPostsResult> {
  return getPublishedPostsCached(normalizePage(page), category?.trim() ? category.trim() : null)
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createBlogClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select(
        'id, slug, title, content, excerpt, cover_image, category, tags, seo_title, seo_description, published, published_at, created_at, updated_at'
      )
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error || !data) {
      if (error) {
        console.error('[getPostBySlug]', error)
      }
      return null
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt ?? 'Guia legal publicada por Abogados Online Ecuador.',
      coverImage: data.cover_image,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      published: data.published,
      publishedAt: data.published_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('[getPostBySlug]', error)
    return null
  }
}

const getPostBySlugCached = unstable_cache(
  async (slug: string) => fetchPostBySlug(slug),
  ['blog-post-by-slug'],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ['blog-posts'],
  }
)

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const normalizedSlug = slug.trim()

  if (!normalizedSlug) {
    return null
  }

  return getPostBySlugCached(normalizedSlug)
}

async function fetchPublishedSlugs(): Promise<string[]> {
  try {
    const supabase = createBlogClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true)

    if (error) {
      console.error('[getPublishedSlugs]', error)
      return []
    }

    return (data ?? [])
      .map((item) => item.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
  } catch (error) {
    console.error('[getPublishedSlugs]', error)
    return []
  }
}

const getPublishedSlugsCached = unstable_cache(
  async () => fetchPublishedSlugs(),
  ['blog-published-slugs'],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ['blog-posts'],
  }
)

export async function getPublishedSlugs(): Promise<string[]> {
  return getPublishedSlugsCached()
}
