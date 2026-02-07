'use client'

import { Slider } from '@/components/ui/slider'
import { formatCurrency } from '@/lib/utils'

interface SliderInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  formatAsCurrency?: boolean
}

export function SliderInput({ label, value, onChange, min, max, step, formatAsCurrency = true }: SliderInputProps) {
  return (
    <Slider
      label={label}
      displayValue={formatAsCurrency ? formatCurrency(value) : String(value)}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
