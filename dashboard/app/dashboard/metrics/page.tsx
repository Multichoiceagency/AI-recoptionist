import { Phone, TrendingUp, Info } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatsCard } from '@/components/stats-card'
import { PricingCalculator } from '@/components/pricing-calculator'
import { MetricsChart } from '@/components/metrics-chart'
import { REALTIME_PRICING } from '@/lib/utils'

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

function formatEur(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export default async function MetricsPage() {
  const usage = await getUsageData()

  const todayCost = usage?.todayCostEur ?? null
  const monthCost = usage?.monthCostEur ?? null
  const chartData = usage?.dailyData || generateEstimatedData()
  const notConfigured = !usage || usage.error || !usage.available

  const avgCallCostEur =
    3 * 0.4 * REALTIME_PRICING.audioInputPerMin * REALTIME_PRICING.usdToEur +
    3 * 0.6 * REALTIME_PRICING.audioOutputPerMin * REALTIME_PRICING.usdToEur

  const estimatedCallsToday =
    todayCost !== null ? Math.round(todayCost / avgCallCostEur) : null

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Metrics"
        description="Geschat gebruik en kosten van de AI receptionist"
      />

      <div className="p-6 space-y-6">
        {notConfigured && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-300">Schattingen worden getoond</p>
              <p className="text-xs text-blue-400/70 mt-1">
                {usage?.error || 'Configureer de omgevingsvariabelen in .env om echte data te zien.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Geschatte gesprekken vandaag"
            value={estimatedCallsToday !== null ? `~${estimatedCallsToday}` : '—'}
            description="Op basis van API kosten (gem. 3 min/gesprek)"
            icon={Phone}
          />
          <StatsCard
            title="Kosten vandaag"
            value={todayCost !== null ? formatEur(todayCost) : notConfigured ? 'Niet geconfigureerd' : '€0,00'}
            description="OpenAI Realtime API"
            icon={TrendingUp}
          />
          <StatsCard
            title="Kosten deze periode"
            value={monthCost !== null ? formatEur(monthCost) : notConfigured ? 'Niet geconfigureerd' : '€0,00'}
            description="Laatste 7 dagen gemeten"
            icon={TrendingUp}
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-3">OpenAI Realtime API tarieven</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PricingRow
              label="Audio input"
              value="$40 / 1M tokens"
              sub={`€${(REALTIME_PRICING.audioInputPerMin * REALTIME_PRICING.usdToEur).toFixed(3)}/min`}
            />
            <PricingRow
              label="Audio output"
              value="$80 / 1M tokens"
              sub={`€${(REALTIME_PRICING.audioOutputPerMin * REALTIME_PRICING.usdToEur).toFixed(3)}/min`}
            />
            <PricingRow
              label="Tokens per seconde"
              value="~60 tokens/sec"
              sub="Spraak audio"
            />
            <PricingRow
              label="USD → EUR koers"
              value="1 USD = €0.93"
              sub="Schatting"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Dagelijkse kosten</h3>
              <p className="text-xs text-gray-500 mt-1">
                {notConfigured ? 'Geschatte data' : 'Werkelijke OpenAI API kosten (laatste 7 dagen)'}
              </p>
            </div>
          </div>
          <MetricsChart data={chartData} />
        </div>

        <PricingCalculator />
      </div>
    </div>
  )
}

function PricingRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}

function generateEstimatedData() {
  const data = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' })
    data.push({
      date: dateStr,
      cost: parseFloat((Math.random() * 0.8 + 0.2).toFixed(4)),
    })
  }
  return data
}
