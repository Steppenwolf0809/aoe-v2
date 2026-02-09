import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recuperar Contrasena | Abogados Online Ecuador',
}

export default function RecuperarContrasenaPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
        Recuperar contrasena
      </h1>
      <p className="text-[var(--text-secondary)] text-center mb-8">
        Ingresa tu correo para recibir instrucciones
      </p>
      {/* TODO: implementar ForgotPasswordForm */}
    </div>
  )
}
