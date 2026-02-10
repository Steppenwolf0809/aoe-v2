import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { FileText, FolderOpen, CreditCard, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard | Abogados Online Ecuador',
}

interface ContractSummary {
  id: string
  type: string
  status: 'DRAFT' | 'PAID' | 'GENERATED' | 'DOWNLOADED'
  created_at: string
}

const statusBadgeVariant: Record<
  ContractSummary['status'],
  'default' | 'info' | 'warning' | 'success'
> = {
  DRAFT: 'default',
  PAID: 'info',
  GENERATED: 'warning',
  DOWNLOADED: 'success',
}

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const [{ data: recentContracts }, { data: subscription }, { count: totalContracts }] =
    await Promise.all([
      supabase
        .from('contracts')
        .select('id,type,status,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('subscriptions')
        .select('plan,active')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('contracts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

  const contracts = (recentContracts || []) as ContractSummary[]
  const currentPlan = subscription?.plan || 'FREE'
  const isSubscriptionActive = subscription?.active ?? true
  const generatedContracts = contracts.filter(
    (contract) =>
      contract.status === 'GENERATED' || contract.status === 'DOWNLOADED'
  ).length

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle className="text-sm text-text-secondary">
              Total contratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">
              {totalContracts ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle className="text-sm text-text-secondary">
              Contratos generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-text-primary">
              {generatedContracts}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle className="text-sm text-text-secondary">
              Plan actual
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <p className="text-2xl font-bold text-text-primary">{currentPlan}</p>
            <Badge variant={isSubscriptionActive ? 'success' : 'default'}>
              {isSubscriptionActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle className="text-sm text-text-secondary">
              Accion rapida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="primary" size="sm">
              <Link href="/contratos/vehicular">Nuevo contrato</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle>Contratos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contracts.length === 0 && (
              <p className="text-sm text-text-secondary">
                Aun no tienes contratos. Crea el primero para iniciar tu flujo
                documental.
              </p>
            )}

            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {contract.type}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(contract.created_at).toLocaleDateString('es-EC')}
                  </p>
                </div>
                <Badge variant={statusBadgeVariant[contract.status]}>
                  {contract.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardHeader>
            <CardTitle>Accesos rapidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickLink
              href="/dashboard/contratos"
              title="Gestionar contratos"
              description="Revisa estado y descarga de tus contratos."
              icon={<FileText className="w-4 h-4" />}
            />
            <QuickLink
              href="/dashboard/documentos"
              title="Documentos"
              description="Sube y consulta archivos de tu tramite."
              icon={<FolderOpen className="w-4 h-4" />}
            />
            <QuickLink
              href="/dashboard/suscripcion"
              title="Suscripcion"
              description="Consulta beneficios de tu plan actual."
              icon={<CreditCard className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string
  title: string
  description: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)]/40 px-4 py-3 transition-colors hover:bg-[var(--bg-tertiary)]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[var(--accent-primary)]">{icon}</div>
        <div>
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
