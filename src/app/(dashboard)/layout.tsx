import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const userName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Usuario'

  async function handleSignOut() {
    'use server'
    const serverClient = await createClient()
    await serverClient.auth.signOut()
    redirect('/iniciar-sesion')
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />

      <div className="flex-1 pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-[var(--glass-border)] bg-[var(--bg-secondary)]/70 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Area privada
              </p>
              <h1 className="text-sm sm:text-base font-semibold text-text-primary">
                Hola, {userName}
              </h1>
            </div>

            <form action={handleSignOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </Button>
            </form>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
