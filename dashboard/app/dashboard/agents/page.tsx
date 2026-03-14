import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { AgentsTable, type AgentRow } from '@/components/agents-table'

async function getAgentsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const [agentsRes, statusRes] = await Promise.all([
      fetch(`${baseUrl}/api/agents`, { next: { revalidate: 120 } }),
      fetch(`${baseUrl}/api/coolify/status`, { next: { revalidate: 60 } }),
    ])

    const agents: AgentRow[] = agentsRes.ok ? await agentsRes.json() : []
    const status = statusRes.ok ? await statusRes.json() : null

    return {
      agents,
      currentDefault: status?.defaultConfig || null,
      error: agentsRes.ok ? null : 'Kon agents niet ophalen. Controleer uw GITHUB_TOKEN.',
    }
  } catch {
    return { agents: [], currentDefault: null, error: 'Netwerkfout bij het ophalen van agents.' }
  }
}

export default async function AgentsPage() {
  const { agents, currentDefault, error } = await getAgentsData()

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Agents"
        description={`${agents.length} agent configuraties beheren`}
        actions={
          <Link href="/dashboard/agents/new">
            <Button>
              <Plus className="h-4 w-4" />
              Nieuw Agent
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        {error ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5 text-sm text-yellow-400">
            <strong>Let op:</strong> {error}
            <br />
            <span className="text-yellow-500/70 mt-1 block">
              Configureer de omgevingsvariabelen in .env om dit te activeren.
            </span>
          </div>
        ) : (
          <AgentsTable agents={agents} currentDefault={currentDefault ?? undefined} basePath="/dashboard" />
        )}
      </div>
    </div>
  )
}
