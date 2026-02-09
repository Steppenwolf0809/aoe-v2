'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   Blog post preview data
   ---------------------------------------------------------------- */
interface BlogPost {
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  slug: string
  image: string
  overlay: string
}

const posts: BlogPost[] = [
  {
    title: 'Cuanto cuesta escriturar una casa en Quito en 2026?',
    excerpt:
      'Guia completa con todos los gastos que debes considerar al escriturar un inmueble: aranceles notariales, impuestos municipales y registro de la propiedad.',
    date: '5 Feb 2026',
    author: 'Jose Luis',
    category: 'Inmuebles',
    slug: 'cuanto-cuesta-escriturar-casa-quito-2026',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    overlay: 'from-slate-900/60 via-slate-900/20 to-transparent',
  },
  {
    title: '5 errores al comprar un vehiculo usado en Ecuador',
    excerpt:
      'Evita problemas legales al adquirir un vehiculo de segunda mano. Conoce los documentos que debes verificar antes de firmar.',
    date: '1 Feb 2026',
    author: 'Jose Luis',
    category: 'Vehiculos',
    slug: '5-errores-comprar-vehiculo-usado-ecuador',
    image:
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1200&q=80',
    overlay: 'from-slate-900/65 via-slate-900/20 to-transparent',
  },
  {
    title: 'Que es la plusvalia y como se calcula en Quito?',
    excerpt:
      'Entiende el impuesto de plusvalia, cuando aplica, como se calcula y las rebajas por tiempo de posesion del inmueble.',
    date: '28 Ene 2026',
    author: 'Jose Luis',
    category: 'Impuestos',
    slug: 'que-es-plusvalia-como-se-calcula-quito',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    overlay: 'from-slate-950/70 via-slate-950/25 to-transparent',
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Articulos y Recursos Legales
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Informacion practica sobre tramites legales, impuestos y consejos para ecuatorianos.
          </p>
        </motion.div>

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
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={`Imagen para ${post.title}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${post.overlay}`} />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold text-slate-700 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5">
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

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors duration-200">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/blog">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-white hover:text-blue-700"
            >
              Ver todos los articulos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
