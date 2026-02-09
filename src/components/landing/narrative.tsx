'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   Narrative Item Data
   ---------------------------------------------------------------- */
const narrativeSteps = [
    {
        id: 1,
        title: 'Validación Jurídica Experta',
        subtitle: 'Tecnología + Experiencia Humana',
        description:
            'Cada contrato generado en nuestra plataforma ha sido redactado y revisado por notarios y abogados expertos. Garantizamos que tus documentos cumplan con la normativa ecuatoriana vigente (Ley Notarial, Código Civil), listos para firmar en cualquier notaría del país.',
        bulletPoints: [
            'Cláusulas actualizadas 2024',
            'Cumplimiento de requisitos SRI y AMT',
            'Formato notarial estándar',
        ],
        icon: Check,
        color: 'text-accent-success',
        bgColor: 'bg-accent-success/10',
        image: '/assets/landing/validation_process.svg',
        align: 'left', // Text on left, Image on right
    },
    {
        id: 2,
        title: 'Velocidad sin Precedentes',
        subtitle: 'De horas a minutos',
        description:
            'Olvídate de esperar borradores o coordinar citas para simples consultas. Con nuestras calculadoras y generadores automáticos, obtienes resultados instantáneos. Lo que antes tomaba días, ahora lo resuelves en lo que tardas en tomar un café.',
        bulletPoints: [
            'Contratos listos en < 5 minutos',
            'Cálculo de impuestos en tiempo real',
            'Disponible 24/7 sin cita previa',
        ],
        icon: Zap,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        image: '/assets/landing/speed_process.svg',
        align: 'right', // Image on left, Text on right
    },
    {
        id: 3,
        title: 'Seguridad y Privacidad',
        subtitle: 'Tus datos están protegidos',
        description:
            'Entendemos la sensibilidad de la información legal. Utilizamos encriptación de grado bancario para proteger tus datos personales y los detalles de tus transacciones. Tu privacidad y seguridad son nuestra prioridad absoluta.',
        bulletPoints: [
            'Encriptación SSL/TLS',
            'Sin almacenamiento de datos sensibles',
            'Pagos seguros procesados externamente',
        ],
        icon: Shield,
        color: 'text-accent-primary',
        bgColor: 'bg-accent-primary/10',
        image: '/assets/landing/security_process.svg',
        align: 'left', // Text on left, Image on right
    },
]

/* ----------------------------------------------------------------
   Narrative Component
   ---------------------------------------------------------------- */
export function Narrative() {
    return (
        <section className="py-24 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24">
                {narrativeSteps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${step.align === 'right' ? 'lg:flex-row-reverse' : ''
                            }`}
                    >
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: step.align === 'left' ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6 }}
                            className="flex-1"
                        >
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${step.bgColor} mb-6`}>
                                <step.icon className={`w-4 h-4 ${step.color}`} />
                                <span className={`text-xs font-semibold ${step.color} tracking-wide uppercase`}>
                                    {step.subtitle}
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6 leading-tight">
                                {step.title}
                            </h2>

                            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                {step.description}
                            </p>

                            <ul className="space-y-4 mb-8">
                                {step.bulletPoints.map((point) => (
                                    <li key={point} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-text-muted" />
                                        </div>
                                        <span className="text-text-secondary">{point}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button variant="ghost" className="text-accent-primary hover:text-accent-primary-hover p-0 hover:bg-transparent group">
                                Conoce más sobre esto
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>

                        {/* Visual Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-1 w-full"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
                                {/* Use standard img for now to avoid next/image static import issues if files don't exist yet, 
                                     or we can use Next Image with width/height */}
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                                />
                                {/* Gradient overlay for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    )
}
