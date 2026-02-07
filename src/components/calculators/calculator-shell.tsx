import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface CalculatorShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function CalculatorShell({ title, description, children }: CalculatorShellProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
