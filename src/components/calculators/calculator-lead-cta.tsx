'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Loader2, Mail, MessageCircle } from 'lucide-react'
import { captureLead } from '@/actions/leads'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface CalculatorLeadCTAProps {
  source: string
  /** Short label for what the user calculated, e.g. "Notarial" */
  calculatorLabel: string
  whatsappMessage?: string
}

const WHATSAPP_BASE = 'https://wa.me/593999284221'

export function CalculatorLeadCTA({ source, calculatorLabel, whatsappMessage }: CalculatorLeadCTAProps) {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      setStatus('error')
      setErrorMsg('Ingresa tu email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus('error')
      setErrorMsg('Ingresa un email válido')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const result = await captureLead(
        {
          email: formData.email,
          name: formData.name || undefined,
          source,
        },
        { sendWelcomeEmail: true },
      )

      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(result.error || 'Error al guardar')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Error de conexión. Intenta de nuevo.')
    }
  }

  const whatsappUrl = whatsappMessage
    ? `${WHATSAPP_BASE}?text=${encodeURIComponent(whatsappMessage)}`
    : `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hola, acabo de usar la calculadora ${calculatorLabel} y tengo una consulta.`)}`

  return (
    <Card className="mt-6 overflow-hidden">
      <div className="p-5">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-text-primary">Te contactaremos pronto</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Revisa tu email: {formData.email}</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-medium text-text-primary mb-1">¿Necesitas ayuda con tu trámite?</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">Déjanos tu email y un abogado te asesora gratis</p>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <Input
                  type="text"
                  name="name"
                  placeholder="Tu nombre (opcional)"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  disabled={status === 'loading'}
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }))
                    if (status === 'error') {
                      setStatus('idle')
                      setErrorMsg('')
                    }
                  }}
                  disabled={status === 'loading'}
                  required
                />

                {status === 'error' && errorMsg && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <p className="text-xs text-red-500">{errorMsg}</p>
                  </div>
                )}

                <Button type="submit" variant="primary" disabled={status === 'loading'} className="w-full">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Quiero asesoría gratuita
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--glass-border)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)]">o</span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-green-500 text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar por WhatsApp
              </a>

              <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">Sin compromiso. No spam.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

