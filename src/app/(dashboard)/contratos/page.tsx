import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedUser } from '@/components/auth/auth-guard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ContractActions } from '@/components/contracts/contract-actions'

export const metadata: Metadata = {
  title: 'Mis Contratos | Dashboard | Abogados Online Ecuador',
}

interface Contract {
  id: string
  type: string
  status: 'DRAFT' | 'PAID' | 'GENERATED' | 'DOWNLOADED' | 'PENDING_PAYMENT'
  data: Record<string, unknown>
  amount: number | null
  created_at: string
  download_token: string | null
}

const statusLabel: Record<Contract['status'], string> = {
  DRAFT: 'Borrador',
  PENDING_PAYMENT: 'Pago pendiente',
  PAID: 'Pagado',
  GENERATED: 'Generado',
  DOWNLOADED: 'Descargado',
}

const statusVariant: Record<
  Contract['status'],
  'default' | 'info' | 'warning' | 'success'
> = {
  DRAFT: 'default',
  PENDING_PAYMENT: 'warning',
  PAID: 'info',
  GENERATED: 'warning',
  DOWNLOADED: 'success',
}

export default async function ContratosPage() {
  const user = await getAuthenticatedUser()
  const supabase = await createClient()

  const { data: contracts } = await supabase
    .from('contracts')
    .select('id,type,status,data,amount,created_at,download_token')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const items = (contracts || []) as Contract[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Mis contratos
          </h2>
          <p className="text-sm text-text-secondary">
            Gestiona tus contratos de compraventa vehicular.
          </p>
        </div>
        <Button asChild variant="primary" size="sm">
          <Link href="/dashboard/contratos/nuevo">
            <Plus className="w-4 h-4 mr-1" />
            Nuevo contrato
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-accent-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Sin contratos aun
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mb-6">
              Crea tu primer contrato de compraventa vehicular en minutos con
              nuestro asistente paso a paso.
            </p>
            <Button asChild variant="primary">
              <Link href="/dashboard/contratos/nuevo">
                <Plus className="w-4 h-4 mr-1" />
                Crear primer contrato
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((contract) => {
            const vehicleData = contract.data as {
              vehiculo?: { placa?: string; marca?: string; modelo?: string }
            }
            const placa = vehicleData?.vehiculo?.placa || '—'
            const vehiculo = vehicleData?.vehiculo
              ? `${vehicleData.vehiculo.marca || ''} ${vehicleData.vehiculo.modelo || ''}`
              : 'Contrato vehicular'

            return (
              <Card
                key={contract.id}
                className="bg-[var(--glass-bg)] border-[var(--glass-border)]"
              >
                <CardContent className="py-4 px-4 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="hidden sm:flex w-10 h-10 rounded-xl bg-accent-primary/10 items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-accent-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {vehiculo}
                        </p>
                        <p className="text-xs text-text-muted">
                          {placa} &middot; {formatDate(contract.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {contract.amount && (
                        <span className="text-sm font-medium text-text-primary hidden sm:block">
                          {formatCurrency(contract.amount)}
                        </span>
                      )}
                      <Badge variant={statusVariant[contract.status]}>
                        {statusLabel[contract.status]}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                    <ContractActions
                      contractId={contract.id}
                      status={contract.status}
                      downloadToken={contract.download_token || undefined}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
