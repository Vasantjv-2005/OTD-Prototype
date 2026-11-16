import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OTD — Own The Day | A Personal Style Companion',
  description: 'Your style. Every place. A personal fashion companion that styles what you already own for where life takes you.',
  generator: 'OTD',
  icons: {
    icon: [
      {
        url: '/apple-icon.png',
      },
      {
        url: '/favicon.ico',
      },
    ],
    shortcut: '/apple-icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F7F4EE',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
