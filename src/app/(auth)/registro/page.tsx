import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Registro | Abogados Online Ecuador',
  description: 'Crea tu cuenta en Abogados Online Ecuador',
}

export default function RegistroPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Crear cuenta
        </h1>
        <p className="text-text-secondary">
          Registrate para generar contratos y acceder a herramientas legales
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
