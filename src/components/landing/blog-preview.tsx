'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   Blog post preview data — placeholder posts
   ---------------------------------------------------------------- */
interface BlogPost {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  slug: string
  gradient: string
}

const posts: BlogPost[] = [
  {
    title: '¿Cuánto cuesta escriturar una casa en Quito en 2026?',
    excerpt:
      'Guía completa con todos los gastos que debes considerar al escriturar un inmueble: aranceles notariales, impuestos municipales y registro de la propiedad.',
    date: '5 Feb 2026',
    author: 'Jose Luis',
    category: 'Inmuebles',
    slug: 'cuanto-cuesta-escriturar-casa-quito-2026',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: '5 errores al comprar un vehículo usado en Ecuador',
    excerpt:
      'Evita problemas legales al adquirir un vehículo de segunda mano. Conoce los documentos que debes verificar antes de firmar.',
    date: '1 Feb 2026',
    author: 'Jose Luis',
    category: 'Vehículos',
    slug: '5-errores-comprar-vehiculo-usado-ecuador',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: '¿Qué es la plusvalía y cómo se calcula en Quito?',
    excerpt:
      'Entiende el impuesto de plusvalía, cuándo aplica, cómo se calcula y las rebajas por tiempo de posesión del inmueble.',
    date: '28 Ene 2026',
    author: 'Jose Luis',
    category: 'Impuestos',
    slug: 'que-es-plusvalia-como-se-calcula-quito',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
]

/* ----------------------------------------------------------------
   Stagger variants
   ---------------------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

/* ----------------------------------------------------------------
   Blog Preview Section
   ---------------------------------------------------------------- */
export function BlogPreview() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Artículos y Recursos Legales
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Información práctica sobre trámites legales, impuestos y consejos para ecuatorianos.
          </p>
        </motion.div>

        {/* Post cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={cardVariants}>
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <Card className="h-full overflow-hidden bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  {/* Image placeholder with gradient */}
                  <div
                    className={`h-44 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10" />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors duration-200">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-white hover:text-blue-700">
              Ver todos los artículos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
