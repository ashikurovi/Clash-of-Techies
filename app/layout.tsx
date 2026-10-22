import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#130d24' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://clash-of-techies-2026.vercel.app'),
  title: 'Clash of Techies 2026 | Polytechnic Coders × CPI Timeline',
  description: 'Clash of Techies 2026 - Hardware, Networking & Software Engineering Quiz Competition organized by Polytechnic Coders (By Programming Hero) & CPI Timeline.',
  keywords: ['Clash of Techies', 'Polytechnic Coders', 'CPI Timeline', 'Programming Hero', 'Tech Quiz 2026', 'Polytechnic Quiz'],
  authors: [{ name: 'Polytechnic Coders' }, { name: 'CPI Timeline' }],
  openGraph: {
    title: 'Clash of Techies 2026 | Polytechnic Coders × CPI Timeline',
    description: 'Hardware, Networking & Software Engineering Quiz Competition 2026 for Polytechnic Students.',
    images: [
      {
        url: '/clash-of-techies-banner.png',
        width: 1080,
        height: 1080,
        alt: 'Clash of Techies 2026 Banner',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased overflow-x-hidden min-h-screen text-foreground bg-background selection:bg-purple-500 selection:text-white">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
