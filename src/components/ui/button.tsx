'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  asChild?: boolean
  children?: ReactNode
}

const variantStyles = {
  primary: [
    'bg-accent-primary text-white',
    'hover:bg-accent-primary-hover',
    'shadow-lg shadow-accent-primary/25',
  ].join(' '),
  secondary: [
    'bg-white/10 text-white border border-white/10',
    'hover:bg-white/20 hover:border-white/20',
  ].join(' '),
  ghost: [
    'text-text-secondary',
    'hover:text-white hover:bg-white/5',
  ].join(' '),
  outline: [
    'border border-white/[0.08] text-white bg-transparent',
    'hover:bg-white/[0.04] hover:border-white/[0.16]',
  ].join(' '),
  danger: [
    'bg-accent-error text-white',
    'hover:bg-accent-error/90',
  ].join(' '),
}

const sizeStyles = {
  sm: 'h-8 px-3 text-sm rounded-[var(--radius-sm)] gap-1.5',
  md: 'h-10 px-4 text-sm rounded-[var(--radius-md)] gap-2',
  lg: 'h-12 px-6 text-base rounded-[var(--radius-md)] gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    const isDisabled = disabled || isLoading

    // If asChild is true, we don't want to pass motion props directly to Slot as it might behave unexpectedly
    // or just pass through. However, Slot expects a valid React Element child.
    // Ideally, for motion effects with asChild, we'd need the child to be a motion component too, or wrap it.
    // 
    // BUT: The main use case for asChild here is <Link>. 
    // If we use Slot, we lose the 'motion.button' wrapper.
    // 
    // Strategy:
    // If asChild, we just render the Slot with the classes. We lose the tap/hover scaling effectively unless we apply it via CSS or the child is motion.
    // For now, preserving styles is more important than the micro-scale animation on Links to fix the build.
    // 
    // Actually, we can use `motion.create(Slot)` but Slot is a functional component.
    // Let's stick to standard Slot behavior for asChild to fix the build errors.

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center font-medium cursor-pointer',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
            'disabled:opacity-50 disabled:pointer-events-none',
            variantStyles[variant],
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'inline-flex items-center justify-center font-medium cursor-pointer',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isDisabled}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
        {!isLoading && children}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
