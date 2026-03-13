'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

interface CostDataPoint {
  date: string
  cost: number
  label?: string
}

interface CostChartProps {
  data: CostDataPoint[]
  type?: 'bar' | 'line'
  title?: string
  color?: string
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
          €{payload[0].value.toFixed(4)}
        </p>
      </div>
    )
  }
  return null
}

export function CostChart({ data, type = 'bar', color = '#3b82f6' }: CostChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        Geen data beschikbaar
      </div>
    )
  }

  const chartProps = {
    data,
    margin: { top: 5, right: 10, left: 10, bottom: 5 },
  }

  const commonAxisProps = {
    tick: { fill: '#6b7280', fontSize: 12 },
    axisLine: { stroke: '#374151' },
    tickLine: false,
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      {type === 'bar' ? (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="date" {...commonAxisProps} />
          <YAxis
            {...commonAxisProps}
            tickFormatter={(v) => `€${v.toFixed(3)}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="cost" fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      ) : (
        <LineChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="date" {...commonAxisProps} />
          <YAxis
            {...commonAxisProps}
            tickFormatter={(v) => `€${v.toFixed(3)}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="cost"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}
