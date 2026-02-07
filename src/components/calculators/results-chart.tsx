'use client'

import { cn } from '@/lib/utils'

interface ChartItem {
  label: string
  value: number
  color: string
}

interface ResultsChartProps {
  items: ChartItem[]
  maxValue: number
}

export function ResultsChart({ items, maxValue }: ResultsChartProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[var(--text-secondary)]">{item.label}</span>
            <span className="text-white font-medium">${item.value.toFixed(2)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10">
            <div
              className={cn('h-full rounded-full transition-all duration-500', item.color)}
              style={{ width: `${Math.min((item.value / maxValue) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
