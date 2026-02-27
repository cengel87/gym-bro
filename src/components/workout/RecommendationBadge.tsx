import { Zap, TrendingUp, Minus, TrendingDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecommendationResult } from '@/types/recommendation.types'
import type { UserSettings } from '@/types/app.types'

interface RecommendationBadgeProps {
  recommendation: RecommendationResult | null
  unit: 'kg' | 'lbs'
  className?: string
}

const stateConfig = {
  increase: { icon: TrendingUp, label: 'Level up', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  maintain: { icon: Minus, label: 'Keep going', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  decrease: { icon: TrendingDown, label: 'Back off', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  deload: { icon: AlertCircle, label: 'Deload', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  plateau_break: { icon: Zap, label: 'Shake it up', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  first_session: { icon: Zap, label: 'First time', color: 'text-muted-foreground bg-muted border-border' },
}

function formatLoad(rec: RecommendationResult, unit: 'kg' | 'lbs') {
  const set = rec.sets[0]
  if (!set) return ''

  if (set.addedLoadKg !== undefined && set.bodyweightKg !== undefined) {
    const bw = unit === 'lbs' ? Math.round(set.bodyweightKg * 2.20462) : set.bodyweightKg
    const add = unit === 'lbs' ? Math.round(set.addedLoadKg * 2.20462) : set.addedLoadKg
    const total = unit === 'lbs' ? Math.round((set.bodyweightKg + set.addedLoadKg) * 2.20462) : set.bodyweightKg + set.addedLoadKg
    if (add === 0) return `BW (${bw}${unit})`
    return `BW +${add}${unit} (${total}${unit})`
  }

  if (set.externalLoadKg !== undefined) {
    const load = unit === 'lbs' ? Math.round(set.externalLoadKg * 2.20462) : set.externalLoadKg
    return `${load}${unit}`
  }

  return `BW`
}

export function RecommendationBadge({ recommendation, unit, className }: RecommendationBadgeProps) {
  if (!recommendation) return null

  const config = stateConfig[recommendation.progressionState]
  const Icon = config.icon
  const loadStr = formatLoad(recommendation, unit)
  const repsStr = `${recommendation.suggestedReps} reps`

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium', config.color)}>
        <Icon className="h-3 w-3" />
        <span>Suggested: {[loadStr, repsStr].filter(Boolean).join(' × ')}</span>
      </div>
    </div>
  )
}

interface LastSetSummaryProps {
  sets: Array<{ repsCompleted: number | null; effectiveLoadKg: number | null }>
  unit: 'kg' | 'lbs'
}

export function LastSetSummary({ sets, unit }: LastSetSummaryProps) {
  const workingSets = sets.filter(s => s.repsCompleted !== null)
  if (workingSets.length === 0) return null

  const loads = workingSets.map(s => {
    const load = s.effectiveLoadKg ?? 0
    return unit === 'lbs' ? Math.round(load * 2.20462) : load
  })
  const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length
  const reps = workingSets.map(s => s.repsCompleted!)
  const repStr = reps.every(r => r === reps[0]) ? `${reps[0]}` : `${Math.min(...reps)}–${Math.max(...reps)}`

  return (
    <span className="text-xs text-muted-foreground">
      Last: {avgLoad}{unit} × {repStr}
    </span>
  )
}
