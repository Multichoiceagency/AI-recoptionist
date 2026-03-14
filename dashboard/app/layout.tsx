import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleTranslate } from '@/components/google-translate'

export const metadata: Metadata = {
  title: 'AI Receptionist | Premium AI Voice Concierge',
  description: 'Experience the future of hospitality. Our AI voice concierge delivers exceptional service with the warmth of human conversation, available 24 hours a day.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className={`min-h-screen transition-colors ${GeistSans.className}`}>
        <ThemeProvider>
          {children}
          <GoogleTranslate />
        </ThemeProvider>
      </body>
    </html>
  )
}
