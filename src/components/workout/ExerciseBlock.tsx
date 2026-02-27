import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, MoreVertical, Trash2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RecommendationBadge } from './RecommendationBadge'
import { SetRowEditable, SetRow } from './SetRowEditable'
import { VariantSelector } from './VariantSelector'
import type { ActiveWorkoutExercise, ActiveSet } from '@/types/app.types'
import type { RecommendationResult } from '@/types/recommendation.types'

interface ExerciseBlockProps {
  workoutExercise: ActiveWorkoutExercise
  recommendation: RecommendationResult | null
  unit: 'kg' | 'lbs'
  bodyweightKg?: number | null
  onAddSet: () => void
  onRemoveSet: (setNumber: number) => void
  onUpdateSet: (setNumber: number, updates: Partial<ActiveSet>) => void
  onCompleteSet: (setNumber: number) => void
  onRemoveExercise: () => void
  onVariantChange?: (variantKey: Record<string, unknown>) => void
}

function formatVariant(variantKey: Record<string, unknown>): string | null {
  const parts: string[] = []
  if (variantKey.incline_deg != null) parts.push(`${variantKey.incline_deg}°`)
  if (variantKey.grip) parts.push(String(variantKey.grip))
  if (variantKey.stance) parts.push(String(variantKey.stance))
  return parts.length > 0 ? parts.join(' · ') : null
}

export function ExerciseBlock({
  workoutExercise,
  recommendation,
  unit,
  bodyweightKg,
  onAddSet,
  onRemoveSet,
  onUpdateSet,
  onCompleteSet,
  onRemoveExercise,
  onVariantChange,
}: ExerciseBlockProps) {
  const [expanded, setExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [showVariant, setShowVariant] = useState(false)

  const exercise = workoutExercise.exercise
  const isBodyweight = exercise.supports_bodyweight && exercise.equipment === 'bodyweight'
  const completedCount = workoutExercise.sets.filter((s) => s.isCompleted).length
  const totalSets = workoutExercise.sets.length
  const hasModifiers = exercise.supports_incline || exercise.supports_grip || exercise.supports_stance

  const variantLabel = formatVariant(workoutExercise.variantKey)

  const kgToDisplay = (kg: number) => unit === 'lbs' ? Math.round(kg * 2.20462) : kg

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="flex-1 flex items-start gap-2 text-left tap-highlight-none"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{exercise.name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground capitalize">
                {exercise.equipment} · {completedCount}/{totalSets} sets
              </span>
              {isBodyweight && bodyweightKg && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <User className="h-3 w-3" />
                  {kgToDisplay(bodyweightKg)}{unit}
                </span>
              )}
              {variantLabel && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {variantLabel}
                </Badge>
              )}
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowMenu(!showMenu)}
            className="text-muted-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          {showMenu && (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-xl border bg-card shadow-xl">
              {hasModifiers && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-muted"
                  onClick={() => { setShowMenu(false); setShowVariant(true) }}
                >
                  Modifier
                </button>
              )}
              <button
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-muted"
                onClick={() => { setShowMenu(false); onRemoveExercise() }}
              >
                <Trash2 className="h-4 w-4" />
                Remove exercise
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-1">
          {/* Variant selector */}
          {showVariant && hasModifiers && (
            <VariantSelector
              exercise={exercise}
              variantKey={workoutExercise.variantKey}
              onChange={(vk) => {
                onVariantChange?.(vk)
                setShowVariant(false)
              }}
              onClose={() => setShowVariant(false)}
            />
          )}

          {/* Recommendation badge */}
          {recommendation && (
            <div className="mb-3">
              <RecommendationBadge recommendation={recommendation} unit={unit} />
              <p className="text-xs text-muted-foreground mt-1">{recommendation.reasoning}</p>
            </div>
          )}

          {/* Completed sets (read-only display) */}
          {workoutExercise.sets
            .filter((s) => s.isCompleted)
            .map((s) => (
              <SetRow key={s.id} set={s} unit={unit} isBodyweight={isBodyweight} />
            ))}

          {/* Active (incomplete) sets */}
          {workoutExercise.sets
            .filter((s) => !s.isCompleted)
            .map((s) => (
              <SetRowEditable
                key={s.id}
                set={s}
                setNumber={s.setNumber}
                isBodyweight={isBodyweight}
                bodyweightKg={isBodyweight ? bodyweightKg : null}
                unit={unit}
                onUpdate={(updates) => onUpdateSet(s.setNumber, updates)}
                onComplete={() => onCompleteSet(s.setNumber)}
                onRemove={() => onRemoveSet(s.setNumber)}
              />
            ))}

          <Button variant="ghost" size="sm" onClick={onAddSet} className="w-full mt-2 text-muted-foreground">
            <Plus className="h-4 w-4 mr-1" />
            Add set
          </Button>
        </div>
      )}
    </div>
  )
}
