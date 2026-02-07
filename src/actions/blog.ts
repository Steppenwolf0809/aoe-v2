'use server'

import { createClient } from '@/lib/supabase/server'

export async function getPublishedPosts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[getPublishedPosts]', error)
    return []
  }

  return data
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('[getPostBySlug]', error)
    return null
  }

  return data
}
