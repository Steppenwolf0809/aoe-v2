import { cn } from '@/lib/utils'

interface WordmarkProps {
  className?: string
  compact?: boolean
}

export function Wordmark({ className, compact = false }: WordmarkProps) {
  return (
    <div className={cn('flex items-center gap-3 leading-none text-slate-950', className)}>
      <div
        className={cn(
          'relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] border border-slate-950/10 bg-slate-950 text-white shadow-[0_10px_28px_-18px_rgba(2,6,23,0.9)]',
          compact ? 'h-9 w-9' : 'h-10 w-10',
        )}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.28),transparent_42%),linear-gradient(315deg,rgba(244,63,94,0.22),transparent_45%)]" />
        <div className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
        <div className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border border-white/35" />
        <span className={cn('relative font-mono font-semibold tracking-[-0.08em]', compact ? 'text-[15px]' : 'text-base')}>
          AO
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className={cn('font-semibold tracking-[-0.03em]', compact ? 'text-lg' : 'text-xl')}>Abogados</span>
          <span className={cn('font-mono font-semibold tracking-[-0.04em] text-sky-700', compact ? 'text-lg' : 'text-xl')}>
            Online
          </span>
        </div>
        <div className={cn('mt-1 font-medium uppercase tracking-[0.22em] text-slate-500', compact ? 'text-[9px]' : 'text-[10px]')}>
          Ecuador
        </div>
      </div>
    </div>
  )
}
