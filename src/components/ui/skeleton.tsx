import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] bg-slate-200/60',
        'animate-shimmer bg-[length:200%_100%]',
        'bg-gradient-to-r from-slate-200/60 via-slate-100/80 to-slate-200/60',
        className,
      )}
    />
  )
}

/* Pre-composed skeleton patterns for common layouts */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-[var(--radius-lg)] bg-bg-secondary border border-[var(--glass-border)] p-6 space-y-4', className)}>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="pt-2">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  )
}
