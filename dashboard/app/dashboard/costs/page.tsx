import { Info, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { CostBreakdown } from '@/components/cost-breakdown'

async function getUsageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/openai/usage`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function CostsPage() {
  const usage = await getUsageData()
  const notConfigured = !usage || usage.error || !usage.available

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Kosten"
        description="OpenAI API gebruik en kostenanalyse"
      />

      <div className="p-6 space-y-6">
        {notConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-300">OpenAI API niet geconfigureerd</p>
              <p className="text-xs text-yellow-400/70 mt-1">
                {usage?.error || 'Configureer de omgevingsvariabelen in .env om dit te activeren.'}
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex gap-3">
          <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-400/80">
            Kosten zijn gebaseerd op OpenAI Realtime API tarieven:
            audio input $40/1M tokens (~€0.134/min), audio output $80/1M tokens (~€0.268/min).
            Prijzen zijn indicatief en kunnen afwijken. Raadpleeg uw OpenAI factuur voor exacte bedragen.
          </p>
        </div>

        <CostBreakdown usage={usage} notConfigured={notConfigured} />
      </div>
    </div>
  )
}
