import { Metadata } from 'next'
import { FileText, Home, Car, Scale, Briefcase, Globe, Users, ShieldCheck } from 'lucide-react'
import { ServiceCard } from '@/components/marketing/service-card'

export const metadata: Metadata = {
  title: 'Nuestros Servicios | Abogados Online Ecuador',
  description: 'Catálogo completo de servicios legales: Trámites notariales, compraventa de inmuebles, constitución de compañías y más.',
}

const services = [
  {
    category: 'Notarial & Civil',
    items: [
      {
        title: 'Poderes',
        description: 'Generales y especiales para representación legal dentro y fuera del país.',
        iconName: 'file-text',
        href: '/servicios/poderes',
      },
      {
        title: 'Declaraciones Juramentadas',
        description: 'Documentos legales para trámites públicos y privados con validez oficial.',
        iconName: 'shield-check',
        href: '/servicios/declaraciones',
      },
      {
        title: 'Permisos de Salida',
        description: 'Autorizaciones de viaje para menores de edad notariadas.',
        iconName: 'globe',
        href: '/servicios/permiso-salida',
      },
      {
        title: 'Posesión Efectiva',
        description: 'Trámite de herencias para declarar herederos legalmente.',
        iconName: 'users',
        href: '/servicios/posesion-efectiva',
      },
    ],
  },
  {
    category: 'Inmobiliario',
    items: [
      {
        title: 'Compraventa de Inmuebles',
        description: 'Gestión completa de escrituras, desde la promesa hasta el registro.',
        iconName: 'home',
        href: '/servicios/compraventa-inmuebles',
      },
      {
        title: 'Promesas de Compraventa',
        description: 'Asegura la negociación de tu propiedad con un contrato blindado.',
        iconName: 'scale',
        href: '/servicios/promesa-compraventa',
      },
    ],
  },
  {
    category: 'Vehicular & Corporativo',
    items: [
      {
        title: 'Traspaso Vehicular',
        description: 'Contratos de compraventa de vehículos y gestión notarial.',
        iconName: 'car',
        href: '/servicios/traspaso-vehicular',
      },
      {
        title: 'Constitución de Compañías',
        description: 'Crea tu empresa SAS en tiempo récord con estatutos personalizados.',
        iconName: 'briefcase',
        href: '/servicios/constitucion-sas',
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen pb-20 pt-24 lg:pt-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Soluciones Legales a tu Medida
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tecnología y experiencia legal unidas para simplificar tus trámites.
          </p>
        </div>

        <div className="space-y-24">
          {services.map((category, catIndex) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 pl-2 border-l-4 border-blue-500">
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    {...service}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
