import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const USD_TO_EUR = 0.93

// OpenAI Realtime API pricing (per token)
const PRICING = {
  'gpt-4o-realtime-preview': {
    input: 40 / 1_000_000,   // $40/1M tokens
    output: 80 / 1_000_000,  // $80/1M tokens
  },
  'gpt-4o': {
    input: 2.5 / 1_000_000,
    output: 10 / 1_000_000,
  },
  'gpt-4o-mini': {
    input: 0.15 / 1_000_000,
    output: 0.6 / 1_000_000,
  },
  default: {
    input: 5 / 1_000_000,
    output: 15 / 1_000_000,
  },
}

function getPricing(model: string) {
  for (const [key, price] of Object.entries(PRICING)) {
    if (key !== 'default' && model.includes(key)) return price
  }
  return PRICING.default
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function GET(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Configureer OPENAI_API_KEY in .env om dit te activeren.' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const dateParam = searchParams.get('date')

  const today = new Date()
  const targetDate = dateParam ? new Date(dateParam) : today
  const targetDateStr = formatDate(targetDate)

  // Build 30 days of dates for monthly view
  const last30Days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    last30Days.push(formatDate(d))
  }

  try {
    // Fetch today's usage
    const todayRes = await fetch(
      `https://api.openai.com/v1/usage?date=${targetDateStr}`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        next: { revalidate: 300 },
      }
    )

    if (!todayRes.ok) {
      if (todayRes.status === 404) {
        // Usage API might not be available on some plans
        return NextResponse.json({
          available: false,
          error: 'OpenAI usage API niet beschikbaar voor dit account. Controleer uw API plan.',
          todayCostEur: 0,
          monthCostEur: 0,
          dailyData: [],
          modelBreakdown: [],
        })
      }
      const msg = await todayRes.text()
      return NextResponse.json(
        { error: `OpenAI API fout: ${todayRes.status} — ${msg}` },
        { status: todayRes.status }
      )
    }

    const todayData = await todayRes.json()
    const todayItems: Array<{ snapshot_id: string; n_context_tokens_total: number; n_generated_tokens_total: number }> =
      todayData.data || []

    // Calculate today's cost per model
    const modelCosts: Record<string, { inputTokens: number; outputTokens: number; costUsd: number }> = {}

    for (const item of todayItems) {
      const model = item.snapshot_id || 'unknown'
      const pricing = getPricing(model)
      const inputCost = (item.n_context_tokens_total || 0) * pricing.input
      const outputCost = (item.n_generated_tokens_total || 0) * pricing.output

      if (!modelCosts[model]) {
        modelCosts[model] = { inputTokens: 0, outputTokens: 0, costUsd: 0 }
      }
      modelCosts[model].inputTokens += item.n_context_tokens_total || 0
      modelCosts[model].outputTokens += item.n_generated_tokens_total || 0
      modelCosts[model].costUsd += inputCost + outputCost
    }

    const todayCostUsd = Object.values(modelCosts).reduce((sum, m) => sum + m.costUsd, 0)
    const todayCostEur = todayCostUsd * USD_TO_EUR

    // Fetch monthly data (last 30 days) — batch with Promise.all but limit concurrency
    const monthlyFetches = last30Days.slice(-7) // Only last 7 for performance
    const dailyResults = await Promise.all(
      monthlyFetches.map(async (date) => {
        if (date === targetDateStr) {
          return { date, costEur: todayCostEur }
        }
        try {
          const r = await fetch(
            `https://api.openai.com/v1/usage?date=${date}`,
            {
              headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
              next: { revalidate: 3600 },
            }
          )
          if (!r.ok) return { date, costEur: 0 }
          const d = await r.json()
          const items: Array<{ snapshot_id: string; n_context_tokens_total: number; n_generated_tokens_total: number }> = d.data || []
          let costUsd = 0
          for (const item of items) {
            const p = getPricing(item.snapshot_id || '')
            costUsd += (item.n_context_tokens_total || 0) * p.input
            costUsd += (item.n_generated_tokens_total || 0) * p.output
          }
          return { date, costEur: costUsd * USD_TO_EUR }
        } catch {
          return { date, costEur: 0 }
        }
      })
    )

    const monthCostEur = dailyResults.reduce((s, d) => s + d.costEur, 0)

    const modelBreakdown = Object.entries(modelCosts).map(([model, data]) => ({
      model,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      costEur: data.costUsd * USD_TO_EUR,
    }))

    return NextResponse.json({
      available: true,
      date: targetDateStr,
      todayCostEur,
      monthCostEur,
      dailyData: dailyResults.map((d) => ({
        date: d.date,
        cost: parseFloat(d.costEur.toFixed(4)),
      })),
      modelBreakdown,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
