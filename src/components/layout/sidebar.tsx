'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, User, CreditCard, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/contratos', label: 'Contratos', icon: FileText },
  { href: '/dashboard/documentos', label: 'Documentos', icon: FolderOpen },
  { href: '/dashboard/suscripcion', label: 'Suscripcion', icon: CreditCard },
  { href: '/dashboard/perfil', label: 'Perfil', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="w-64 min-h-screen sticky top-0 border-r border-[var(--glass-border)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl p-4 hidden lg:block">
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">AO</span>
          </div>
          <span className="font-semibold text-text-primary text-sm">Dashboard</span>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard' && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  isActive
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-text-primary hover:bg-bg-tertiary'
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--glass-border)] bg-[var(--bg-secondary)]/90 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard' && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'h-16 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors',
                  isActive
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-text-primary'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-[64px]">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
