'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Bot, Calculator, FileCheck2, FileText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ----------------------------------------------------------------
   Hero visual - vertical legal pipeline
   ---------------------------------------------------------------- */
/* ----------------------------------------------------------------
   Hero visual - Stitch-designed Pipeline
   ---------------------------------------------------------------- */
const pipelineSteps = [
  {
    id: 'scan',
    title: 'Recepción de Datos',
    status: 'Verificando requisitos...',
    icon: Bot,
    side: 'right',
    progress: 65,
  },
  {
    id: 'process',
    title: 'Revisión Legal',
    status: 'Validando normativa...',
    icon: ShieldCheck,
    side: 'left',
    progress: 80,
  },
  {
    id: 'complete',
    title: 'Listo para Firma',
    status: 'Aprobado',
    icon: FileCheck2,
    side: 'right',
    progress: 100,
  },
]

function PipelineFlowVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto h-[600px] flex items-center justify-center font-sans">

      {/* Main Container with Stitch-style Glass and Grid */}
      <div className="relative w-full h-full bg-[#f6f8f7]/80 backdrop-blur-xl border border-[#10b77f]/10 rounded-3xl shadow-2xl p-6 flex flex-col items-center overflow-hidden">

        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 183, 127, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 183, 127, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#10b77f]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#10b77f]/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 w-full flex items-center justify-between border-b border-[#10b77f]/10 pb-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b77f]/10 border border-[#10b77f]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b77f] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b77f]" />
            </span>
            <span className="text-[10px] font-bold text-[#10b77f] uppercase tracking-wider">
              Trámite en Curso
            </span>
          </div>
          <Badge variant="outline" className="bg-white/50 border-slate-200 text-slate-500">
            v2.4
          </Badge>
        </div>

        {/* Pipeline Area */}
        <div className="relative z-10 flex-1 w-full flex justify-center">

          {/* Central Line */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#10b77f]/30 to-transparent">
            {/* Moving Orb */}
            <motion.div
              className="absolute w-3 h-3 bg-[#10b77f] rounded-full shadow-[0_0_10px_#10b77f] left-1/2 -translate-x-1/2"
              initial={{ top: '10%', opacity: 0 }}
              animate={{ top: '90%', opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Cards Container */}
          <div className="w-full flex flex-col justify-around py-4">
            {pipelineSteps.map((step, index) => (
              <div key={step.id} className="relative w-full h-24 flex items-center justify-center">

                {/* Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#10b77f]/30 rounded-full z-20 flex items-center justify-center">
                  <motion.div
                    className="w-2 h-2 bg-[#10b77f] rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ duration: 0.5, delay: index * 1.3 + 0.5, repeat: Infinity, repeatDelay: 3.5 }}
                  />
                </div>

                {/* Card */}
                <motion.div
                  className={`absolute w-40 sm:w-48 p-3 rounded-xl border border-[#10b77f]/10 bg-white/60 backdrop-blur-md shadow-lg flex flex-col gap-2 ${step.side === 'left' ? 'right-[55%] text-right items-end' : 'left-[55%] text-left items-start'}`}
                  initial={{ opacity: 0, x: step.side === 'left' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.2) }}
                >
                  <div className="flex items-center gap-2 text-[#10b77f]">
                    <step.icon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Etapa 0{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">{step.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">{step.status}</p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-[#10b77f]"
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + (index * 0.5), repeat: Infinity, repeatDelay: 2 }}
                    />
                  </div>
                </motion.div>

              </div>
            ))}
          </div>

          {/* Floating Tags */}


          <motion.div
            className="absolute bottom-[20%] left-[5%] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#10b77f]/20 shadow-sm flex items-center gap-1.5"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheck className="w-3 h-3 text-[#10b77f]" />
            <span className="text-[10px] font-bold text-slate-600">100% Fiable</span>
          </motion.div>

        </div>

        {/* Footer Stats */}
        <div className="relative z-10 w-full grid grid-cols-3 gap-2 border-t border-[#10b77f]/10 pt-4 mt-auto text-center">
          <div>
            <p className="text-lg font-bold text-[#10b77f]">24/7</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Disponibilidad</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#10b77f]">100%</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Validez Legal</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#10b77f]">Total</p>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Seguridad</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   Hero Section
   ---------------------------------------------------------------- */
export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 50% at 18% 8%, rgba(2,64,137,0.13) 0%, transparent 68%), radial-gradient(ellipse 50% 42% at 84% 72%, rgba(15,23,42,0.08) 0%, transparent 70%), linear-gradient(165deg, #f8fbff 0%, #eef3fa 46%, #ffffff 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="absolute top-20 left-[12%] h-72 w-72 rounded-full bg-accent-primary/[0.1] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-16 right-[12%] h-64 w-64 rounded-full bg-cyan-400/[0.09] blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-success/75 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-success" />
                </span>
                <span className="text-xs font-medium text-text-secondary">
                  Servicios Notariales & Legales en Quito
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.1] tracking-tight mb-6"
            >
              Tus trámites notariales,{' '}
              <motion.span
                className="inline-block bg-[linear-gradient(110deg,#024089,45%,#60a5fa,55%,#024089)] bg-[length:200%_100%] bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              >
                rápidos y seguros en Quito
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed max-w-lg mb-10"
            >
              Genera contratos válidos en línea o gestiona tus trámites físicos directamente en Quito.
              Combinamos tecnología legal con la experiencia de una notaría tradicional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/contratos/vehicular">
                <Button
                  size="lg"
                  className="bg-accent-primary hover:bg-accent-primary-hover text-white shadow-lg shadow-accent-primary/25"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Contrato
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/calculadoras">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Costos
                  <Badge variant="info" size="sm" className="ml-2 border-none">
                    Gratis
                  </Badge>
                </Button>
              </Link>
              <Link href="/servicios">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-text-secondary hover:text-text-primary hover:bg-slate-100"
                >
                  Ver Servicios
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
            <PipelineFlowVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
