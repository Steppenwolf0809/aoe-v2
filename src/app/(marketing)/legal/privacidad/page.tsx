import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Privacidad | Abogados Online Ecuador',
  description:
    'Politica de privacidad y tratamiento de datos personales de Abogados Online Ecuador.',
}

export default function PrivacidadPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        Politica de privacidad
      </h1>
      <p className="mt-3 text-sm text-text-muted">Ultima actualizacion: 10 de febrero de 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-7 text-text-secondary">
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">1. Datos que recopilamos</h2>
          <p>
            Podemos recopilar datos de identificacion, contacto, informacion contractual y
            metadatos tecnicos necesarios para proveer el servicio.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">2. Finalidad del tratamiento</h2>
          <p>
            Usamos los datos para crear y gestionar cuentas, generar documentos, brindar
            soporte, cumplir obligaciones legales y mejorar la experiencia de uso.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">3. Comparticion de datos</h2>
          <p>
            No vendemos datos personales. Solo compartimos informacion con proveedores
            tecnologicos necesarios para operar la plataforma o por requerimiento legal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">4. Seguridad y retencion</h2>
          <p>
            Aplicamos medidas tecnicas y organizativas razonables para proteger la informacion.
            Conservamos los datos durante el tiempo necesario para cumplir las finalidades
            descritas o exigencias legales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium text-text-primary">5. Derechos del titular</h2>
          <p>
            Puedes solicitar acceso, rectificacion, actualizacion o eliminacion de tus datos
            escribiendo a{' '}
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
