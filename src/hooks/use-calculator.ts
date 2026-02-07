'use client'

import { useState, useCallback } from 'react'

interface UseCalculatorOptions<TInput, TResult> {
  calculate: (input: TInput) => TResult
  initialInput: TInput
}

export function useCalculator<TInput, TResult>({ calculate, initialInput }: UseCalculatorOptions<TInput, TResult>) {
  const [input, setInput] = useState<TInput>(initialInput)
  const [result, setResult] = useState<TResult>(() => calculate(initialInput))

  const updateInput = useCallback(
    (newInput: Partial<TInput>) => {
      setInput((prev) => {
        const updated = { ...prev, ...newInput }
        setResult(calculate(updated))
        return updated
      })
    },
    [calculate]
  )

  const reset = useCallback(() => {
    setInput(initialInput)
    setResult(calculate(initialInput))
  }, [calculate, initialInput])

  return { input, result, updateInput, reset }
}
