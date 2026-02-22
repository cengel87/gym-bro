import { useState, useEffect, useRef } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ActiveSet } from '@/types/app.types'

interface SetRowEditableProps {
  set: ActiveSet
  setNumber: number
  isBodyweight: boolean
  unit: 'kg' | 'lbs'
  onUpdate: (updates: Partial<ActiveSet>) => void
  onComplete: () => void
  onRemove: () => void
}

function NumericInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder: string
  className?: string
}) {
  // Keep a local string so the user can type freely (e.g. "185") without
  // React snapping the value mid-keystroke or resetting the cursor.
  // We only parse + propagate to the parent on blur.
  const [localValue, setLocalValue] = useState(value !== null ? String(value) : '')

  // When the external value changes (e.g. parent pre-fills a recommendation)
  // and the input is not focused, sync it in.
  const isFocused = useRef(false)
  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value !== null ? String(value) : '')
    }
  }, [value])

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localValue}
      placeholder={placeholder}
      onFocus={(e) => {
        isFocused.current = true
        e.target.select()
      }}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        isFocused.current = false
        const trimmed = localValue.trim()
        const parsed = trimmed === '' ? null : parseFloat(trimmed)
        const finalValue = parsed !== null && !isNaN(parsed) ? parsed : null
        onChange(finalValue)
        // Normalise display: show the parsed number or clear
        setLocalValue(finalValue !== null ? String(finalValue) : '')
      }}
      className={cn(
        'h-11 w-full rounded-lg border border-input bg-background px-3 text-center text-sm font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    />
  )
}

export function SetRowEditable({
  set,
  setNumber,
  isBodyweight,
  unit,
  onUpdate,
  onComplete,
  onRemove,
}: SetRowEditableProps) {
  const [showRpe, setShowRpe] = useState(false)

  const lbsToKg = (lbs: number) => Math.round((lbs / 2.20462) * 4) / 4
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 4) / 4

  function handleLoadChange(kg: number | null) {
    if (isBodyweight) {
      onUpdate({ addedLoadKg: kg })
    } else {
      onUpdate({ externalLoadKg: kg })
    }
  }

  function handleLoadChangeDisplay(display: number | null) {
    if (display === null) return handleLoadChange(null)
    handleLoadChange(unit === 'lbs' ? lbsToKg(display) : display)
  }

  const loadKg = isBodyweight ? set.addedLoadKg : set.externalLoadKg
  const loadDisplay = loadKg === null ? null : (unit === 'lbs' ? kgToLbs(loadKg) : loadKg)
  const loadPlaceholder = isBodyweight ? `+wt (${unit})` : unit

  return (
    <div className="flex items-center gap-2 py-2">
      {/* Set number */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {setNumber}
      </div>

      {/* Load input */}
      {!isBodyweight || set.addedLoadKg !== null ? (
        <NumericInput
          value={loadDisplay}
          onChange={handleLoadChangeDisplay}
          placeholder={loadPlaceholder}
          className="flex-1"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center h-11 rounded-lg bg-muted text-sm text-muted-foreground">
          BW
        </div>
      )}

      <span className="text-muted-foreground text-sm shrink-0">×</span>

      {/* Reps input */}
      <NumericInput
        value={set.repsCompleted ?? set.repsTarget}
        onChange={(v) => onUpdate({ repsCompleted: v })}
        placeholder={set.repsTarget ? `${set.repsTarget}` : 'reps'}
        className="flex-1"
      />

      {/* Complete button */}
      <Button
        size="icon"
        variant={set.isCompleted ? 'success' : 'outline'}
        onClick={onComplete}
        className="shrink-0"
      >
        <Check className="h-5 w-5" />
      </Button>

      {/* Remove */}
      <Button size="icon-sm" variant="ghost" onClick={onRemove} className="shrink-0 text-muted-foreground">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Completed set (read-only)
interface SetRowProps {
  set: ActiveSet
  unit: 'kg' | 'lbs'
  isBodyweight: boolean
}

export function SetRow({ set, unit, isBodyweight }: SetRowProps) {
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 4) / 4
  const loadKg = isBodyweight ? set.addedLoadKg : set.externalLoadKg
  const loadDisplay = loadKg === null ? null : (unit === 'lbs' ? kgToLbs(loadKg) : loadKg)
  const loadStr = isBodyweight
    ? loadDisplay !== null ? `BW +${loadDisplay}${unit}` : 'BW'
    : loadDisplay !== null ? `${loadDisplay}${unit}` : '—'

  return (
    <div className="flex items-center gap-3 py-1.5 opacity-60">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
        <Check className="h-3 w-3" />
      </div>
      <span className="text-sm font-medium">{loadStr}</span>
      <span className="text-muted-foreground text-sm">×</span>
      <span className="text-sm font-medium">{set.repsCompleted ?? '—'}</span>
      {set.rpe && <span className="text-xs text-muted-foreground ml-auto">RPE {set.rpe}</span>}
    </div>
  )
}
