import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

const footerLinks = {
  Servicios: [
    { href: '/servicios', label: 'Todos los Servicios' },
    { href: '/calculadoras', label: 'Calculadoras' },
    { href: '/precios', label: 'Precios' },
  ],
  Legal: [
    { href: '/blog', label: 'Blog Legal' },
    { href: '/contacto', label: 'Contacto' },
  ],
  Cuenta: [
    { href: '/iniciar-sesion', label: 'Iniciar Sesion' },
    { href: '/registro', label: 'Registrarse' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">AO</span>
              </div>
              <span className="font-semibold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Plataforma legal tecnologica para la generacion de contratos y calculadoras notariales en Ecuador.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.05] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
