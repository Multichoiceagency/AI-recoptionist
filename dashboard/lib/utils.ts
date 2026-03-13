import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// OpenAI Realtime API pricing (per token)
// Audio input: $40/1M tokens  → $0.00004/token
// Audio output: $80/1M tokens → $0.00008/token
// Assuming ~60 tokens/sec for audio
export const REALTIME_PRICING = {
  audioInputPerToken: 0.00004,   // USD
  audioOutputPerToken: 0.00008,  // USD
  tokensPerSecond: 60,
  usdToEur: 0.93,
  // Derived:
  audioInputPerMin: 0.00004 * 60 * 60,   // $0.144/min
  audioOutputPerMin: 0.00008 * 60 * 60,  // $0.288/min
}

export function estimateCallCost(
  durationMinutes: number,
  inputRatio = 0.4,
  outputRatio = 0.6
): { usd: number; eur: number } {
  const inputCost = durationMinutes * inputRatio * REALTIME_PRICING.audioInputPerMin
  const outputCost = durationMinutes * outputRatio * REALTIME_PRICING.audioOutputPerMin
  const usd = inputCost + outputCost
  return { usd, eur: usd * REALTIME_PRICING.usdToEur }
}

export function getEnvWarning(varName: string): string | null {
  if (typeof process !== 'undefined' && !process.env[varName]) {
    return `Configureer ${varName} in .env om dit te activeren.`
  }
  return null
}
