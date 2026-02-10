import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-text-secondary border-white/10',
  success: 'bg-accent-success/10 text-accent-success border-accent-success/20',
  warning: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  error: 'bg-accent-error/10 text-accent-error border-accent-error/20',
  info: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
  purple: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
  outline: 'bg-transparent text-slate-600 border-slate-200',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-0.5 text-xs',
}

export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        'transition-colors duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  )
}

export type { BadgeProps, BadgeVariant }
