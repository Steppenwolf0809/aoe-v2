'use client'

import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  label: string
  formatAsCurrency?: boolean
}

export function AnimatedCounter({ value, label, formatAsCurrency = true }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const duration = 400
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    prevValue.current = value
  }, [value])

  return (
    <div>
      <div className="text-2xl font-bold text-white">
        {formatAsCurrency ? formatCurrency(displayValue) : displayValue.toFixed(0)}
      </div>
      <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
    </div>
  )
}
