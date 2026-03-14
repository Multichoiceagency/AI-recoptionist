import Link from 'next/link'
import { Bot, CreditCard, Star, TrendingUp, ArrowRight } from 'lucide-react'
import { StatsCard } from '@/components/stats-card'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { DashboardChart } from '@/components/dashboard-chart'

async function getAgents() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/agents`, { next: { revalidate: 300 } })
    if (!res.ok) return { agents: [], error: await res.json().then(d => d.error) }
    const agents = await res.json()
    return { agents, error: null }
  } catch {
    return { agents: [], error: 'Kon agents niet ophalen' }
  }
}

async function getCoolifyStatus() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/coolify/status`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getOpenAIUsage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/openai/usage`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getLiveKitStatus() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/livekit/status`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export default async function DashboardPage() {
  const [{ agents, error: agentsError }, coolify, openaiUsage, livekitStatus] = await Promise.all([
    getAgents(),
    getCoolifyStatus(),
    getOpenAIUsage(),
    getLiveKitStatus(),
  ])

  const agentCount = agents.length
  const defaultConfig = coolify?.defaultConfig || '—'
  const todayCost = openaiUsage?.todayCostEur ?? null
  const monthCost = openaiUsage?.monthCostEur ?? null
  const chartData = openaiUsage?.dailyData || generateFallbackChartData()
  const recentAgents = agents.slice(0, 8)

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Dashboard"
        description="Overzicht van uw AI receptionist systeem"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Actieve Agents"
            value={agentsError ? '—' : agentCount}
            description={agentsError ? agentsError : `${agentCount} configuraties geladen`}
            icon={Bot}
            iconClassName="bg-blue-500/10"
          />
          <StatsCard
            title="Standaard Agent"
            value={defaultConfig}
            description={
              coolify?.configured === false
                ? 'Coolify niet geconfigureerd'
                : 'Huidige DEFAULT_CONFIG'
            }
            icon={Star}
            iconClassName="bg-yellow-500/10"
          />
          <StatsCard
            title="OpenAI Kosten Vandaag"
            value={
              todayCost !== null
                ? formatEur(todayCost)
                : openaiUsage?.error
                ? '—'
                : 'Laden...'
            }
            description={
              openaiUsage?.error
                ? 'Configureer OPENAI_API_KEY'
                : 'Realtime API gebruik'
            }
            icon={CreditCard}
            iconClassName="bg-green-500/10"
          />
          <StatsCard
            title="OpenAI Kosten Deze Maand"
            value={
              monthCost !== null
                ? formatEur(monthCost)
                : openaiUsage?.error
                ? '—'
                : 'Laden...'
            }
            description={
              openaiUsage?.error
                ? 'Configureer OPENAI_API_KEY'
                : 'Laatste 7 dagen geschat'
            }
            icon={TrendingUp}
            iconClassName="bg-purple-500/10"
          />
        </div>

        {/* Not configured warnings */}
        {agentsError && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
            <strong>GitHub niet geconfigureerd:</strong> Configureer de omgevingsvariabelen in .env om dit te activeren.
          </div>
        )}

        {/* Chart + Recent Agents */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cost Chart */}
          <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-white">Geschatte kosten per dag</h2>
                <p className="text-xs text-gray-500 mt-1">Laatste 7 dagen — OpenAI Realtime API</p>
              </div>
              {!openaiUsage?.available && (
                <Badge variant="warning">Schatting</Badge>
              )}
            </div>
            <DashboardChart data={chartData} />
          </div>

          {/* Quick stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white">Systeem status</h2>

            <StatusRow
              label="GitHub verbinding"
              status={!agentsError}
              okText="Verbonden"
              failText="Niet geconfigureerd"
            />
            <StatusRow
              label="Coolify verbinding"
              status={coolify?.configured === true}
              okText="Verbonden"
              failText="Niet geconfigureerd"
            />
            <StatusRow
              label="OpenAI API"
              status={!!openaiUsage && !openaiUsage.error}
              okText="Actief"
              failText="Niet geconfigureerd"
            />
            <StatusRow
              label="LiveKit Telefonie"
              status={!!livekitStatus && !livekitStatus.error}
              okText="Verbonden"
              failText="Niet geconfigureerd"
            />
            <StatusRow
              label="Agents geladen"
              status={agentCount > 0}
              okText={`${agentCount} agents`}
              failText="Geen agents gevonden"
            />

            {coolify?.appStatus && (
              <div className="pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-1">App status (Coolify)</p>
                <Badge
                  variant={
                    coolify.appStatus.includes('running') ? 'success' :
                    coolify.appStatus.includes('stopped') ? 'destructive' :
                    'secondary'
                  }
                >
                  {coolify.appStatus}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Recent Agents Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Recente Agents</h2>
            <Link
              href="/dashboard/agents"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              Alle agents bekijken
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {agentsError ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              Configureer de omgevingsvariabelen in .env om dit te activeren.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Naam</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Branche</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Stem</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentAgents.map((agent: { name: string; businessName: string; businessType: string; voice: string }) => (
                  <tr key={agent.name} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <span className="font-medium text-white">{agent.businessName}</span>
                        <p className="text-xs text-gray-500 font-mono">{agent.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {agent.businessType || '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {agent.voice || 'coral'}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant="success">Actief</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/dashboard/agents/${agent.name}`}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Bewerk
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentAgents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Geen agents gevonden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusRow({
  label,
  status,
  okText,
  failText,
}: {
  label: string
  status: boolean
  okText: string
  failText: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`}
        />
        <span className={`text-xs ${status ? 'text-green-400' : 'text-red-400'}`}>
          {status ? okText : failText}
        </span>
      </div>
    </div>
  )
}

function generateFallbackChartData() {
  const data = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' })
    data.push({
      date: dateStr,
      cost: parseFloat((Math.random() * 0.5 + 0.1).toFixed(4)),
    })
  }
  return data
}
