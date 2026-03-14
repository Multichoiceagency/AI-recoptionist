'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  CreditCard,
  Settings,
  Rocket,
  Phone,
  PhoneCall,
  LogOut,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { LanguageSelector } from '@/components/language-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Telefonie', href: '/dashboard/telephony', icon: PhoneCall },
  { label: 'Metrics', href: '/dashboard/metrics', icon: BarChart3 },
  { label: 'Kosten', href: '/dashboard/costs', icon: CreditCard },
  { label: 'Instellingen', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [deploying, setDeploying] = useState(false)
  const [deployMsg, setDeployMsg] = useState<string | null>(null)
  const supabase = createClient()

  const handleDeploy = async () => {
    setDeploying(true)
    setDeployMsg(null)
    try {
      const res = await fetch('/api/coolify/deploy', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setDeployMsg('Deployment gestart!')
        setTimeout(() => setDeployMsg(null), 4000)
      } else {
        setDeployMsg(data.error || 'Deploy mislukt')
        setTimeout(() => setDeployMsg(null), 5000)
      }
    } catch {
      setDeployMsg('Netwerkfout')
      setTimeout(() => setDeployMsg(null), 4000)
    } finally {
      setDeploying(false)
      router.refresh()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-40 transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Phone className="h-5 w-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <span className="font-bold text-white text-sm leading-tight block">AI Receptionist</span>
          <span className="text-xs text-gray-500">Dashboard</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <LanguageSelector compact />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User & Deploy */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="p-2 bg-gray-800 rounded-lg">
            <UserIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">
              {user.email?.split('@')[0] || 'Gebruiker'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {deployMsg && (
          <p
            className={cn(
              'text-xs px-3 py-2 rounded-lg text-center',
              deployMsg.includes('gestart') || deployMsg.includes('!')
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}
          >
            {deployMsg}
          </p>
        )}
        
        <Button
          onClick={handleDeploy}
          loading={deploying}
          className="w-full"
          size="sm"
        >
          <Rocket className="h-3.5 w-3.5" />
          Deploy
        </Button>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  )
}
