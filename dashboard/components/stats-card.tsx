import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: { value: number; positive: boolean }
  loading?: boolean
  className?: string
  iconClassName?: string
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-400">{title}</span>
          {loading ? (
            <div className="h-8 w-24 bg-gray-800 animate-pulse rounded-md mt-1" />
          ) : (
            <span className="text-2xl font-bold text-white leading-none">{value}</span>
          )}
        </div>
        <div
          className={cn(
            'p-2.5 rounded-lg bg-blue-500/10',
            iconClassName
          )}
        >
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                trend.positive ? 'text-green-400' : 'text-red-400'
              )}
            >
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}

export { StatsCard }
export type { StatsCardProps }
