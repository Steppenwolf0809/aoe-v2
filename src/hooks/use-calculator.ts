'use client'

import { useState, useCallback } from 'react'

interface UseCalculatorOptions<TInput, TResult> {
  calculate: (input: TInput) => TResult
  initialInput: TInput
  totalSteps?: number
}

export function useCalculator<TInput, TResult>({
  calculate,
  initialInput,
  totalSteps = 1,
}: UseCalculatorOptions<TInput, TResult>) {
  const [input, setInput] = useState<TInput>(initialInput)
  const [result, setResult] = useState<TResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const updateInput = useCallback(
    (newInput: Partial<TInput>) => {
      setInput((prev) => ({ ...prev, ...newInput }))
      setError(null)
    },
    [],
  )

  const computeResult = useCallback((overrideInput?: TInput) => {
    setLoading(true)
    setError(null)
    try {
      const inputToUse = overrideInput ?? input
      if (overrideInput) {
        setInput(overrideInput)
      }
      const res = calculate(inputToUse)
      setResult(res)
      setCompleted(true)
      return res
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al calcular'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [calculate, input])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps],
  )

  const reset = useCallback(() => {
    setInput(initialInput)
    setResult(null)
    setError(null)
    setLoading(false)
    setCurrentStep(0)
    setCompleted(false)
  }, [initialInput])

  return {
    input,
    result,
    error,
    loading,
    currentStep,
    totalSteps,
    completed,
    updateInput,
    computeResult,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  }
}
