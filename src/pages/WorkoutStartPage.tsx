import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTemplate } from '@/hooks/useTemplates'
import { useSettings } from '@/hooks/useProfile'
import { useActiveWorkout } from '@/store/activeWorkout'
import { recommend } from '@/engine/recommendation'
import { Skeleton } from '@/components/ui/skeleton'

export function WorkoutStartPage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const templateId = params.get('template')
  const navigate = useNavigate()
  const { data: template } = useTemplate(templateId ?? undefined)
  const { data: settings } = useSettings(user?.id)
  const startWorkout = useActiveWorkout((s) => s.startWorkout)

  useEffect(() => {
    if (!template || !settings) return

    // Build exercises with initial recommendations (no history for quick start)
    const exercises = template.template_exercises.map((te) => ({
      exercise: te.exercise,
      templateExerciseId: te.id,
      variantKey: (te.variant_key as Record<string, unknown>) ?? {},
      targetSets: te.target_sets,
      minReps: te.min_reps,
      maxReps: te.max_reps,
      suggestedSets: Array.from({ length: te.target_sets }, (_, i) => ({
        repsTarget: Math.round((te.min_reps + te.max_reps) / 2),
      })),
    }))

    startWorkout({
      templateId: template.id,
      name: template.name,
      exercises,
    })

    navigate('/workout/active', { replace: true })
  }, [template?.id, settings])

  if (!templateId) {
    // Ad-hoc workout
    useEffect(() => {
      startWorkout({
        name: 'Ad-hoc Workout',
        exercises: [],
      })
      navigate('/workout/active', { replace: true })
    }, [])
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-3 w-64">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}
