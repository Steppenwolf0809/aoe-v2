import type { Metadata } from 'next'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionCard } from '@/components/dashboard/subscription-card'

export const metadata: Metadata = {
  title: 'Suscripcion | Dashboard | Abogados Online Ecuador',
}

const features = [
  {
    name: 'Calculadoras notariales',
    free: true,
    premium: true,
  },
  {
    name: 'Historial de contratos',
    free: true,
    premium: true,
  },
  {
    name: 'Soporte prioritario',
    free: false,
    premium: true,
  },
  {
    name: 'Plantillas premium',
    free: false,
    premium: true,
  },
]

export default async function SuscripcionPage() {
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan,active')
    .eq('user_id', user.id)
    .maybeSingle()

  const rawPlan = subscription?.plan || 'FREE'
  const currentPlan: 'FREE' | 'PREMIUM' =
    rawPlan === 'PREMIUM' ? 'PREMIUM' : 'FREE'
  const active = subscription?.active ?? true

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Mi suscripcion</h2>
        <p className="text-sm text-text-secondary">
          Consulta tu plan actual y compara beneficios disponibles.
        </p>
      </div>

      <SubscriptionCard plan={currentPlan} active={active} />

      <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardHeader>
          <CardTitle>Comparativa de planes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-text-secondary">
                  <th className="text-left py-3 pr-4 font-medium">Feature</th>
                  <th className="text-center py-3 px-2 font-medium">FREE</th>
                  <th className="text-center py-3 px-2 font-medium">PREMIUM</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-[var(--glass-border)] last:border-b-0"
                  >
                    <td className="py-3 pr-4 text-text-primary">{feature.name}</td>
                    <td className="py-3 px-2">
                      <PlanCheck enabled={feature.free} />
                    </td>
                    <td className="py-3 px-2">
                      <PlanCheck enabled={feature.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlanCheck({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return (
      <div className="flex justify-center text-accent-success">
        <Check className="w-4 h-4" />
      </div>
    )
  }

  return (
    <div className="flex justify-center text-text-muted">
      <X className="w-4 h-4" />
    </div>
  )
}
