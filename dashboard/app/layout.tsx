import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleTranslate } from '@/components/google-translate'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Receptionist | Premium AI Voice Assistant',
  description: 'Transform your business communication with our premium AI voice assistant. Natural conversations, 24/7 availability, infinite scalability.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className={`min-h-screen transition-colors ${inter.className}`}>
        <ThemeProvider>
          {children}
          <GoogleTranslate />
        </ThemeProvider>
      </body>
    </html>
  )
}
