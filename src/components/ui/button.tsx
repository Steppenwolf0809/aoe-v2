import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
          'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 shadow-lg shadow-[var(--accent-primary)]/25':
              variant === 'primary',
            'bg-white/10 text-white hover:bg-white/20 border border-white/10':
              variant === 'secondary',
            'text-[var(--text-secondary)] hover:text-white hover:bg-white/5':
              variant === 'ghost',
            'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-white hover:bg-white/[0.06] hover:border-white/[0.12]':
              variant === 'glass',
            'bg-[var(--accent-error)] text-white hover:bg-[var(--accent-error)]/90':
              variant === 'danger',
          },
          {
            'h-8 px-3 text-sm rounded-lg gap-1.5': size === 'sm',
            'h-10 px-4 text-sm rounded-xl gap-2': size === 'md',
            'h-12 px-6 text-base rounded-xl gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
