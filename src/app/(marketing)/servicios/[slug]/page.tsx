import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// This data would typically come from a CMS or database
// For now, we'll hardcode it to match the plan
const servicesData: Record<string, {
  title: string
  description: string
  longDescription: string
  requirements: string[]
  estimatedTime: string
  documentsDelivered: string
  priceRange?: string
}> = {
  'poderes': {
    title: 'Poderes Generales y Especiales',
    description: 'Documentos legales para representación dentro y fuera del país.',
    longDescription: 'Un poder es un instrumento legal que permite a una persona (poderdante) delegar facultades a otra (apoderado) para que actúe en su nombre. Gestionamos la redacción y notaría de poderes generales, especiales, y procuraciones judiciales.',
    requirements: [
      'Cédula de identidad original del poderdante',
      'Copia de cédula del apoderado',
      'Datos exactos del objeto del poder (si es especial)',
      'Pago de la tasa notarial'
    ],
    estimatedTime: '1 - 24 horas',
    documentsDelivered: 'Escritura pública de poder inscrita',
    priceRange: 'Desde $35'
  },
  'compraventa-inmuebles': {
    title: 'Compraventa de Inmuebles',
    description: 'Gestión completa de escrituras para compra y venta de propiedades.',
    longDescription: 'Asesoría y gestión integral para la transferencia de dominio de bienes inmuebles. Nos encargamos de la revisión legal, cálculo de impuestos (alcabalas, plusvalía), redacción de la minuta y coordinación con la notaría y el Registro de la Propiedad.',
    requirements: [
      'Escritura anterior del inmueble',
      'Certificado de Gravámenes actualizado',
      'Carta de pago del predio urbano del año en curso',
      'Cédulas y papeletas de votación de compradores y vendedores',
      'Certificado de expensas (si es propiedad horizontal)'
    ],
    estimatedTime: '15 - 30 días laborables',
    documentsDelivered: 'Escritura inscrita en el Registro de la Propiedad',
    priceRange: 'Variable según avalúo (Usar calculadora)'
  },
  // Add other services as needed...
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = servicesData[slug]

  if (!service) {
    return {
      title: 'Servicio no encontrado',
    }
  }

  return {
    title: `${service.title} | Abogados Online Ecuador`,
    description: service.description,
  }
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }))
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = servicesData[slug]

  if (!service) {
    notFound()
  }

  return (
    <div className="relative min-h-screen pb-20 pt-24 lg:pt-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 max-w-5xl mx-auto">

        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/servicios"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Servicios
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                {service.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.longDescription}
              </p>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Requisitos Generales
              </h3>
              <ul className="space-y-4">
                {service.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Nota Importante:</strong> Los requisitos pueden variar dependiendo de las particularidades de cada caso y de las regulaciones notariales vigentes. Recomendamos una asesoría previa.
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-32">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Tiempo Estimado
                  </h3>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                    <Clock className="h-5 w-5 text-blue-500" />
                    {service.estimatedTime}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Entregable
                  </h3>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                    <FileText className="h-5 w-5 text-purple-500" />
                    {service.documentsDelivered}
                  </div>
                </div>

                {service.priceRange && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Costo Aproximado
                    </h3>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {service.priceRange}
                    </div>
                  </div>
                )}

                <hr className="border-slate-100 dark:border-slate-800" />

                <div className="space-y-3">
                  <Button asChild className="w-full text-base h-12">
                    <Link href="/contacto">
                      Iniciar Trámite
                    </Link>
                  </Button>

                  {slug === 'compraventa-inmuebles' && (
                    <Button asChild variant="outline" className="w-full text-base h-12">
                      <Link href="/calculadoras/inmobiliario">
                        Calcular Gastos
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
