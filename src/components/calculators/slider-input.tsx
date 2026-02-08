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

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatAsCurrency = true,
}: SliderInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <span className="text-sm font-semibold text-white">
          {formatAsCurrency ? formatCurrency(value) : String(value)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
      />
    </div>
  )
}
