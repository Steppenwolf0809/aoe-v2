import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createOrUpdateBlogDraft, publishBlogPost } from '@/actions/blog'

// ---------------------------------------------------------------------------
// Event schemas
// ---------------------------------------------------------------------------

const blogCreateSchema = z.object({
  event: z.literal('blog.create'),
  data: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
})

const blogPublishSchema = z.object({
  event: z.literal('blog.publish'),
  data: z.object({
    slug: z.string().min(1),
  }),
})

const contractPostSaleSchema = z.object({
  event: z.literal('contract.post_sale'),
  data: z.object({
    contractId: z.string().uuid(),
    email: z.string().email(),
    type: z.string().optional(),
    amount: z.number().optional(),
  }),
})

const webhookEventSchema = z.discriminatedUnion('event', [
  blogCreateSchema,
  blogPublishSchema,
  contractPostSaleSchema,
])

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-webhook-secret')
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = webhookEventSchema.safeParse(body)

    if (!parsed.success) {
      console.error('[n8n Webhook] Invalid payload:', parsed.error.flatten())
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    const { event, data } = parsed.data

    switch (event) {
      case 'blog.create': {
        const result = await createOrUpdateBlogDraft(data)
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        console.log('[n8n Webhook] Blog draft created/updated:', data.slug)
        return NextResponse.json({ received: true, slug: data.slug })
      }

      case 'blog.publish': {
        const result = await publishBlogPost(data.slug)
        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        console.log('[n8n Webhook] Blog post published:', data.slug)
        return NextResponse.json({ received: true, slug: data.slug, published: true })
      }

      case 'contract.post_sale': {
        // Log for now — the actual email is sent by the callback page via Resend.
        // This event is for CRM/notification integrations handled in n8n itself.
        console.log('[n8n Webhook] Post-sale event for contract:', data.contractId)
        return NextResponse.json({ received: true, contractId: data.contractId })
      }
    }
  } catch (error) {
    console.error('[n8n Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
