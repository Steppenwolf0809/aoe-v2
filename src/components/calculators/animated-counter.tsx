'use client'

import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  label?: string
  formatAsCurrency?: boolean
  duration?: number // milisegundos
  className?: string
}

export function AnimatedCounter({
  value,
  label,
  formatAsCurrency = true,
  duration = 400,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    prevValue.current = value

    if (start === end || typeof requestAnimationFrame !== 'function') {
      setDisplayValue(end)
      return
    }

    const startTime = performance.now()
    let frame = 0

    function animate(currentTime: number) {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(start + (end - start) * eased)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    // Si rAF no corre (pestaña en segundo plano), igual se muestra el valor final
    const fallback = setTimeout(() => setDisplayValue(end), duration + 100)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(fallback)
      setDisplayValue(end)
    }
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
