'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeToggle } from '@/components/theme-toggle'

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/5' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/20 group-hover:border-amber-500/30 transition-colors">
                <Phone className="h-4 w-4 text-amber-400" />
              </div>
              <span className="font-light tracking-wide text-white/80">AI Receptionist</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              <a href="#voice-demos" className="text-sm text-white/50 hover:text-white/90 transition-colors font-light tracking-wide">
                Demos
              </a>
              <a href="#features" className="text-sm text-white/50 hover:text-white/90 transition-colors font-light tracking-wide">
                Features
              </a>
              <a href="#pricing" className="text-sm text-white/50 hover:text-white/90 transition-colors font-light tracking-wide">
                Investment
              </a>
              <a href="#testimonials" className="text-sm text-white/50 hover:text-white/90 transition-colors font-light tracking-wide">
                Reviews
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle compact />
                <LanguageSelector compact />
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm text-white/50 hover:text-white/90 transition-colors font-light tracking-wide px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-6 py-2.5 rounded-full font-medium transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-4 py-8 space-y-6">
              <a 
                href="#voice-demos" 
                className="block text-white/60 hover:text-white transition-colors py-2 font-light tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demos
              </a>
              <a 
                href="#features" 
                className="block text-white/60 hover:text-white transition-colors py-2 font-light tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block text-white/60 hover:text-white transition-colors py-2 font-light tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Investment
              </a>
              <a 
                href="#testimonials" 
                className="block text-white/60 hover:text-white transition-colors py-2 font-light tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </a>
              
              <div className="flex items-center gap-3 py-2">
                <ThemeToggle compact />
                <LanguageSelector compact />
              </div>
              
              <div className="pt-6 space-y-4 border-t border-white/5">
                <Link
                  href="/login"
                  className="block text-center text-white/60 hover:text-white transition-colors py-3 font-light"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-center bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3 rounded-full font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
