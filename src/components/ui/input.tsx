import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type

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
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
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
