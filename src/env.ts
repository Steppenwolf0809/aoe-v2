import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  PDF_SERVICE_URL: z.string().url().optional(),
  PDF_SERVICE_API_KEY: z.string().optional(),
  N8N_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  PAYPHONE_TOKEN: z.string().optional(),
  PAYPHONE_STORE_ID: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

// Only validate on server-side
export function getEnv(): Env {
  return envSchema.parse(process.env)
}

// Client-safe env (only NEXT_PUBLIC_ vars)
export const clientEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
}
