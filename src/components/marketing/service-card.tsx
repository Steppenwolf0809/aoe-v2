'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    FileText,
    Home,
    Car,
    Scale,
    Briefcase,
    Globe,
    Users,
    ShieldCheck,
    HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
    title: string
    description: string
    iconName: string
    href: string
    delay?: number
    className?: string
}

const iconMap: Record<string, any> = {
    'file-text': FileText,
    'home': Home,
    'car': Car,
    'scale': Scale,
    'briefcase': Briefcase,
    'globe': Globe,
    'users': Users,
    'shield-check': ShieldCheck,
}

export function ServiceCard({
    title,
    description,
    iconName,
    href,
    delay = 0,
    className,
}: ServiceCardProps) {
    const Icon = iconMap[iconName] || HelpCircle

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                'group relative flex flex-col p-6 rounded-2xl border bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-300',
                'border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50',
                'hover:shadow-lg hover:shadow-blue-500/5',
                className
            )}
        >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-6 w-6" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </h3>

            <p className="mb-6 flex-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
            </p>

            <Link
                href={href}
                className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
            >
                Más detalles
                <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
        </motion.div>
    )
}
