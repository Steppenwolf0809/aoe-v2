import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { WhatsAppFloatButton } from '@/components/layout/whatsapp-float-button'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Abogados Online Ecuador | Servicios Notariales y Legales',
    template: '%s | Abogados Online Ecuador',
  },
  description:
    'Plataforma legal tecnológica para generación de contratos vehiculares, calculadoras notariales y servicios legales en Ecuador. Rápido, seguro y confiable.',
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
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <WhatsAppFloatButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
