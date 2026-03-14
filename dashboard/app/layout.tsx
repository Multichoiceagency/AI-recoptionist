import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleTranslate } from '@/components/google-translate'

export const metadata: Metadata = {
  title: 'AI Receptionist | Automatiseer Uw Klantenservice met AI',
  description: 'Professionele AI-gestuurde telefoonbeantwoording voor uw bedrijf. 24/7 beschikbaar, meertalig, en naadloos geïntegreerd.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className="dark" suppressHydrationWarning>
      <body className="min-h-screen transition-colors">
        <ThemeProvider>
          {children}
          <GoogleTranslate />
        </ThemeProvider>
      </body>
    </html>
  )
}
