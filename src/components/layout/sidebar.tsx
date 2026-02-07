'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, User, CreditCard, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/contratos', label: 'Contratos', icon: FileText },
  { href: '/dashboard/documentos', label: 'Documentos', icon: FolderOpen },
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
  { href: '/dashboard/suscripcion', label: 'Suscripcion', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-white/[0.05] bg-[var(--bg-secondary)] p-4 hidden lg:block">
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
          <span className="text-white font-bold text-sm">AO</span>
        </div>
        <span className="font-semibold text-white text-sm">Dashboard</span>
      </div>

      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
