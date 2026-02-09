import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              index <= currentStep
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-bg-tertiary text-[var(--text-muted)]'
            )}
          >
            {index + 1}
          </div>
          <span
            className={cn(
              'text-sm hidden sm:inline',
              index <= currentStep ? 'text-text-primary' : 'text-[var(--text-muted)]'
            )}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-8 h-px',
              index < currentStep ? 'bg-[var(--accent-primary)]' : 'bg-[var(--glass-border)]'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
