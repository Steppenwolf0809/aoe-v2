import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificar Email | Abogados Online Ecuador',
}

export default function VerificarEmailPage() {
  return (
    <div className="w-full max-w-sm text-center">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Revisa tu correo</h1>
      <p className="text-[var(--text-secondary)]">
        Te hemos enviado un enlace de verificacion a tu correo electronico.
      </p>
    </div>
  )
}
