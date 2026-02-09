import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Iniciar Sesion | Abogados Online Ecuador',
  description: 'Inicia sesion en tu cuenta de Abogados Online Ecuador',
}

export default function IniciarSesionPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Bienvenido de vuelta
        </h1>
        <p className="text-text-secondary">
          Inicia sesion para acceder a tu cuenta
        </p>
      </div>
      <LoginForm />
    </div>
  )
}
