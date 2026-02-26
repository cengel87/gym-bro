import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Exercise } from '@/types/app.types'

const INCLINE_OPTIONS = [0, 15, 30, 45, 60, 75, 90] as const
const GRIP_OPTIONS = ['wide', 'narrow', 'overhand', 'underhand', 'neutral'] as const
const STANCE_OPTIONS = ['wide', 'narrow', 'sumo', 'conventional'] as const

interface VariantSelectorProps {
  exercise: Exercise
  variantKey: Record<string, unknown>
  onChange: (variantKey: Record<string, unknown>) => void
  onClose: () => void
}

export function VariantSelector({ exercise, variantKey, onChange, onClose }: VariantSelectorProps) {
  const [draft, setDraft] = useState<Record<string, unknown>>({ ...variantKey })

  function setField(key: string, value: unknown) {
    setDraft((prev) => {
      const next = { ...prev }
      if (value === null || value === undefined) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  return (
    <div className="mb-3 rounded-lg border border-border bg-muted/50 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Exercise Modifier</span>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {exercise.supports_incline && (
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Incline angle</label>
          <div className="flex flex-wrap gap-1.5">
            {INCLINE_OPTIONS.map((deg) => (
              <button
                key={deg}
                type="button"
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors',
                  draft.incline_deg === deg
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-accent'
                )}
                onClick={() => setField('incline_deg', draft.incline_deg === deg ? null : deg)}
              >
                {deg === 0 ? 'Flat' : `${deg}°`}
              </button>
            ))}
          </div>
        </div>
      )}

      {exercise.supports_grip && (
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Grip</label>
          <div className="flex flex-wrap gap-1.5">
            {GRIP_OPTIONS.map((grip) => (
              <button
                key={grip}
                type="button"
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-xs font-medium border capitalize transition-colors',
                  draft.grip === grip
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-accent'
                )}
                onClick={() => setField('grip', draft.grip === grip ? null : grip)}
              >
                {grip}
              </button>
            ))}
          </div>
        </div>
      )}

      {exercise.supports_stance && (
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Stance</label>
          <div className="flex flex-wrap gap-1.5">
            {STANCE_OPTIONS.map((stance) => (
              <button
                key={stance}
                type="button"
                className={cn(
                  'px-2.5 py-1.5 rounded-md text-xs font-medium border capitalize transition-colors',
                  draft.stance === stance
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:bg-accent'
                )}
                onClick={() => setField('stance', draft.stance === stance ? null : stance)}
              >
                {stance}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button size="sm" onClick={() => onChange(draft)} className="w-full gap-1">
        <Check className="h-4 w-4" />
        Apply
      </Button>
    </div>
  )
}
