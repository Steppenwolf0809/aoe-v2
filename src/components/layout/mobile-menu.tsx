'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, FileText, X } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { Wordmark } from './wordmark'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 200 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2 },
  },
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 right-0 top-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-[var(--glass-border)] bg-bg-secondary md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] p-5">
              <Wordmark compact />
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-[var(--radius-sm)] p-2 text-text-muted transition-colors duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                aria-label="Cerrar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-text-secondary transition-all duration-200 hover:bg-bg-tertiary hover:text-text-primary"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <Badge variant="success" size="sm">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            <div className="space-y-3 border-t border-[var(--glass-border)] p-4">
              <Link href="/iniciar-sesion" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Iniciar Sesion
                </Button>
              </Link>
              <Link href="/contratos/vehicular" onClick={onClose} className="mt-3 block">
                <Button className="w-full">
                  <FileText className="h-4 w-4" />
                  Generar Contrato
                </Button>
              </Link>
              <Link href="/contacto" onClick={onClose} className="mt-3 block">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4" />
                  Agendar Cita
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
