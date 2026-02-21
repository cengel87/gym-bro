import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, Check, Plus, Timer } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useProfile'
import { useActiveWorkout } from '@/store/activeWorkout'
import { useExerciseHistory } from '@/hooks/useSessions'
import { useRecommendation } from '@/hooks/useRecommendation'
import { ExerciseBlock } from '@/components/workout/ExerciseBlock'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useExercises } from '@/hooks/useExercises'
import { formatTimer } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import type { ActiveSet, Exercise } from '@/types/app.types'
import { queryClient } from '@/lib/queryClient'

export function ActiveWorkoutPage() {
  const { user } = useAuth()
  const { data: settings } = useSettings(user?.id)
  const workout = useActiveWorkout((s) => s.workout)
  const actions = useActiveWorkout((s) => ({
    addSet: s.addSet,
    removeSet: s.removeSet,
    updateSet: s.updateSet,
    completeSet: s.completeSet,
    removeExercise: s.removeExercise,
    addExercise: s.addExercise,
    finishWorkout: s.finishWorkout,
    cancelWorkout: s.cancelWorkout,
  }))
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [addExerciseOpen, setAddExerciseOpen] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const unit = (settings?.unit_system ?? 'kg') as 'kg' | 'lbs'

  // Timer
  useEffect(() => {
    if (!workout) return
    const startMs = new Date(workout.startedAt).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [workout?.startedAt])

  // Redirect if no active workout
  if (!workout) {
    navigate('/')
    return null
  }

  async function handleFinish() {
    if (!user || !workout) return
    setFinishing(true)

    try {
      // 1. Create session record
      const { data: session, error: sessionErr } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          template_id: workout.templateId,
          name: workout.name,
          started_at: workout.startedAt,
          finished_at: new Date().toISOString(),
        })
        .select('id')
        .single()
      if (sessionErr) throw sessionErr

      // 2. For each exercise, create workout_exercise and sets
      for (const ex of workout.exercises) {
        const { data: we, error: weErr } = await supabase
          .from('workout_exercises')
          .insert({
            session_id: session.id,
            exercise_id: ex.exerciseId,
            template_exercise_id: ex.templateExerciseId,
            sort_order: ex.sortOrder,
            variant_key: ex.variantKey,
            notes: ex.notes,
          })
          .select('id')
          .single()
        if (weErr) throw weErr

        const setsToInsert = ex.sets
          .filter((s) => s.isCompleted || s.repsCompleted !== null)
          .map((s) => ({
            workout_exercise_id: we.id,
            set_number: s.setNumber,
            set_type: s.setType,
            external_load_kg: s.externalLoadKg,
            bodyweight_kg: s.bodyweightKg,
            added_load_kg: s.addedLoadKg,
            reps_target: s.repsTarget,
            reps_completed: s.repsCompleted,
            rpe: s.rpe,
            is_completed: s.isCompleted,
            completed_at: s.completedAt,
            rest_seconds_taken: s.restSecondsTaken,
          }))

        if (setsToInsert.length > 0) {
          const { error: setsErr } = await supabase.from('sets').insert(setsToInsert)
          if (setsErr) throw setsErr
        }
      }

      // 3. Invalidate session queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['exercise-history'] })

      // 4. Clear active workout store
      actions.finishWorkout()

      toast({ title: 'Workout saved!', variant: 'success' })
      navigate('/')
    } catch (err) {
      console.error('Failed to save workout:', err)
      toast({ title: 'Failed to save workout', variant: 'destructive' })
    } finally {
      setFinishing(false)
    }
  }

  function handleCancel() {
    if (confirm('Cancel workout? All progress will be lost.')) {
      actions.cancelWorkout()
      navigate('/')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/95 backdrop-blur-lg px-4 py-3">
        <button onClick={handleCancel} className="text-muted-foreground tap-highlight-none">
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{workout.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {formatTimer(elapsed)}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleFinish}
          disabled={finishing}
          className="gap-1"
        >
          <Check className="h-4 w-4" />
          {finishing ? 'Saving…' : 'Finish'}
        </Button>
      </header>

      {/* Exercise list */}
      <div className="flex-1 px-4 py-4 space-y-3 pb-32">
        {workout.exercises.map((ex) => (
          <ExerciseBlockWithData
            key={ex.id}
            workoutExercise={ex}
            userId={user?.id}
            settings={settings}
            unit={unit}
            actions={actions}
          />
        ))}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setAddExerciseOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add exercise
        </Button>
      </div>

      {/* Add exercise sheet */}
      <AddExerciseSheet
        open={addExerciseOpen}
        onClose={() => setAddExerciseOpen(false)}
        onSelect={(exercise) => {
          actions.addExercise(exercise)
          setAddExerciseOpen(false)
        }}
      />
    </div>
  )
}

interface WorkoutActions {
  addSet: (exerciseId: string, set?: Partial<ActiveSet>) => void
  removeSet: (exerciseId: string, setNumber: number) => void
  updateSet: (exerciseId: string, setNumber: number, updates: Partial<ActiveSet>) => void
  completeSet: (exerciseId: string, setNumber: number) => void
  removeExercise: (exerciseId: string) => void
  addExercise: (exercise: Exercise, variantKey?: Record<string, unknown>) => void
  finishWorkout: () => void
  cancelWorkout: () => void
}

// Inner component that fetches history+recommendation per exercise
function ExerciseBlockWithData({
  workoutExercise,
  userId,
  settings,
  unit,
  actions,
}: {
  workoutExercise: any
  userId: string | undefined
  settings: any
  unit: 'kg' | 'lbs'
  actions: WorkoutActions
}) {
  const { data: history } = useExerciseHistory(userId, workoutExercise.exerciseId)

  // Build a mock templateExercise from the active exercise config
  const templateExercise = {
    id: '',
    template_id: '',
    exercise_id: workoutExercise.exerciseId,
    sort_order: 0,
    target_sets: workoutExercise.sets.length,
    min_reps: 6,
    max_reps: 12,
    rest_seconds: 120,
    variant_key: workoutExercise.variantKey,
    notes: null,
    created_at: '',
  }

  const recommendation = useRecommendation({
    exercise: workoutExercise.exercise,
    templateExercise,
    history,
    currentBodyweightKg: null,
    settings,
    preference: undefined,
  })

  return (
    <ExerciseBlock
      workoutExercise={workoutExercise}
      recommendation={recommendation}
      unit={unit}
      onAddSet={() => actions.addSet(workoutExercise.id)}
      onRemoveSet={(n) => actions.removeSet(workoutExercise.id, n)}
      onUpdateSet={(n, u) => actions.updateSet(workoutExercise.id, n, u)}
      onCompleteSet={(n) => actions.completeSet(workoutExercise.id, n)}
      onRemoveExercise={() => actions.removeExercise(workoutExercise.id)}
    />
  )
}

function AddExerciseSheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (ex: Exercise) => void
}) {
  const [search, setSearch] = useState('')
  const { data: exercises } = useExercises({ search })

  const [search2, setSearch2] = useState('')

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4 space-y-3">
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="max-h-[60vh] overflow-y-auto space-y-1">
            {(exercises ?? []).slice(0, 30).map((ex) => (
              <button
                key={ex.id}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent text-left tap-highlight-none"
                onClick={() => onSelect(ex)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ex.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {ex.equipment} · {ex.primary_muscles.join(', ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Needed for the search input inside AddExerciseSheet
function useState2<T>(initial: T): [T, (v: T) => void] {
  return useState(initial)
}
