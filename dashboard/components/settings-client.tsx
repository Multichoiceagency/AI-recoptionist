'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket, Check, X, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface CoolifyStatus {
  configured: boolean
  appName: string | null
  appStatus: string | null
  lastDeployment: string | null
  defaultConfig: string | null
  envVars: Array<{ key: string; value: string }>
  error?: string
}

interface Agent {
  name: string
  businessName: string
}

interface EnvVar {
  key: string
  configured: boolean
  masked: string | null
}

interface SettingsClientProps {
  coolifyStatus: CoolifyStatus | null
  agents: Agent[]
  envVars: EnvVar[]
}

export function SettingsClient({ coolifyStatus, agents, envVars }: SettingsClientProps) {
  const router = useRouter()
  const [deploying, setDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedDefault, setSelectedDefault] = useState(
    coolifyStatus?.defaultConfig || ''
  )
  const [settingDefault, setSettingDefault] = useState(false)
  const [defaultResult, setDefaultResult] = useState<{ success: boolean; message: string } | null>(null)
  const [showMasked, setShowMasked] = useState(false)

  const handleDeploy = async () => {
    setDeploying(true)
    setDeployResult(null)
    try {
      const res = await fetch('/api/coolify/deploy', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setDeployResult({ success: true, message: `Deployment gestart! UUID: ${data.deploymentUuid}` })
        router.refresh()
      } else {
        setDeployResult({ success: false, message: data.error || 'Deploy mislukt' })
      }
    } catch {
      setDeployResult({ success: false, message: 'Netwerkfout' })
    } finally {
      setDeploying(false)
    }
  }

  const handleSetDefault = async () => {
    if (!selectedDefault) return
    setSettingDefault(true)
    setDefaultResult(null)
    try {
      const res = await fetch('/api/coolify/default', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: selectedDefault }),
      })
      const data = await res.json()
      if (res.ok) {
        setDefaultResult({ success: true, message: `Standaard agent ingesteld op "${selectedDefault}"` })
        router.refresh()
      } else {
        setDefaultResult({ success: false, message: data.error || 'Mislukt' })
      }
    } catch {
      setDefaultResult({ success: false, message: 'Netwerkfout' })
    } finally {
      setSettingDefault(false)
    }
  }

  const agentOptions = agents.map((a) => ({
    value: a.name,
    label: `${a.businessName} (${a.name})`,
  }))

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Coolify connection */}
      <Section title="Coolify verbinding">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatusItem
              label="Verbindingsstatus"
              ok={coolifyStatus?.configured === true}
              okText="Verbonden"
              failText="Niet geconfigureerd"
            />
            <StatusItem
              label="App status"
              ok={coolifyStatus?.appStatus?.includes('running') === true}
              okText={coolifyStatus?.appStatus || '—'}
              failText={coolifyStatus?.appStatus || 'Onbekend'}
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">App naam</p>
              <p className="text-sm text-white">{coolifyStatus?.appName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Laatste deployment</p>
              <p className="text-xs font-mono text-gray-400 truncate">
                {coolifyStatus?.lastDeployment || '—'}
              </p>
            </div>
          </div>

          {coolifyStatus?.error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {coolifyStatus.error}
            </div>
          )}
        </div>
      </Section>

      {/* Default agent */}
      <Section title="Standaard Agent (DEFAULT_CONFIG)">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Huidige standaard:</span>
            <Badge variant={coolifyStatus?.defaultConfig ? 'success' : 'secondary'}>
              {coolifyStatus?.defaultConfig || 'Niet ingesteld'}
            </Badge>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Select
                label="Nieuwe standaard agent"
                value={selectedDefault}
                onChange={(e) => setSelectedDefault(e.target.value)}
                options={[
                  { value: '', label: '— Selecteer een agent —' },
                  ...agentOptions,
                ]}
              />
            </div>
            <Button
              onClick={handleSetDefault}
              loading={settingDefault}
              disabled={!selectedDefault}
              variant="outline"
            >
              Instellen
            </Button>
          </div>

          {defaultResult && (
            <div
              className={`text-sm px-3 py-2 rounded-lg border ${
                defaultResult.success
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {defaultResult.message}
            </div>
          )}

          {agents.length === 0 && (
            <p className="text-xs text-gray-500">
              Configureer GITHUB_TOKEN om agents te laden.
            </p>
          )}
        </div>
      </Section>

      {/* Deploy */}
      <Section title="Deployment">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Start een nieuwe deployment van de AI receptionist applicatie via Coolify.
            Dit herstart de container met de nieuwste configuratie.
          </p>

          <Button
            onClick={handleDeploy}
            loading={deploying}
            disabled={coolifyStatus?.configured !== true}
            className="w-full sm:w-auto"
          >
            <Rocket className="h-4 w-4" />
            Deploy Nu Starten
          </Button>

          {!coolifyStatus?.configured && (
            <p className="text-xs text-gray-500">
              Configureer de omgevingsvariabelen in .env om dit te activeren.
            </p>
          )}

          {deployResult && (
            <div
              className={`text-sm px-3 py-2 rounded-lg border ${
                deployResult.success
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {deployResult.message}
            </div>
          )}
        </div>
      </Section>

      {/* Environment variables */}
      <Section
        title="Omgevingsvariabelen"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMasked((prev) => !prev)}
          >
            {showMasked ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showMasked ? 'Verbergen' : 'Tonen'}
          </Button>
        }
      >
        <div className="space-y-2">
          {envVars.map((v) => (
            <div
              key={v.key}
              className="flex items-center justify-between py-2.5 px-4 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {v.configured ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <span className="font-mono text-xs text-gray-300">{v.key}</span>
              </div>
              <div className="flex items-center gap-2">
                {v.configured ? (
                  <span className="text-xs font-mono text-gray-500">
                    {showMasked ? v.masked : '••••••••'}
                  </span>
                ) : (
                  <Badge variant="destructive">Niet ingesteld</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Stel omgevingsvariabelen in via het .env bestand in de dashboard map.
          Herstart de server na wijzigingen.
        </p>
      </Section>

      {/* Coolify env vars (if available) */}
      {coolifyStatus?.envVars && coolifyStatus.envVars.length > 0 && (
        <Section title="Coolify omgevingsvariabelen (live)">
          <div className="space-y-2">
            {coolifyStatus.envVars.slice(0, 15).map((v, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-4 bg-gray-800 rounded-lg">
                <span className="font-mono text-xs text-gray-300">{v.key}</span>
                <span className="text-xs font-mono text-gray-500">
                  {v.key.toLowerCase().includes('key') ||
                  v.key.toLowerCase().includes('token') ||
                  v.key.toLowerCase().includes('secret')
                    ? '••••••••'
                    : v.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function StatusItem({
  label,
  ok,
  okText,
  failText,
}: {
  label: string
  ok: boolean
  okText: string
  failText: string
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${ok ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className={`text-sm ${ok ? 'text-green-400' : 'text-red-400'}`}>
          {ok ? okText : failText}
        </span>
      </div>
    </div>
  )
}
