import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3 rounded-xl text-sm text-white',
            'bg-white/[0.03] border border-white/[0.08]',
            'placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent',
            'transition-all duration-200',
            error && 'border-[var(--accent-error)] focus:ring-[var(--accent-error)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--accent-error)]">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, type InputProps }
