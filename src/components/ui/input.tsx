import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  tooltip?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, tooltip, id, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type
    const describedBy = [
      error && id ? `${id}-error` : null,
      !error && hint && id ? `${id}-hint` : null,
      tooltip && id ? `${id}-tooltip` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="space-y-1.5">
        {label && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={id}
              className="block text-sm font-medium text-text-secondary"
            >
              {label}
            </label>
            {tooltip && id && (
              <span
                tabIndex={0}
                className="group relative inline-flex cursor-help focus:outline-none"
                aria-label={`Ayuda: ${label}`}
              >
                <Info className="h-3.5 w-3.5 text-text-muted transition-colors group-hover:text-accent-primary group-focus:text-accent-primary" />
                <span
                  id={`${id}-tooltip`}
                  role="tooltip"
                  className={cn(
                    'pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-md border border-[var(--glass-border)] bg-bg-primary px-2.5 py-2 text-xs leading-5 text-text-secondary shadow-lg',
                    'opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100',
                  )}
                >
                  {tooltip}
                </span>
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'w-full h-10 px-3 rounded-[var(--radius-md)] text-sm text-text-primary',
              'bg-bg-secondary border border-[var(--glass-border)]',
              'placeholder:text-text-muted',
              'hover:bg-bg-tertiary hover:border-[var(--glass-border-hover)]',
              'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-accent-error focus:ring-accent-error',
              isPasswordInput && 'pr-10', // Add right padding for the toggle button
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            {...props}
          />
          {isPasswordInput && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-text-muted hover:text-text-secondary',
                'transition-colors duration-200',
                'focus:outline-none focus:text-accent-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
              disabled={props.disabled}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-accent-error" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${id}-hint`} className="text-xs text-text-muted">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input, type InputProps }
