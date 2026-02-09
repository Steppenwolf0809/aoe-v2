'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { register as registerUser, loginWithGoogle } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    const result = await registerUser(data)

    if (result.success) {
      // Redirigir a la página de verificación de email
      router.push('/verificar-email')
    } else {
      setError(result.error)
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const result = await loginWithGoogle()

    if (result.success) {
      window.location.href = result.data
    } else {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[var(--bg-primary)] text-text-muted">
            O regístrate con email
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-[var(--radius-md)] bg-accent-error/10 border border-accent-error/20"
        >
          <p className="text-sm text-accent-error">{error}</p>
        </motion.div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="fullName"
          type="text"
          label="Nombre completo"
          placeholder="Juan Pérez"
          error={errors.fullName?.message}
          {...register('fullName')}
          disabled={isLoading}
          autoComplete="name"
        />

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
          disabled={isLoading}
          autoComplete="email"
        />

        <Input
          id="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
          disabled={isLoading}
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirmar contraseña"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          disabled={isLoading}
          autoComplete="new-password"
        />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="acceptedTerms"
            type="checkbox"
            {...register('acceptedTerms')}
            disabled={isLoading}
            className="mt-1 w-4 h-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary cursor-pointer"
          />
          <label
            htmlFor="acceptedTerms"
            className="text-sm text-text-secondary cursor-pointer"
          >
            Acepto los{' '}
            <Link
              href="/legal/terminos"
              className="text-accent-primary hover:text-accent-primary-hover"
              target="_blank"
            >
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link
              href="/legal/privacidad"
              className="text-accent-primary hover:text-accent-primary-hover"
              target="_blank"
            >
              política de privacidad
            </Link>
          </label>
        </div>
        {errors.acceptedTerms && (
          <p className="text-xs text-accent-error -mt-2">
            {errors.acceptedTerms.message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Crear cuenta
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm text-text-secondary">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/iniciar-sesion"
          className="text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
        >
          Inicia sesión
        </Link>
      </div>
    </motion.div>
  )
}
