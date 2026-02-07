'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-[var(--accent-success)]/20 text-[var(--accent-success)]',
  error: 'border-[var(--accent-error)]/20 text-[var(--accent-error)]',
  info: 'border-[var(--accent-primary)]/20 text-[var(--accent-primary)]',
}

let addToastExternal: ((message: string, type: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'info') {
  addToastExternal?.(message, type)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastExternal = (message: string, type: ToastType) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    }
    return () => {
      addToastExternal = null
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type]
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl',
                  'bg-[var(--bg-secondary)] border backdrop-blur-xl',
                  'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
                  styles[t.type]
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm text-white">{t.message}</p>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}
