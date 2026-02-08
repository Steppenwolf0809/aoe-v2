import { Metadata } from 'next'
import { Check, HelpCircle } from 'lucide-react'
import { Accordion } from '@/components/ui/accordion'
import { PricingCard } from '@/components/marketing/pricing-card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Precios y Tarifas | Abogados Online Ecuador',
  description: 'Tarifas transparentes para trámites notariales, inmobiliarios y servicios legales. Sin costos ocultos.',
}

export default function PricingPage() {
  const faqs = [
    {
      title: '¿Los precios incluyen impuestos?',
      content: 'Sí, todas nuestras tarifas mostradas incluyen el IVA cuando aplica. Los gastos notariales y registrales son valores estimados basados en las tablas oficiales y pueden variar ligeramente según el caso específico.',
    },
    {
      title: '¿Qué formas de pago aceptan?',
      content: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito (Visa, Mastercard, Diners) y pagos en efectivo directamente en nuestra oficina.',
    },
    {
      title: '¿Ofrecen descuentos por volumen?',
      content: 'Sí, para empresas e inmobiliarias que requieren trámites recurrentes, ofrecemos planes corporativos con tarifas preferenciales. Contáctanos para más información.',
    },
    {
      title: '¿Si el trámite no se completa, hay devolución?',
      content: 'Si el trámite no puede completarse por causas imputables a nuestra gestión, realizamos la devolución del 100% de nuestros honorarios. Los gastos incurridos en tasas estatales o notariales dependen de las políticas de cada institución.',
    },
  ]

  return (
    <div className="relative min-h-screen pb-20 pt-24 lg:pt-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-slate-200/20 dark:bg-slate-800/20 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Tarifas Simples y Transparentes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas ni costos ocultos.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          <PricingCard
            title="Básico"
            price="Gratis"
            description="Herramientas esenciales para consultas rápidas."
            ctaText="Usar Calculadoras"
            ctaLink="/calculadoras"
            features={[
              'Calculadora Notarial',
              'Calculadora de Registro',
              'Consultas básicas',
              'Checklists de requisitos',
              'Soporte vía email'
            ]}
            delay={0.1}
          />
          <PricingCard
            title="Trámite Express"
            price="$25"
            description="Gestión completa de documentos simples."
            isPopular={true}
            ctaText="Empezar Trámite"
            ctaLink="/servicios"
            features={[
              'Poderes Generales y Especiales',
              'Declaraciones Juramentadas',
              'Permisos de Salida del País',
              'Redacción legal garantizada',
              'Cita notarial prioritaria',
              'Soporte por WhatsApp'
            ]}
            delay={0.2}
          />
          <PricingCard
            title="Asesoría Plus"
            price="$50"
            description="Para casos que requieren análisis legal."
            ctaText="Agendar Asesoría"
            ctaLink="/contacto"
            features={[
              'Revisión de Escrituras',
              'Asesoría en Compraventa',
              'Análisis de casos complejos',
              'Reunión virtual de 30 min',
              'Dictamen legal por escrito',
              'Soporte prioritario'
            ]}
            delay={0.3}
          />
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Comparativa de Servicios</h2>
            <p className="text-slate-600 dark:text-slate-400">Diferencias entre nuestro servicio estándar y el servicio premium.</p>
          </div>

          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="p-6 font-semibold text-slate-900 dark:text-white min-w-[200px]">Característica</th>
                    <th className="p-6 font-semibold text-slate-900 dark:text-white min-w-[150px]">Estándar</th>
                    <th className="p-6 font-semibold text-blue-600 dark:text-blue-400 min-w-[150px]">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-6 text-slate-700 dark:text-slate-300">Generación de Documentos</td>
                    <td className="p-6"><Check className="text-slate-400 w-5 h-5" /></td>
                    <td className="p-6"><Check className="text-blue-600 w-5 h-5" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-700 dark:text-slate-300">Revisión por Abogado</td>
                    <td className="p-6 text-sm text-slate-500">Opcional (+$)</td>
                    <td className="p-6"><Check className="text-blue-600 w-5 h-5" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-700 dark:text-slate-300">Agendamiento de Citas</td>
                    <td className="p-6 text-sm text-slate-500">Estándar</td>
                    <td className="p-6 text-sm font-medium text-blue-600">Prioritario VIP</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-700 dark:text-slate-300">Soporte</td>
                    <td className="p-6 text-sm text-slate-500">Email</td>
                    <td className="p-6 text-sm font-medium text-blue-600">WhatsApp Directo</td>
                  </tr>
                  <tr>
                    <td className="p-6 text-slate-700 dark:text-slate-300">Delivery de Documentos (Quito)</td>
                    <td className="p-6 text-sm text-slate-500">-</td>
                    <td className="p-6"><Check className="text-blue-600 w-5 h-5" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Preguntas Frecuentes</h2>
            <p className="text-slate-600 dark:text-slate-400">Todo lo que necesitas saber sobre nuestros costos.</p>
          </div>

          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-6 shadow-lg">
            <Accordion items={faqs} />
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              ¿Tienes una pregunta específica que no está aquí?
            </p>
            <Button size="lg" asChild className="rounded-full px-8 shadow-lg shadow-blue-500/20">
              <a href="https://wa.me/593979317579" target="_blank" rel="noopener noreferrer">
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
