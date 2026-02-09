import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Abogados Online Ecuador',
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h1>
      <p className="text-[var(--text-secondary)]">
        Bienvenido a tu panel de control.
      </p>
      {/* TODO: implementar resumen del dashboard */}
    </div>
  )
}
