import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Recuperar Contrasena | Abogados Online Ecuador',
  description: 'Recupera tu contrasena de Abogados Online Ecuador',
}

export default function RecuperarContrasenaPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Recuperar contrasena
        </h1>
        <p className="text-text-secondary">
          Ingresa tu correo para recibir instrucciones
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
