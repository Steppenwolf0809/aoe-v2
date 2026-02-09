import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SubscriptionCardProps {
  plan: 'FREE' | 'PREMIUM'
  active: boolean
}

export function SubscriptionCard({ plan, active }: SubscriptionCardProps) {
  return (
    <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Mi Suscripcion</h3>
          <Badge variant={active ? 'success' : 'default'}>
            {active ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary mb-1">{plan}</div>
        <p className="text-sm text-[var(--text-secondary)]">
          {plan === 'FREE'
            ? 'Plan gratuito con acceso a funciones esenciales.'
            : 'Acceso prioritario y herramientas premium del portal.'}
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-4">
          Upgrade (proximamente)
        </Button>
      </CardContent>
    </Card>
  )
}
