'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PricingFeaturesProps {
    features: string[]
}

interface PricingCardProps {
    title: string
    price: string
    description: string
    features: string[]
    isPopular?: boolean
    ctaText?: string
    ctaLink?: string
    delay?: number
}

export function PricingCard({
    title,
    price,
    description,
    features,
    isPopular = false,
    ctaText = 'Empezar ahora',
    ctaLink = '/contacto',
    delay = 0,
}: PricingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                'relative flex flex-col p-6 sm:p-8 rounded-3xl border backdrop-blur-md transition-all duration-300',
                isPopular
                    ? 'bg-gradient-to-b from-slate-900/80 to-slate-800/80 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10'
                    : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            )}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Más Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={cn("text-lg font-semibold mb-2", isPopular ? "text-white" : "text-slate-900 dark:text-white")}>
                    {title}
                </h3>
                <p className={cn("text-sm", isPopular ? "text-slate-300" : "text-slate-500 dark:text-slate-400")}>
                    {description}
                </p>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className={cn("text-4xl font-bold", isPopular ? "text-white" : "text-slate-900 dark:text-white")}>
                        {price}
                    </span>
                    {price !== 'Gratis' && (
                        <span className={cn("text-sm", isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-500")}>
                            / trámite
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 mb-8">
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Check className={cn("w-5 h-5 shrink-0", isPopular ? "text-blue-400" : "text-blue-600 dark:text-blue-500")} />
                            <span className={cn("text-sm", isPopular ? "text-slate-300" : "text-slate-600 dark:text-slate-300")}>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                asChild
                variant={isPopular ? 'primary' : 'outline'}
                className={cn(
                    "w-full h-12 rounded-xl text-base font-medium transition-all",
                    isPopular
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
            >
                <a href={ctaLink}>{ctaText}</a>
            </Button>
        </motion.div>
    )
}
