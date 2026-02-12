'use client'

import { useState, useTransition } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { contratoVehicularSchema, type ContratoVehicular } from '@/lib/validations/contract'
import { createContract } from '@/actions/contracts'
import { Button } from '@/components/ui/button'
import type { CuvData } from '@/lib/parsers/cuv-parser'
import { VehicleDataForm } from './vehicle-data-form'
import { BuyerForm } from './buyer-form'
import { SellerForm } from './seller-form'
import { SummaryStep } from './summary-step'

const STEPS = [
  { label: 'Vehiculo' },
  { label: 'Comprador' },
  { label: 'Vendedor' },
  { label: 'Resumen' },
]

export function WizardForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [cuvData, setCuvData] = useState<CuvData | null>(null)
  const router = useRouter()

  const methods = useForm<ContratoVehicular>({
    resolver: zodResolver(contratoVehicularSchema),
    defaultValues: {
      vehiculo: {
        placa: '',
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        color: '',
        motor: '',
        chasis: '',
        avaluo: 0,
        valorContrato: 0,
      },
      comprador: {
        cedula: '',
        nombres: '',
        direccion: '',
        telefono: '',
        email: '',
      },
      vendedor: {
        cedula: '',
        nombres: '',
        direccion: '',
        telefono: '',
        email: '',
      },
    },
    mode: 'onTouched',
  })

  const { trigger, handleSubmit, getValues } = methods

  async function validateCurrentStep(): Promise<boolean> {
    switch (currentStep) {
      case 0:
        return trigger('vehiculo')
      case 1:
        return trigger('comprador')
      case 2:
        return trigger('vendedor')
      default:
        return true
    }
  }

  async function handleNext() {
    const valid = await validateCurrentStep()
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  async function onSubmit(data: ContratoVehicular) {
    setServerError(null)
    startTransition(async () => {
      // Use buyer's email as contact email for anonymous contracts
      const contactEmail = data.comprador.email
      const result = await createContract(data, contactEmail)

      if (result.success) {
        // Redirect to payment page instead of dashboard
        router.push(`/contratos/${result.data.id}/pago`)
      } else {
        setServerError(result.error)
      }
    })
  }

  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Form content */}
        <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {currentStep === 0 && <VehicleDataForm onCuvParsed={setCuvData} />}
              {currentStep === 1 && <BuyerForm />}
              {currentStep === 2 && <SellerForm />}
              {currentStep === 3 && (
                <SummaryStep
                  data={getValues()}
                  acceptedTerms={acceptedTerms}
                  onAcceptedTermsChange={setAcceptedTerms}
                  cuvWarnings={cuvData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Server error */}
          {serverError && (
            <div className="mt-4 rounded-xl border border-accent-error/30 bg-accent-error/10 px-4 py-3">
              <p className="text-sm text-accent-error">{serverError}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(isFirstStep && 'invisible')}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                isLoading={isPending}
                disabled={!acceptedTerms || isPending}
              >
                {isPending ? 'Guardando...' : 'Continuar al pago →'}
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={handleNext}>
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

/* ----------------------------------------------------------------
   StepIndicator — Adapted from calculator-shell pattern
   ---------------------------------------------------------------- */
function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: { label: string }[]
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, i) => {
        const isActive = i === currentStep
        const isCompleted = i < currentStep

        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors duration-300',
                  isCompleted &&
                    'bg-accent-primary border-accent-primary text-white',
                  isActive &&
                    'bg-accent-primary/20 border-accent-primary text-accent-primary',
                  !isActive &&
                    !isCompleted &&
                    'bg-bg-secondary border-[var(--glass-border)] text-[var(--text-muted)]',
                )}
                animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.div>
              <span
                className={cn(
                  'text-[10px] md:text-xs max-w-[80px] text-center leading-tight',
                  isActive
                    ? 'text-text-primary font-medium'
                    : 'text-[var(--text-muted)]',
                )}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 md:w-12 h-[2px] rounded-full transition-colors duration-300 mb-4',
                  i < currentStep
                    ? 'bg-accent-primary'
                    : 'bg-[var(--glass-border)]',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
