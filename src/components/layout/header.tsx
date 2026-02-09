'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NAV_LINKS } from '@/lib/constants'
import { MobileMenu } from './mobile-menu'

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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b"
        style={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderColor: scrolled ? 'rgba(15, 23, 42, 0.06)' : 'transparent',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo/logo-horizontal.svg"
              alt="Abogados Online Ecuador"
              width={240}
              height={60}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-[var(--radius-sm)] hover:bg-slate-100"
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/iniciar-sesion"
              className="hidden sm:inline-flex text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Iniciar Sesion
            </Link>
            <Link href="/contacto" className="hidden sm:inline-flex">
              <Button size="sm" className="bg-accent-primary hover:bg-accent-primary-hover text-white">
                <Calendar className="w-4 h-4" />
                Agendar Cita
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-[var(--radius-sm)] transition-colors duration-200 cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
