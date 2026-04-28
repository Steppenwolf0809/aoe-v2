'use client'

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function WhatsAppFloatButton() {
  const pathname = usePathname()
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isHomeRoute = pathname === '/'

  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn(
        'fixed right-4 z-[45] inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 lg:right-6',
        isHomeRoute
          ? 'bottom-4 h-11 w-11 border border-emerald-200/20 bg-emerald-400/18 p-0 shadow-[0_14px_40px_-18px_rgba(16,185,129,0.8)] backdrop-blur-xl hover:bg-emerald-400/28 sm:bottom-5'
          : 'bg-[var(--accent-success)] px-4 py-3 shadow-lg shadow-emerald-500/30 hover:shadow-xl',
        !isHomeRoute && (isDashboardRoute ? 'bottom-24 lg:bottom-6' : 'bottom-6')
      )}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className={cn(isHomeRoute ? 'sr-only' : 'hidden sm:inline')}>WhatsApp</span>
    </a>
  )
}
