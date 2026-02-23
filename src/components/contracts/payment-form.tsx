'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Loader2, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PRECIO_CONTRATO_BASICO } from '@/lib/formulas/vehicular'
import { initiatePayment } from '@/actions/payments'

interface PaymentFormProps {
    contractId: string
    defaultEmail: string
    initialError?: string
}

export function PaymentForm({ contractId, defaultEmail, initialError }: PaymentFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(initialError || null)
    const [isPolling, setIsPolling] = useState(false)

    // Polling logic when isPolling is true
    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isPolling) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payments/status?contractId=${contractId}`)
                    const data = await res.json()

                    if (data.success && data.redirectUrl) {
                        clearInterval(interval)
                        setIsPolling(false)
                        router.push(data.redirectUrl)
                    } else if (data.status === 'PAID' || data.status === 'GENERATED' || data.status === 'DOWNLOADED') {
                        clearInterval(interval)
                        setIsPolling(false)
                        if (data.redirectUrl) {
                            router.push(data.redirectUrl)
                        } else {
                            router.push(`/contratos/pago/exito?contractId=${contractId}&pending=true`)
                        }
                    }
                } catch (err) {
                    console.error('Polling error', err)
                }
            }, 3000) // Poll every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isPolling, contractId, router])

    async function handlePayment(formData: FormData) {
        setIsPending(true)
        setError(null)

        try {
            const result = await initiatePayment(formData)

            if (!result.success) {
                setError(result.error)
                setIsPending(false)
                setIsPolling(false)
                return
            }

            // En móvil, redirigir en la misma pestaña (los popups se bloquean en móvil)
            // El callback page maneja todo: confirmar pago, generar PDF, y redirigir a éxito
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )

            if (isMobile) {
                window.location.href = result.data.paymentUrl
                return
            }

            // En escritorio, abrir en nueva pestaña y hacer polling
            window.open(result.data.paymentUrl, '_blank')
            setIsPolling(true)
        } catch (err) {
            setError('Error inesperado al iniciar el pago')
            setIsPending(false)
            setIsPolling(false)
        }
    }

    if (isPolling) {
        return (
            <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)] border-accent-primary shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.15)] ring-1 ring-accent-primary/20">
                <CardContent className="p-8 space-y-6 text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <CreditCard className="w-16 h-16 text-text-tertiary absolute " />
                        <Loader2 className="w-8 h-8 text-accent-primary absolute bottom-0 right-0 animate-spin bg-bg-primary rounded-full" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-text-primary">
                            Esperando confirmación...
                        </h3>
                        <p className="text-sm text-text-secondary">
                            Se ha abierto una nueva pestaña segura para realizar el pago con PayPhone.
                            Una vez que completes el pago, esta pantalla detectará la confirmación y generará tu contrato.
                        </p>
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-text-muted bg-bg-secondary p-3 rounded-lg">
                            ¿No se abrió la pestaña? Verifica que tu navegador no esté bloqueando las ventanas emergentes (pop-ups).
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsPolling(false)
                            setIsPending(false)
                        }}
                        className="mt-4 w-full"
                    >
                        Cancelar o intentar de nuevo
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-4">
                        <p className="text-sm text-red-500">{error}</p>
                    </CardContent>
                </Card>
            )}

            <form action={handlePayment} className="space-y-4">
                <input type="hidden" name="contractId" value={contractId} />

                <Card className="bg-[var(--glass-bg)] border-[var(--glass-border)]">
                    <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-text-primary font-medium">
                            <Mail className="w-5 h-5 text-accent-primary" />
                            <span>¿Dónde enviamos tu contrato?</span>
                        </div>
                        <input
                            type="email"
                            name="deliveryEmail"
                            defaultValue={defaultEmail}
                            required
                            placeholder="tu@email.com"
                            className="w-full rounded-lg border border-[var(--glass-border)] bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary"
                        />
                        <p className="text-xs text-text-muted">
                            Recibirás un enlace para descargar tu contrato en este correo
                        </p>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-12 text-base transition-all z-10 relative overflow-hidden group"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Iniciando pago seguro...
                        </>
                    ) : (
                        <>
                            Pagar {formatCurrency(PRECIO_CONTRATO_BASICO)} con PayPhone
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
