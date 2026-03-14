'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  compact?: boolean
  className?: string
}

export function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-2 rounded-lg transition-colors',
        'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white',
        'light:text-gray-600 light:hover:text-gray-900',
        compact
          ? 'p-2 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100'
          : 'px-3 py-2 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 border border-gray-700 dark:border-gray-700 light:border-gray-300',
        className
      )}
      title={theme === 'dark' ? 'Schakel naar licht thema' : 'Schakel naar donker thema'}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          {!compact && <span className="text-sm">Licht</span>}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          {!compact && <span className="text-sm">Donker</span>}
        </>
      )}
    </button>
  )
}
