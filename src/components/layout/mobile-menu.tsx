'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { X, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NAV_LINKS } from '@/lib/constants'

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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-bg-secondary border-l border-white/[0.08] flex flex-col md:hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
              <Image
                src="/logo/logo-horizontal.svg"
                alt="Abogados Online Ecuador"
                width={140}
                height={32}
                className="h-6 w-auto brightness-0 invert"
              />
              <button
                onClick={onClose}
                className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-[var(--radius-sm)] transition-colors duration-200 cursor-pointer"
                aria-label="Cerrar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
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
                      className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
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

            {/* Bottom actions */}
            <div className="p-4 space-y-3 border-t border-white/[0.08]">
              <Link href="/iniciar-sesion" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Iniciar Sesion
                </Button>
              </Link>
              <Link href="/contacto" onClick={onClose} className="block mt-3">
                <Button className="w-full">
                  <Calendar className="w-4 h-4" />
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
