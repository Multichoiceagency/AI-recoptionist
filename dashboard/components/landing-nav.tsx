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
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0118]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">AI Receptionist</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors relative group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle compact />
                <LanguageSelector compact />
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                >
                  Start Free Trial
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0A0118]/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <a 
                href="#features" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </a>
              
              <div className="flex items-center gap-3 py-2">
                <ThemeToggle compact />
                <LanguageSelector compact />
              </div>
              
              <div className="pt-4 space-y-3 border-t border-white/10">
                <Link
                  href="/login"
                  className="block text-center text-gray-300 hover:text-white transition-colors py-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
