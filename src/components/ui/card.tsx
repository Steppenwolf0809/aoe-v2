'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ----------------------------------------------------------------
   Card — Glass surface with optional hover micro-interaction
   ---------------------------------------------------------------- */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hover ? { scale: 1.01, y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-[var(--radius-lg)] bg-white/[0.03] backdrop-blur-xl',
        'border border-white/[0.08]',
        'shadow-glass-lg',
        hover && 'cursor-pointer transition-colors duration-200 hover:bg-white/[0.05] hover:border-white/[0.12]',
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.div>
  ),
)
Card.displayName = 'Card'

/* ----------------------------------------------------------------
   CardHeader / CardContent / CardFooter — layout slots
   ---------------------------------------------------------------- */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-text-primary', className)} {...props} />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-secondary mt-1', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0 flex items-center', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, type CardProps }
