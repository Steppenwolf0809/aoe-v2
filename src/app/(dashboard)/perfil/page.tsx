import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/dashboard/profile-form'

export const metadata: Metadata = {
  title: 'Perfil | Dashboard | Abogados Online Ecuador',
}

export default async function PerfilPage() {
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name,phone')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Mi perfil</h2>
        <p className="text-sm text-text-secondary">
          Mantén actualizada tu información de contacto para agilizar tus
          trámites.
        </p>
      </div>

      <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialFullName={profile?.full_name || ''}
            initialPhone={profile?.phone}
            email={user.email}
          />
        </CardContent>
      </Card>
    </div>
  )
}
