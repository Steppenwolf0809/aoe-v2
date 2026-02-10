'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Car,
  Handshake,
  Scale,
  Home,
  Plane,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   Service definitions — 6 cards per PROMPT 06
   ---------------------------------------------------------------- */
const services = [
  {
    title: 'Generación de Documentos',
    description:
      'Genera contratos y documentos legales personalizados en minutos. Válidos para cualquier notaría de Quito y Ecuador.',
    icon: FileText,
    gradient: 'from-blue-600/20 to-indigo-600/20',
    href: '/servicios',
  },
  {
    title: 'Compraventas',
    description:
      'Contratos de compra-venta vehicular y de bienes. Listos para firmar en notaría. Asesoría incluida.',
    icon: Car,
    gradient: 'from-slate-600/20 to-gray-600/20',
    href: '/servicios',
  },
  {
    title: 'Promesas de Compraventa',
    description:
      'Promesas de compra-venta de inmuebles con cláusulas de garantía y condiciones suspensivas.',
    icon: Handshake,
    gradient: 'from-indigo-500/20 to-blue-500/20',
    href: '/servicios',
  },
  {
    title: 'Poderes',
    description:
      'Poderes generales y especiales para uso en bancos, instituciones públicas y privadas de Quito.',
    icon: Scale,
    gradient: 'from-slate-500/20 to-zinc-500/20',
    href: '/servicios',
  },
  {
    title: 'Posesiones Efectivas',
    description:
      'Trámite de posesión efectiva de bienes hereditarios. Asesoría completa del proceso.',
    icon: Home,
    gradient: 'from-blue-500/20 to-slate-500/20',
    href: '/servicios',
  },
  {
    title: 'Salidas del País',
    description:
      'Autorizaciones de viaje para menores de edad. Documento notarial con validez migratoria.',
    icon: Plane,
    gradient: 'from-sky-600/20 to-blue-600/20',
    href: '/servicios',
  },
]

/* ----------------------------------------------------------------
   Stagger variants for viewport animation
   ---------------------------------------------------------------- */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
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

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleOffset: number
  twinkleSpeed: number
  driftOffset: number
  driftAmount: number
}

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.45 + 0.2,
    twinkleOffset: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 1.7 + 0.7,
    driftOffset: Math.random() * Math.PI * 2,
    driftAmount: Math.random() * 1.8 + 0.4,
  }))
}

function InteractiveStarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cursor = { x: -1000, y: -1000, active: false }
    const pointerRadius = 120
    const pointerPush = 15
    const deviceScale = Math.min(window.devicePixelRatio || 1, 2)
    let stars: Star[] = []
    let width = 0
    let height = 0
    let frameId = 0

    const setCanvasSize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)

      canvas.width = Math.floor(width * deviceScale)
      canvas.height = Math.floor(height * deviceScale)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0)

      const starCount = width < 640 ? 64 : 140
      stars = createStars(width, height, starCount)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!inside) {
        cursor.active = false
        return
      }

      cursor.x = event.clientX - rect.left
      cursor.y = event.clientY - rect.top
      cursor.active = true
    }

    const onPointerLeave = () => {
      cursor.active = false
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const star of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.0012 * star.twinkleSpeed + star.twinkleOffset)
        const driftX = Math.sin(time * 0.00018 + star.driftOffset) * star.driftAmount
        const driftY = Math.cos(time * 0.00014 + star.driftOffset) * star.driftAmount * 0.75

        let pushX = 0
        let pushY = 0

        if (cursor.active) {
          const dx = star.x - cursor.x
          const dy = star.y - cursor.y
          const distance = Math.hypot(dx, dy)

          if (distance < pointerRadius && distance > 0.001) {
            const force = (pointerRadius - distance) / pointerRadius
            pushX = (dx / distance) * force * pointerPush
            pushY = (dy / distance) * force * pointerPush
          }
        }

        const drawX = star.x + driftX + pushX
        const drawY = star.y + driftY + pushY
        const alpha = star.opacity * twinkle

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    render(performance.now())

    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(render)
    }

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-70"
      aria-hidden="true"
    />
  )
}

/* ----------------------------------------------------------------
   Features / Servicios Section
   ---------------------------------------------------------------- */
export function Features() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#024089] relative overflow-hidden">
      <InteractiveStarsBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-transparent to-slate-950/15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Soluciones Legales a su Alcance
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para tus trámites legales en un solo lugar.
            Servicio profesional con respaldo de 12+ años de experiencia.
          </p>
        </motion.div>

        {/* Cards grid — 3 cols on lg, 2 on md, 1 on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.title} variants={cardVariants}>
                <Link href={service.href} className="block h-full">
                  <Card className="h-full p-6 bg-white/5 border-white/10 backdrop-blur-sm shadow-sm hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    {/* Ambient gradient blob */}
                    <div
                      className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <CardContent className="p-0 relative z-10">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-200">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-blue-100 leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Link indicator */}
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-200">
                        Saber más
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/servicios">
            <Button variant="outline" size="lg" className="border-blue-300 text-blue-100 hover:bg-white hover:text-blue-900 border-opacity-50 hover:border-opacity-100">
              Ver todos nuestros servicios
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
