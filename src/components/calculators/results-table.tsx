import { formatCurrency } from '@/lib/utils'

interface ResultRow {
  label: string
  value: number
}

interface ResultsTableProps {
  rows: ResultRow[]
  total: number
}

export function ResultsTable({ rows, total }: ResultsTableProps) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] overflow-hidden">
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-[var(--glass-border)]">
              <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{row.label}</td>
              <td className="px-4 py-3 text-sm text-text-primary text-right font-medium">
                {formatCurrency(row.value)}
              </td>
            </tr>
          ))}
          <tr className="bg-bg-secondary">
            <td className="px-4 py-3 text-sm font-semibold text-text-primary">Total</td>
            <td className="px-4 py-3 text-sm font-bold text-[var(--accent-primary)] text-right">
              {formatCurrency(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
