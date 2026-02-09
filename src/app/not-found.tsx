import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-bg-secondary border border-[var(--glass-border)] mb-6">
          <span className="text-4xl font-bold text-[var(--accent-primary)]">404</span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Pagina no encontrada</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          La pagina que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
