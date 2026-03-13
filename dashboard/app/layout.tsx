import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/sidebar'

export const metadata: Metadata = {
  title: 'AI Receptionist Dashboard',
  description: 'Beheer uw AI receptionist agents en bekijk kosten en statistieken.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className="dark">
      <body className="bg-gray-950 text-white min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-60 min-h-screen overflow-y-auto bg-gray-950">
          {children}
        </main>
      </body>
    </html>
  )
}
