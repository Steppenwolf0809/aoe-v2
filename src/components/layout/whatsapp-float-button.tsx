'use client'

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function WhatsAppFloatButton() {
  const pathname = usePathname()
  const isDashboardRoute = pathname.startsWith('/dashboard')

  return (
    <a
      href={SOCIAL_LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn(
        'fixed right-4 z-[45] inline-flex items-center gap-2 rounded-full bg-[var(--accent-success)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:right-6',
        isDashboardRoute ? 'bottom-24 lg:bottom-6' : 'bottom-6'
      )}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
