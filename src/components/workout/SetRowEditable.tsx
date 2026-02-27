import { useState, useEffect, useRef } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ActiveSet } from '@/types/app.types'

interface SetRowEditableProps {
  set: ActiveSet
  setNumber: number
  isBodyweight: boolean
  bodyweightKg?: number | null
  unit: 'kg' | 'lbs'
  onUpdate: (updates: Partial<ActiveSet>) => void
  onComplete: () => void
  onRemove: () => void
}

function NumericInput({
  value,
  onChange,
  placeholder,
  prefix,
  className,
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder: string
  prefix?: string
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

  const input = (
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
        'h-11 w-full rounded-lg border border-input bg-background text-center text-sm font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        prefix ? 'pl-9 pr-2' : 'px-3',
        className
      )}
    />
  )

  if (!prefix) return input

  return (
    <div className={cn('relative', className)}>
      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs font-medium text-muted-foreground">
        {prefix}
      </span>
      {input}
    </div>
  )
}

export function SetRowEditable({
  set,
  setNumber,
  isBodyweight,
  bodyweightKg,
  unit,
  onUpdate,
  onComplete,
  onRemove,
}: SetRowEditableProps) {
  const [showRpe, setShowRpe] = useState(false)

  // Don't round lbsToKg — preserve the exact lbs value the user entered.
  // Only round kgToLbs for display (nearest 0.25 lbs avoids floating-point noise).
  const lbsToKg = (lbs: number) => lbs / 2.20462
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 4) / 4

  function handleLoadChange(kg: number | null) {
    if (isBodyweight) {
      // Always stamp bodyweightKg so effective_load_kg (BW + added) is stored correctly
      onUpdate({ addedLoadKg: kg, bodyweightKg: bodyweightKg ?? null })
    } else {
      onUpdate({ externalLoadKg: kg })
    }
  }

  function handleLoadChangeDisplay(display: number | null) {
    if (display === null) {
      // For bodyweight exercises, clearing the input resets to BW-only mode
      return handleLoadChange(null)
    }
    handleLoadChange(unit === 'lbs' ? lbsToKg(display) : display)
  }

  const loadKg = isBodyweight ? set.addedLoadKg : set.externalLoadKg
  const loadDisplay = loadKg === null ? null : (unit === 'lbs' ? kgToLbs(loadKg) : loadKg)
  const loadPlaceholder = isBodyweight ? `+wt (${unit})` : unit

  // Total effective weight for BW exercises (BW + added load)
  const effectiveKg =
    isBodyweight && bodyweightKg != null && set.addedLoadKg !== null
      ? bodyweightKg + set.addedLoadKg
      : null
  const effectiveDisplay = effectiveKg === null ? null : (unit === 'lbs' ? Math.round(kgToLbs(effectiveKg)) : effectiveKg)

  return (
    <div className="flex items-center gap-2 py-2">
      {/* Set number */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {setNumber}
      </div>

      {/* Load input */}
      {!isBodyweight ? (
        <NumericInput
          value={loadDisplay}
          onChange={handleLoadChangeDisplay}
          placeholder={loadPlaceholder}
          className="flex-1"
        />
      ) : set.addedLoadKg !== null ? (
        <div className="flex-1 flex flex-col gap-0.5">
          <NumericInput
            value={loadDisplay}
            onChange={handleLoadChangeDisplay}
            placeholder={`+wt`}
            prefix="BW+"
          />
          {effectiveDisplay !== null && (
            <span className="text-[10px] text-center text-muted-foreground">
              = {effectiveDisplay}{unit} total
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="flex-1 flex items-center justify-center h-11 rounded-lg bg-muted text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
          onClick={() => onUpdate({ addedLoadKg: 0, bodyweightKg: bodyweightKg ?? null })}
          title="Tap to add extra weight"
        >
          BW (tap to +wt)
        </button>
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

  let loadStr: string
  if (isBodyweight) {
    const effectiveKg = set.bodyweightKg != null && set.addedLoadKg !== null
      ? set.bodyweightKg + set.addedLoadKg
      : null
    const effectiveDisplay = effectiveKg === null ? null : (unit === 'lbs' ? Math.round(kgToLbs(effectiveKg)) : effectiveKg)
    if (loadDisplay !== null && effectiveDisplay !== null) {
      loadStr = `BW +${loadDisplay}${unit} (${effectiveDisplay}${unit})`
    } else if (loadDisplay !== null) {
      loadStr = `BW +${loadDisplay}${unit}`
    } else {
      loadStr = 'BW'
    }
  } else {
    loadStr = loadDisplay !== null ? `${loadDisplay}${unit}` : '—'
  }

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
