import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] bg-white/[0.06]',
        'animate-shimmer bg-[length:200%_100%]',
        'bg-gradient-to-r from-white/[0.06] via-white/[0.10] to-white/[0.06]',
        className,
      )}
    />
  )
}

/* Pre-composed skeleton patterns for common layouts */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-[var(--radius-lg)] bg-white/[0.03] border border-white/[0.08] p-6 space-y-4', className)}>
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
