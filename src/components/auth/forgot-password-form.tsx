'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { forgotPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    setError(null)

    const result = await forgotPassword(data)

    if (result.success) {
      setSuccess(true)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full space-y-6 text-center"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-accent-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-text-primary">
            Revisa tu email
          </h2>
          <p className="text-text-secondary text-sm">
            Si existe una cuenta con ese email, te hemos enviado instrucciones
            para recuperar tu contraseña.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/iniciar-sesion"
            className="text-sm text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6"
    >
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

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          hint="Ingresa el email asociado a tu cuenta"
          error={errors.email?.message}
          {...register('email')}
          disabled={isLoading}
          autoComplete="email"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Enviar instrucciones
        </Button>
      </form>

      {/* Back to login */}
      <div className="text-center">
        <Link
          href="/iniciar-sesion"
          className="text-sm text-accent-primary hover:text-accent-primary-hover font-medium transition-colors"
        >
          ← Volver a iniciar sesión
        </Link>
      </div>
    </motion.div>
  )
}
