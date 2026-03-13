'use client'

import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ModelBreakdown {
  model: string
  inputTokens: number
  outputTokens: number
  costEur: number
}

interface DailyDataPoint {
  date: string
  cost: number
}

interface UsageData {
  available: boolean
  todayCostEur: number
  monthCostEur: number
  dailyData: DailyDataPoint[]
  modelBreakdown: ModelBreakdown[]
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

function TooltipContent({ active, payload }: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400">{payload[0].name}</p>
        <p className="text-sm font-semibold text-white">
          €{payload[0].value.toFixed(4)}
        </p>
      </div>
    )
  }
  return null
}

export function CostBreakdown({
  usage,
  notConfigured,
}: {
  usage: UsageData | null
  notConfigured: boolean
}) {
  const [budget, setBudget] = useState('')
  const [budgetSaved, setBudgetSaved] = useState(false)

  const fmtEur = (n: number) =>
    new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 4,
    }).format(n)

  const fmtNum = (n: number) =>
    new Intl.NumberFormat('nl-NL').format(n)

  const dailyData = usage?.dailyData || []
  const modelBreakdown = usage?.modelBreakdown || []
  const todayCostEur = usage?.todayCostEur ?? 0
  const monthCostEur = usage?.monthCostEur ?? 0

  const pieData = modelBreakdown.length > 0
    ? modelBreakdown.map((m) => ({
        name: m.model.length > 25 ? m.model.slice(0, 25) + '...' : m.model,
        value: parseFloat(m.costEur.toFixed(4)),
      }))
    : [{ name: 'Geen data', value: 1 }]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Kosten vandaag</p>
          <p className="text-3xl font-bold text-white">{fmtEur(todayCostEur)}</p>
          <p className="text-xs text-gray-500 mt-2">OpenAI Realtime API gebruik</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Kosten afgelopen periode</p>
          <p className="text-3xl font-bold text-white">{fmtEur(monthCostEur)}</p>
          <p className="text-xs text-gray-500 mt-2">Laatste 7 dagen gemeten</p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-5">Dagelijkse kostenopbouw</h3>
        {dailyData.length > 0 && !notConfigured ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `€${v.toFixed(3)}`}
                width={65}
              />
              <Tooltip content={<TooltipContent />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            Configureer OPENAI_API_KEY om echte data te zien
          </div>
        )}
      </div>

      {/* Model breakdown table + pie */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-white">Gebruik per model</h3>
          </div>
          {modelBreakdown.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase">Model</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase">Input tokens</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase">Output tokens</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase">Kosten</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {modelBreakdown.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-800/30">
                    <td className="px-5 py-3 text-xs font-mono text-gray-300 truncate max-w-[180px]">
                      {m.model}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs">
                      {fmtNum(m.inputTokens)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 text-xs">
                      {fmtNum(m.outputTokens)}
                    </td>
                    <td className="px-5 py-3 text-right text-white font-medium text-xs">
                      {fmtEur(m.costEur)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-800">
                <tr>
                  <td colSpan={3} className="px-5 py-3 text-xs font-medium text-gray-400">Totaal</td>
                  <td className="px-5 py-3 text-right text-white font-bold text-xs">
                    {fmtEur(modelBreakdown.reduce((s, m) => s + m.costEur, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
              Geen model data beschikbaar
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Kosten per model</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`€${value.toFixed(4)}`, 'Kosten']}
                contentStyle={{
                  background: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="mt-3 space-y-1.5">
            {pieData.slice(0, 4).map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-xs text-gray-400 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget alert */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-yellow-400" />
          <h3 className="font-semibold text-white">Budget waarschuwing</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Stel een maandelijks budget in. Als u dit budget overschrijdt, wordt u gewaarschuwd.
          (Opmerking: dit stelt geen hard limiet in bij OpenAI — gebruik hiervoor de OpenAI dashboard.)
        </p>
        <div className="flex gap-3 items-end">
          <div className="flex-1 max-w-xs">
            <Input
              label="Maandbudget (€)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="50.00"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
          <Button
            onClick={() => {
              if (budget) {
                setBudgetSaved(true)
                setTimeout(() => setBudgetSaved(false), 3000)
              }
            }}
            variant={budgetSaved ? 'success' : 'default'}
          >
            {budgetSaved ? 'Opgeslagen!' : 'Budget instellen'}
          </Button>
        </div>
        {budget && monthCostEur > parseFloat(budget) && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
            Maandbudget van €{parseFloat(budget).toFixed(2)} is overschreden!
            Huidig gebruik: {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(monthCostEur)}
          </div>
        )}
      </div>
    </div>
  )
}
