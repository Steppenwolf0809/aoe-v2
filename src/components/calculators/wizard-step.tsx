'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

/* ----------------------------------------------------------------
   WizardOption — Clickable card for wizard choices
   ---------------------------------------------------------------- */
interface WizardOptionProps {
  icon?: ReactNode
  label: string
  description?: string
  selected?: boolean
  onClick: () => void
}

export function WizardOption({
  icon,
  label,
  description,
  selected,
  onClick,
}: WizardOptionProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border text-left cursor-pointer',
        'transition-all duration-200',
        'flex items-center gap-4',
        selected
          ? 'bg-accent-primary/10 border-accent-primary shadow-lg shadow-accent-primary/10'
          : 'bg-bg-secondary border-[var(--glass-border)] hover:bg-bg-tertiary hover:border-[var(--glass-border-hover)]',
      )}
    >
      {icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            selected ? 'bg-accent-primary/20 text-accent-primary' : 'bg-bg-tertiary text-[var(--text-secondary)]',
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium', selected ? 'text-text-primary' : 'text-[var(--text-secondary)]')}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{description}</p>
        )}
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

/* ----------------------------------------------------------------
   WizardStep — Individual step of the wizard
   ---------------------------------------------------------------- */
interface WizardStepProps {
  question: string
  hint?: string
  children: ReactNode
  onNext?: () => void
  onPrev?: () => void
  isFirst?: boolean
  isLast?: boolean
  nextLabel?: string
  nextDisabled?: boolean
  className?: string
}

export function WizardStep({
  question,
  hint,
  children,
  onNext,
  onPrev,
  isFirst = false,
  isLast = false,
  nextLabel,
  nextDisabled = false,
  className,
}: WizardStepProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Question */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">{question}</h2>
        {hint && <p className="text-sm text-[var(--text-muted)] mt-1">{hint}</p>}
      </div>

      {/* Options / Fields */}
      <div className="space-y-3">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {!isFirst ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onPrev}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
        ) : (
          <div />
        )}

        {onNext && (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {isLast ? (nextLabel || 'Calcular') : (nextLabel || 'Siguiente')}
            {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        )}
      </div>
    </div>
  )
}
