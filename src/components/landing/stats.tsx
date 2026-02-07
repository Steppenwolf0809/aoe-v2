'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '1,000+', label: 'Contratos generados' },
  { value: '12+', label: 'Anos de experiencia' },
  { value: '5,000+', label: 'Clientes satisfechos' },
  { value: '99%', label: 'Precision en calculos' },
]

export function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 border-y border-white/[0.05] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
