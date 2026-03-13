import { notFound } from 'next/navigation'
import { AgentEditor } from '@/components/agent-editor'

async function getAgent(name: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/agents/${name}`, { cache: 'no-store' })
    if (res.status === 404) return null
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Onbekende fout')
    }
    return await res.json()
  } catch (err) {
    throw err
  }
}

export default async function AgentDetailPage({
  params,
}: {
  params: { name: string }
}) {
  const { name } = params

  // Validate name format
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    notFound()
  }

  let agentData
  try {
    agentData = await getAgent(name)
  } catch (err) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-sm text-red-400">
          <strong>Fout:</strong> {err instanceof Error ? err.message : 'Onbekende fout'}
        </div>
      </div>
    )
  }

  if (!agentData) {
    notFound()
  }

  return <AgentEditor name={name} initialData={agentData} />
}
