'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
    title: string
    children: React.ReactNode
    isOpen?: boolean
    onToggle?: () => void
    className?: string
}

export function AccordionItem({
    title,
    children,
    isOpen,
    onToggle,
    className,
}: AccordionItemProps) {
    return (
        <div className={cn('border-b border-slate-200 dark:border-slate-800', className)}>
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-blue-600 dark:hover:text-blue-400 group"
            >
                <span className="text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </span>
                <ChevronDown
                    className={cn(
                        'h-5 w-5 text-slate-500 transition-transform duration-200',
                        isOpen && 'rotate-180 text-blue-600 dark:text-blue-400'
                    )}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 pt-0 text-slate-600 dark:text-slate-400">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function Accordion({
    items,
    className,
}: {
    items: { title: string; content: React.ReactNode }[]
    className?: string
}) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0)

    return (
        <div className={cn('w-full', className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    )
}
