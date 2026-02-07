import { createClient } from '@supabase/supabase-js'

// WARNING: This client uses the service role key.
// NEVER import this file in client-side code.
// Only use in Server Actions, Route Handlers, or server-only modules.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
