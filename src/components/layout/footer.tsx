import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants'
import { Wordmark } from './wordmark'

const footerSections = {
  Servicios: [
    { href: '/servicios', label: 'Todos los Servicios' },
    { href: '/#evaluador-deudas', label: 'Negociación de Deudas' },
    { href: '/contratos/vehicular', label: 'Generar Contrato Vehicular' },
  ],
  Calculadoras: [
    { href: '/calculadoras/notarial', label: 'Calculadora Notarial' },
    { href: '/calculadoras/registro-propiedad', label: 'Registro de la Propiedad' },
    { href: '/calculadoras/alcabalas', label: 'Alcabalas' },
    { href: '/calculadoras/plusvalia', label: 'Plusvalia' },
  ],
  Legal: [
    { href: '/blog', label: 'Blog Legal' },
    { href: '/legal/privacidad', label: 'Politica de Privacidad' },
    { href: '/legal/terminos', label: 'Terminos de Uso' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="mb-4 inline-block" aria-label="Abogados Online Ecuador">
              <Wordmark />
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-text-secondary">
              Plataforma legal tecnológica para trámites notariales, calculadoras jurídicas y
              negociación de deudas en Ecuador.
            </p>

            <div className="space-y-2.5">
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-sm text-text-secondary transition-colors duration-200 hover:text-accent-success"
              >
                <MessageCircle className="h-4 w-4 text-accent-success/70 group-hover:text-accent-success" />
                WhatsApp
              </a>
              <a
                href={SOCIAL_LINKS.email}
                className="flex items-center gap-2.5 text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
              >
                <Mail className="h-4 w-4" />
                info@abogadosonlineecuador.com
              </a>
              <div className="flex items-center gap-2.5 text-sm text-text-secondary">
                <MapPin className="h-4 w-4" />
                Quito, Ecuador
              </div>
            </div>
          </div>

          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold text-text-primary">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="order-2 text-xs text-text-muted sm:order-1">
            &copy; {currentYear} {SITE_NAME}. Todos los derechos reservados.
          </p>

          <div className="order-1 flex items-center gap-3 sm:order-2">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[var(--radius-sm)] p-2 text-text-muted transition-colors duration-200 hover:bg-slate-100 hover:text-text-primary"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.05 1.541.116V7.98c-.835-.089-1.144-.089-1.627-.089-1.157 0-1.604.435-1.604 1.564v2.589h3.141l-.539 3.667h-2.602v8.118C18.62 23.08 22 18.95 22 14.044 22 8.514 17.514 4 12 4S2 8.514 2 14.044c0 4.514 3.005 8.326 7.101 9.647z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[var(--radius-sm)] p-2 text-text-muted transition-colors duration-200 hover:bg-slate-100 hover:text-text-primary"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[var(--radius-sm)] p-2 text-text-muted transition-colors duration-200 hover:bg-slate-100 hover:text-accent-success"
              aria-label="WhatsApp"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
