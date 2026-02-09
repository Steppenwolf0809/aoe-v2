'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const typeStyles: Record<ToastType, string> = {
  success: 'border-accent-success/20 [&_svg]:text-accent-success',
  error: 'border-accent-error/20 [&_svg]:text-accent-error',
  info: 'border-accent-primary/20 [&_svg]:text-accent-primary',
  warning: 'border-accent-warning/20 [&_svg]:text-accent-warning',
}

/* ----------------------------------------------------------------
   Global toast function — call from anywhere
   ---------------------------------------------------------------- */
let addToastExternal: ((message: string, type: ToastType, duration?: number) => void) | null = null

export function toast(message: string, type: ToastType = 'info', duration?: number) {
  addToastExternal?.(message, type, duration)
}

/* ----------------------------------------------------------------
   Toast Provider — mount once in layout
   ---------------------------------------------------------------- */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastExternal = (message: string, type: ToastType, duration = 4000) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, message, type, duration }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return () => {
      addToastExternal = null
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type]
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                className={cn(
                  'pointer-events-auto flex items-center gap-3 px-4 py-3',
                  'rounded-[var(--radius-md)]',
                  'bg-bg-secondary border backdrop-blur-xl',
                  'shadow-glass',
                  typeStyles[t.type],
                )}
                role="alert"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <p className="text-sm text-text-primary flex-1">{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-0.5 rounded-[var(--radius-sm)] hover:bg-bg-tertiary transition-colors duration-200 cursor-pointer"
                  aria-label="Cerrar notificacion"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}
