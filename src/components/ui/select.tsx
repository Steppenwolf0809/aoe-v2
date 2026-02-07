import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full h-10 px-3 rounded-xl text-sm text-white cursor-pointer',
            'bg-white/[0.03] border border-white/[0.08]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent',
            'transition-all duration-200',
            error && 'border-[var(--accent-error)]',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[var(--accent-error)]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select, type SelectProps }
