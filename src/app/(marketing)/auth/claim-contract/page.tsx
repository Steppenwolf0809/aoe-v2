'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { claimContract } from '@/actions/contracts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Loader2 } from 'lucide-react'

function ClaimContractContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const contractId = searchParams.get('contractId')

  const [step, setStep] = useState<'auth' | 'claiming' | 'success' | 'error'>(
    'auth'
  )
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && contractId) {
        // Already authenticated, claim contract immediately
        await handleClaimContract()
      }
    }

    checkAuth()
  }, [contractId])

  if (!contractId) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-[var(--glass-bg)] border-[var(--glass-border)]">
          <CardContent className="p-8 text-center">
            <p className="text-text-secondary">
              ID de contrato no encontrado
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/claim-contract?contractId=${contractId}`,
          },
        })

        if (error) {
          setError(error.message)
          setIsLoading(false)
          return
        }

        // After signup, automatically claim contract
        await handleClaimContract()
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
          setIsLoading(false)
          return
        }

        // After login, automatically claim contract
        await handleClaimContract()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setIsLoading(false)
    }
  }

  async function handleClaimContract() {
    setStep('claiming')
    setError(null)

    try {
      const result = await claimContract(contractId!)

      if (result.success) {
        setStep('success')
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/contratos')
        }, 2000)
      } else {
        setStep('error')
        setError(result.error)
      }
    } catch (err) {
      setStep('error')
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full bg-[var(--glass-bg)] border-[var(--glass-border)]">
        <CardContent className="p-8 space-y-6">
          {step === 'auth' && (
            <>
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                <h2 className="text-2xl font-bold text-text-primary">
                  ¡Pago exitoso!
                </h2>
                <p className="text-sm text-text-secondary">
                  Crea tu cuenta para descargar el contrato
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-1 block">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Crear cuenta y descargar' : 'Iniciar sesión'}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-accent-primary hover:underline w-full text-center"
                >
                  {isSignUp
                    ? '¿Ya tienes cuenta? Inicia sesión'
                    : '¿No tienes cuenta? Regístrate'}
                </button>
              </form>
            </>
          )}

          {step === 'claiming' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent-primary" />
              <h2 className="text-xl font-semibold text-text-primary">
                Generando tu contrato...
              </h2>
              <p className="text-sm text-text-secondary">
                Por favor espera un momento
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold text-text-primary">
                ¡Contrato generado!
              </h2>
              <p className="text-sm text-text-secondary">
                Redirigiendo al dashboard...
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <div className="text-red-500 text-sm">
                {error || 'Error al generar el contrato'}
              </div>
              <Button
                onClick={handleClaimContract}
                variant="primary"
                className="w-full"
              >
                Reintentar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClaimContractPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClaimContractContent />
    </Suspense>
  )
}
