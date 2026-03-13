'use client'

import { useState } from 'react'
import { REALTIME_PRICING, estimateCallCost } from '@/lib/utils'
import { Calculator } from 'lucide-react'

export function PricingCalculator() {
  const [callsPerDay, setCallsPerDay] = useState(10)
  const [avgDuration, setAvgDuration] = useState(3)

  const perCall = estimateCallCost(avgDuration)
  const daily = perCall.eur * callsPerDay
  const monthly = daily * 30
  const yearly = daily * 365

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(n)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Calculator className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="font-semibold text-white">Kostencalculator</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gesprekken per dag
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={200}
              value={callsPerDay}
              onChange={(e) => setCallsPerDay(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="w-12 text-right text-white font-semibold text-sm">{callsPerDay}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gemiddelde gespreksduur (min)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.5}
              value={avgDuration}
              onChange={(e) => setAvgDuration(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="w-12 text-right text-white font-semibold text-sm">{avgDuration}m</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Per dag</p>
          <p className="text-lg font-bold text-white">{fmt(daily)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Per maand</p>
          <p className="text-lg font-bold text-blue-400">{fmt(monthly)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Per jaar</p>
          <p className="text-lg font-bold text-white">{fmt(yearly)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Gebaseerd op OpenAI Realtime API tarieven: audio input €
          {(REALTIME_PRICING.audioInputPerMin * REALTIME_PRICING.usdToEur).toFixed(3)}/min,
          audio output €{(REALTIME_PRICING.audioOutputPerMin * REALTIME_PRICING.usdToEur).toFixed(3)}/min.
          Kosten per gesprek: {fmt(perCall.eur)} bij {avgDuration} minuten.
        </p>
      </div>
    </div>
  )
}
