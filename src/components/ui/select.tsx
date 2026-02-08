import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full h-10 px-3 pr-8 rounded-[var(--radius-md)] text-sm text-white cursor-pointer appearance-none',
              'bg-white/[0.03] border border-white/[0.08]',
              'hover:bg-white/[0.05] hover:border-white/[0.12]',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-accent-error focus:ring-accent-error',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-bg-secondary text-text-muted">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-bg-secondary text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {error && (
          <p className="text-xs text-accent-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select, type SelectProps, type SelectOption }
