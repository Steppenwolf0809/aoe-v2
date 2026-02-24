import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Abogados Online Ecuador | Servicios Notariales y Legales',
    template: '%s | Abogados Online Ecuador',
  },
  description:
    'Plataforma legal tecnologica para generacion de contratos vehiculares, calculadoras notariales y servicios legales en Ecuador. Rapido, seguro y confiable.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://abogadosonlineecuador.com'),
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    siteName: 'Abogados Online Ecuador',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo/favicon-32.png', type: 'image/png', sizes: '33x33' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo/favicon-32.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
