import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4">
      <Link href="/" className="mb-8">
        <Image
          src="/logo/logo-horizontal.svg"
          alt="Abogados Online Ecuador"
          width={220}
          height={88}
          className="h-12 w-auto"
          priority
        />
      </Link>
      {children}
    </div>
  )
}
