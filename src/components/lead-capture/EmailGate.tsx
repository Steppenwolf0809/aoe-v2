'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight, CheckCircle2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { leadCaptureSchema, type LeadCaptureInput } from '@/lib/validations/leads'

interface EmailGateProps {
  title?: string
  description?: string
  buttonText?: string
  source: string
  onSubmit: (data: LeadCaptureInput) => Promise<void>
  whatsappUrl?: string
  className?: string
}

export function EmailGate({
  title = '¿Quieres saber a dónde va tu dinero?',
  description = 'Recibe el desglose completo y una checklist de documentos en tu correo.',
  buttonText = 'Enviar a mi correo',
  source,
  onSubmit: onSubmitProp,
  whatsappUrl = 'https://wa.me/593979317579?text=Hola%2C%20quiero%20agendar%20una%20asesor%C3%ADa',
  className,
}: EmailGateProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadCaptureInput>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: { source },
  })

  const handleFormSubmit = async (data: LeadCaptureInput) => {
    setLoading(true)
    setServerError(null)
    try {
      await onSubmitProp({ ...data, source })
      setSubmitted(true)
    } catch {
      setServerError('Hubo un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={className}
    >
      <Card className="relative overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-3"
              >
                <div className="w-14 h-14 bg-accent-success/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-accent-success" />
                </div>
                <p className="text-text-primary font-semibold text-lg">¡Listo!</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Revisa tu correo en unos minutos. Te enviamos el desglose completo.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }} className="space-y-5">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                  <input type="hidden" {...register('source')} />

                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
                    <Input
                      id="gate-email"
                      type="email"
                      placeholder="tu@correo.com"
                      {...register('email')}
                      error={errors.email?.message}
                      className="pl-10"
                    />
                  </div>

                  <Input
                    id="gate-name"
                    placeholder="Tu nombre (opcional)"
                    {...register('name')}
                  />

                  {serverError && (
                    <p className="text-xs text-accent-error text-center">{serverError}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={loading}
                  >
                    {buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--glass-border)]" />
                  <span className="text-xs text-[var(--text-muted)]">o</span>
                  <div className="flex-1 h-px bg-[var(--glass-border)]" />
                </div>

                {/* WhatsApp alternative */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-[var(--radius-md)] border border-bg-secondary border-[var(--glass-border)] text-[var(--text-secondary)] hover:bg-bg-tertiary hover:border-[var(--glass-border-hover)] transition-all duration-200 text-sm font-medium cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Prefiero agendar una cita
                </a>

                {/* Trust signal */}
                <p className="text-[11px] text-center text-[var(--text-muted)] flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Tus datos están seguros. No spam.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
