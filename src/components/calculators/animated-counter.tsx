'use client'

import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  label?: string
  formatAsCurrency?: boolean
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  label,
  formatAsCurrency = true,
  duration = 400,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
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
  }, [value, duration])

  // Si tiene label, renderiza el diseño completo
  if (label) {
    return (
      <div>
        <div className={`text-2xl font-bold text-text-primary ${className || ''}`}>
          {formatAsCurrency ? formatCurrency(displayValue) : displayValue.toFixed(0)}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
      </div>
    )
  }

  // Si no tiene label, solo retorna el número (para uso inline)
  return (
    <span className={className}>
      {formatAsCurrency
        ? displayValue.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : displayValue.toFixed(0)}
    </span>
  )
}
