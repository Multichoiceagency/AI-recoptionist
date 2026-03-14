'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeToggle } from '@/components/theme-toggle'

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Phone className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-bold text-white text-lg">AI Receptionist</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Functies</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Prijzen</a>
            <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <LanguageSelector compact />
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Inloggen
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Gratis Starten
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
