'use client'

import { forwardRef, useCallback, useRef, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  className?: string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      label,
      showValue = false,
      formatValue,
      className,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

    const currentValue = value?.[0] ?? defaultValue?.[0] ?? min
    const percentage = ((currentValue - min) / (max - min)) * 100

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        onValueChange?.([newValue])
      },
      [onValueChange],
    )

    const displayValue = formatValue ? formatValue(currentValue) : currentValue.toString()

    return (
      <div className={cn('space-y-2', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-text-secondary">{label}</span>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center h-5">
          {/* Track background */}
          <div className="absolute inset-x-0 h-2 rounded-full bg-white/10" />
          {/* Filled track */}
          <div
            className="absolute h-2 rounded-full bg-accent-primary transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
          {/* Native range input */}
          <input
            ref={inputRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10',
              /* Webkit thumb */
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-white',
              '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-primary',
              '[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]',
              '[&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:duration-200',
              '[&::-webkit-slider-thumb]:hover:shadow-[0_0_0_6px_rgba(59,130,246,0.25)]',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              /* Firefox thumb */
              '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2',
              '[&::-moz-range-thumb]:border-accent-primary [&::-moz-range-thumb]:bg-white',
              '[&::-moz-range-thumb]:cursor-pointer',
              /* Firefox track */
              '[&::-moz-range-track]:bg-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          />
        </div>
      </div>
    )
  },
)
Slider.displayName = 'Slider'

export { Slider, type SliderProps }
