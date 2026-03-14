import { PageHeader } from '@/components/page-header'
import { SettingsClient } from '@/components/settings-client'

async function getData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const [statusRes, agentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/coolify/status`, { next: { revalidate: 30 } }),
      fetch(`${baseUrl}/api/agents`, { next: { revalidate: 120 } }),
    ])

    const status = statusRes.ok ? await statusRes.json() : null
    const agents = agentsRes.ok ? await agentsRes.json() : []

    return { status, agents }
  } catch {
    return { status: null, agents: [] }
  }
}

export default async function SettingsPage() {
  const { status, agents } = await getData()

  const envVarsToShow = [
    { key: 'GITHUB_TOKEN', value: process.env.GITHUB_TOKEN },
    { key: 'GITHUB_REPO', value: process.env.GITHUB_REPO },
    { key: 'COOLIFY_API_TOKEN', value: process.env.COOLIFY_API_TOKEN },
    { key: 'COOLIFY_APP_UUID', value: process.env.COOLIFY_APP_UUID },
    { key: 'COOLIFY_URL', value: process.env.COOLIFY_URL },
    { key: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY },
    { key: 'LIVEKIT_URL', value: process.env.LIVEKIT_URL },
    { key: 'LIVEKIT_API_KEY', value: process.env.LIVEKIT_API_KEY },
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  ].map(({ key, value }) => ({
    key,
    configured: !!value,
    masked: value ? maskValue(value) : null,
  }))

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Instellingen"
        description="Systeem configuratie en Coolify deployment"
      />
      <div className="p-6">
        <SettingsClient
          coolifyStatus={status}
          agents={agents}
          envVars={envVarsToShow}
        />
      </div>
    </div>
  )
}

function maskValue(value: string): string {
  if (value.length <= 8) return '••••••••'
  return value.slice(0, 4) + '••••••••' + value.slice(-4)
}
