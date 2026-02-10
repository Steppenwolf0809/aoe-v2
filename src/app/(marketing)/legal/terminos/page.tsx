import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terminos y Condiciones | Abogados Online Ecuador',
  description:
    'Terminos y condiciones de uso de la plataforma de Abogados Online Ecuador.',
}

export default function TerminosPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Terminos y condiciones
      </h1>
      <p className="mt-3 text-sm text-text-muted">Ultima actualizacion: 10 de febrero de 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-7 text-text-secondary">
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">1. Objeto del servicio</h2>
          <p>
            Abogados Online Ecuador facilita herramientas digitales para generar documentos,
            calcular valores referenciales y gestionar tramites legales. El uso de la
            plataforma implica la aceptacion de estos terminos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">2. Cuenta de usuario</h2>
          <p>
            El usuario es responsable de mantener la confidencialidad de sus credenciales y
            de la informacion registrada en su cuenta. Debe proveer datos reales y actualizados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">3. Uso permitido</h2>
          <p>
            No esta permitido usar la plataforma para actividades ilegales, fraudulentas o
            que vulneren derechos de terceros. Nos reservamos el derecho de suspender cuentas
            ante incumplimientos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">4. Limitacion de responsabilidad</h2>
          <p>
            La informacion y los documentos generados son de apoyo y pueden requerir validacion
            profesional adicional segun cada caso concreto. El usuario asume la responsabilidad
            final del uso de los resultados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">5. Contacto</h2>
          <p>
            Para consultas sobre estos terminos puedes escribir a{' '}
            <a
              href="mailto:info@abogadosonlineecuador.com"
              className="text-accent-primary hover:text-accent-primary-hover"
            >
              info@abogadosonlineecuador.com
            </a>
            .
          </p>
        </section>
      </div>
    </section>
  )
}
