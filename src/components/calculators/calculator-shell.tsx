'use client'

import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StepInfo {
  label: string
}

interface CalculatorShellProps {
  title: string
  description: string
  children: ReactNode
  currentStep?: number
  totalSteps?: number
  steps?: StepInfo[]
  resultSlot?: ReactNode
  onReset?: () => void
  className?: string
}

export function CalculatorShell({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  steps,
  resultSlot,
  onReset,
  className,
}: CalculatorShellProps) {
  const showStepper = totalSteps !== undefined && totalSteps > 1 && currentStep !== undefined

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] mt-2 max-w-xl mx-auto">
          {description}
        </p>
      </div>

      {/* Step Indicator */}
      {showStepper && (
        <div className="mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />
        </div>
      )}

      {/* Main Content: form + results (responsive) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Wizard / Form area */}
        <Card className={cn('lg:col-span-3', resultSlot ? '' : 'lg:col-span-5')}>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep ?? 'static'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Results area (shows below on mobile, right on desktop) */}
        {resultSlot && (
          <div className="lg:col-span-2 space-y-4">
            {resultSlot}
            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="w-full text-[var(--text-muted)] hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Calcular de nuevo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   StepIndicator — Visual progress for wizard steps
   ---------------------------------------------------------------- */
interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps?: StepInfo[]
}

function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i === currentStep
        const isCompleted = i < currentStep

        return (
          <div key={i} className="flex items-center gap-2">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors duration-300',
                  isCompleted && 'bg-accent-primary border-accent-primary text-white',
                  isActive && 'bg-accent-primary/20 border-accent-primary text-accent-primary',
                  !isActive && !isCompleted && 'bg-bg-secondary border-[var(--glass-border)] text-[var(--text-muted)]',
                )}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.div>
              {steps?.[i] && (
                <span className={cn(
                  'text-[10px] md:text-xs max-w-[80px] text-center leading-tight',
                  isActive ? 'text-text-primary font-medium' : 'text-[var(--text-muted)]',
                )}>
                  {steps[i].label}
                </span>
              )}
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  'w-8 md:w-12 h-[2px] rounded-full transition-colors duration-300 mb-4',
                  i < currentStep ? 'bg-accent-primary' : 'bg-[var(--glass-border)]',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
