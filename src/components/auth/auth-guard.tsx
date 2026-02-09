import type { User } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface AuthGuardProps {
  children: ReactNode
  redirectTo?: string
}

export async function getAuthenticatedUser(
  redirectTo: string = '/iniciar-sesion'
): Promise<User> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}

export async function AuthGuard({
  children,
  redirectTo = '/iniciar-sesion',
}: AuthGuardProps) {
  await getAuthenticatedUser(redirectTo)
  return <>{children}</>
}
