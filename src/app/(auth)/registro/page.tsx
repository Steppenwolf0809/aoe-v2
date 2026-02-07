import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro | Abogados Online Ecuador',
}

export default function RegistroPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-white text-center mb-2">
        Crear cuenta
      </h1>
      <p className="text-[var(--text-secondary)] text-center mb-8">
        Registrate para generar contratos y acceder a herramientas legales
      </p>
      {/* TODO: implementar RegisterForm */}
    </div>
  )
}
