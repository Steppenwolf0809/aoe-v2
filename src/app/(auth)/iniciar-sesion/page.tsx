import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesion | Abogados Online Ecuador',
}

export default function IniciarSesionPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
        Bienvenido de vuelta
      </h1>
      <p className="text-[var(--text-secondary)] text-center mb-8">
        Inicia sesion para acceder a tu cuenta
      </p>
      {/* TODO: implementar LoginForm */}
    </div>
  )
}
