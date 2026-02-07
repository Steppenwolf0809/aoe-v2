'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  displayValue?: string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, displayValue, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {(label || displayValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
                {label}
              </label>
            )}
            {displayValue && (
              <span className="text-sm font-semibold text-white">{displayValue}</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          type="range"
          className={cn(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            'bg-white/10',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-primary)]',
            '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider, type SliderProps }
