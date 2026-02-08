'use client'

import { useEffect, useRef } from 'react'
import {
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from 'framer-motion'

interface UseAnimatedCounterOptions {
  /** Target value to animate to */
  value: number
  /** Animation duration in seconds */
  duration?: number
  /** Decimal places to display */
  decimals?: number
}

/**
 * Animates a numeric counter with Framer Motion useMotionValue + useTransform.
 * Only triggers when the element enters viewport (useInView).
 */
export function useAnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
}: UseAnimatedCounterOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString('es-EC'),
  )

  useEffect(() => {
    if (!isInView) return

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    })

    return () => controls.stop()
  }, [isInView, value, duration, motionValue])

  return { ref, displayValue: rounded, isInView }
}
