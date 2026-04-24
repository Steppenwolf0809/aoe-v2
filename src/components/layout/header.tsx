'use client'

import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Calendar, FileText, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { MobileMenu } from './mobile-menu'
import { Wordmark } from './wordmark'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: scrolled ? 'rgba(15, 23, 42, 0.08)' : 'rgba(15, 23, 42, 0.04)',
        }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center" aria-label="Abogados Online Ecuador">
            <Wordmark />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-[var(--radius-sm)] px-3 py-2 text-sm text-text-secondary transition-colors duration-200 hover:bg-slate-100 hover:text-text-primary"
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.badge && (
                    <Badge variant="success" size="sm">
                      {link.badge}
                    </Badge>
                  )}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/iniciar-sesion"
              className="hidden text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary sm:inline-flex"
            >
              Iniciar Sesión
            </Link>
            <Link href="/contratos/vehicular" className="hidden sm:inline-flex">
              <Button size="sm" className="bg-accent-primary text-white hover:bg-accent-primary-hover">
                <FileText className="h-4 w-4" />
                Generar Contrato
              </Button>
            </Link>
            <Link href="/contacto" className="hidden xl:inline-flex">
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4" />
                Agendar Cita
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="cursor-pointer rounded-[var(--radius-sm)] p-2 text-text-secondary transition-colors duration-200 hover:bg-slate-100 hover:text-text-primary md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
