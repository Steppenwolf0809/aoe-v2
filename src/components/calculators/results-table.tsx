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
    <div className="rounded-xl border border-white/[0.08] overflow-hidden">
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-white/[0.05]">
              <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{row.label}</td>
              <td className="px-4 py-3 text-sm text-white text-right font-medium">
                {formatCurrency(row.value)}
              </td>
            </tr>
          ))}
          <tr className="bg-white/[0.03]">
            <td className="px-4 py-3 text-sm font-semibold text-white">Total</td>
            <td className="px-4 py-3 text-sm font-bold text-[var(--accent-primary)] text-right">
              {formatCurrency(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
