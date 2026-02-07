'use client'

import { motion } from 'framer-motion'
import { FileText, Calculator, MessageSquare, QrCode } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    title: 'Contratos Vehiculares',
    description: 'Genera contratos de compra-venta de vehiculos en minutos. Validos legalmente y listos para imprimir.',
    icon: FileText,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Calculadoras Notariales',
    description: 'Calcula costos notariales y de registro antes de cualquier transaccion. 100% gratuito.',
    icon: Calculator,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Consultas Legales',
    description: 'Conecta con abogados especializados para resolver tus dudas legales de forma rapida.',
    icon: MessageSquare,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'Verificacion QR',
    description: 'Proximamente: verifica la autenticidad de documentos con codigo QR seguro.',
    icon: QrCode,
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
]

export function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Soluciones Legales Digitales
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para tus tramites legales en un solo lugar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 cursor-pointer group relative overflow-hidden">
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl bg-gradient-to-br ${feature.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
                  <CardContent className="p-0 relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
