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
  'declaraciones': {
    title: 'Declaraciones Juramentadas',
    description: 'Documentos legales para tramites publicos y privados con validez oficial.',
    longDescription: 'Preparamos y gestionamos declaraciones juramentadas para distintos tramites notariales y administrativos. Te guiamos en la redaccion del contenido, validamos requisitos formales y coordinamos la protocolizacion cuando aplica.',
    requirements: [
      'Cedula de identidad del declarante',
      'Texto o detalle de los hechos a declarar',
      'Documentos de respaldo (si aplica)',
      'Pago de tasas notariales'
    ],
    estimatedTime: '1 - 24 horas',
    documentsDelivered: 'Acta o escritura de declaracion juramentada',
    priceRange: 'Desde $20'
  },
  'permiso-salida': {
    title: 'Permiso de Salida del Pais para Menores',
    description: 'Autorizaciones notariales de viaje para menores de edad.',
    longDescription: 'Gestionamos la autorizacion notarial para salida del pais de menores de edad, incluyendo revision documental y acompanamiento en todo el proceso para evitar observaciones en migracion.',
    requirements: [
      'Cedula y papeleta de votacion de los representantes',
      'Partida o documento de identidad del menor',
      'Datos de viaje (destino, fechas, acompanante)',
      'Pago de tasas notariales'
    ],
    estimatedTime: 'Mismo dia',
    documentsDelivered: 'Autorizacion notarial de salida del pais',
    priceRange: 'Desde $25'
  },
  'posesion-efectiva': {
    title: 'Posesion Efectiva',
    description: 'Tramite sucesorio para declarar herederos legalmente.',
    longDescription: 'Asesoramos y tramitamos la posesion efectiva para que los herederos puedan ejercer derechos sobre los bienes del causante. Incluye validacion de documentos, preparacion de solicitud y acompanamiento notarial.',
    requirements: [
      'Partida de defuncion del causante',
      'Partidas que acrediten parentesco de herederos',
      'Cedulas de los solicitantes',
      'Inventario o detalle de bienes (si aplica)'
    ],
    estimatedTime: '5 - 15 dias laborables',
    documentsDelivered: 'Acta o escritura de posesion efectiva',
    priceRange: 'Desde $80'
  },
  'promesa-compraventa': {
    title: 'Promesa de Compraventa',
    description: 'Contrato previo para asegurar una futura compraventa de inmueble.',
    longDescription: 'Redactamos y formalizamos promesas de compraventa con clausulas claras sobre precio, plazo, condiciones y penalidades. Ideal para proteger a comprador y vendedor antes de la escritura definitiva.',
    requirements: [
      'Datos completos de comprador y vendedor',
      'Informacion del inmueble',
      'Condiciones de pago y plazo pactado',
      'Documentos habilitantes del inmueble'
    ],
    estimatedTime: '1 - 3 dias laborables',
    documentsDelivered: 'Contrato de promesa protocolizado',
    priceRange: 'Desde $120'
  },
  'traspaso-vehicular': {
    title: 'Traspaso Vehicular',
    description: 'Contrato de compraventa de vehiculo y formalizacion notarial.',
    longDescription: 'Gestionamos la documentacion necesaria para traspaso de dominio vehicular, incluyendo contrato de compraventa, validacion de datos de las partes y coordinacion para reconocimiento de firmas.',
    requirements: [
      'Matricula del vehiculo',
      'Cedulas de comprador y vendedor',
      'Datos tecnicos del vehiculo (placa, motor, chasis)',
      'Acuerdo de precio y forma de pago'
    ],
    estimatedTime: '24 - 72 horas',
    documentsDelivered: 'Contrato de compraventa vehicular listo para tramite',
    priceRange: 'Desde $11.99'
  },
  'constitucion-sas': {
    title: 'Constitucion de Compania SAS',
    description: 'Creacion legal de empresa SAS con acompanamiento integral.',
    longDescription: 'Te apoyamos en la constitucion de tu sociedad por acciones simplificada (SAS), desde revision de objeto social y accionistas hasta formalizacion documental para iniciar operaciones con seguridad juridica.',
    requirements: [
      'Datos de accionistas y representante legal',
      'Nombre propuesto de la compania',
      'Objeto social y actividad economica',
      'Correo y telefono de contacto'
    ],
    estimatedTime: '3 - 10 dias laborables',
    documentsDelivered: 'Documentacion de constitucion lista para registro',
    priceRange: 'Desde $250'
  },
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
                      <Link href="/calculadoras/inmuebles">
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
