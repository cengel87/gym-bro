import { useMemo } from 'react'
import { recommend } from '@/engine/recommendation'
import type { RecommendationInput, RecommendationResult } from '@/types/recommendation.types'
import type { Exercise, TemplateExercise, UserSettings, UserExercisePreference } from '@/types/app.types'

interface UseRecommendationProps {
  exercise: Exercise | undefined
  templateExercise: TemplateExercise | undefined
  history: ReturnType<typeof import('./useSessions').useExerciseHistory>['data']
  currentBodyweightKg: number | null
  settings: UserSettings | undefined
  preference: UserExercisePreference | undefined
}

export function useRecommendation({
  exercise,
  templateExercise,
  history,
  currentBodyweightKg,
  settings,
  preference,
}: UseRecommendationProps): RecommendationResult | null {
  return useMemo(() => {
    if (!exercise || !templateExercise || !settings) return null

    const input: RecommendationInput = {
      exercise: {
        id: exercise.id,
        supportsBodyweight: exercise.supports_bodyweight,
        equipment: exercise.equipment,
        movementPattern: exercise.movement_pattern,
      },
      templateExercise: {
        targetSets: templateExercise.target_sets,
        minReps: templateExercise.min_reps,
        maxReps: templateExercise.max_reps,
        variantKey: (templateExercise.variant_key as Record<string, unknown>) ?? {},
      },
      history: (history ?? []).map((we) => ({
        sessionId: (we.session as unknown as { id: string }).id,
        sessionDate: (we.session as unknown as { started_at: string }).started_at,
        variantKey: (we.variant_key as Record<string, unknown>) ?? {},
        sets: (we.sets ?? [])
          .filter((s) => s.is_completed && s.reps_completed !== null)
          .map((s) => ({
            repsCompleted: s.reps_completed!,
            effectiveLoadKg: s.effective_load_kg ?? 0,
            externalLoadKg: s.external_load_kg,
            bodyweightKg: s.bodyweight_kg,
            addedLoadKg: s.added_load_kg,
            setType: s.set_type as 'working' | 'warmup' | 'dropset' | 'amrap',
            rpe: s.rpe,
          })),
      })),
      currentBodyweightKg,
      preferences: {
        loadIncrementKg: preference?.load_increment_kg ?? null,
        minRepsOverride: preference?.min_reps_override ?? null,
        maxRepsOverride: preference?.max_reps_override ?? null,
      },
      userSettings: {
        aggressiveness: (settings.aggressiveness as 1 | 2 | 3) ?? 2,
        plateauThreshold: settings.plateau_threshold ?? 3,
        autoDeloadEnabled: settings.auto_deload_enabled ?? true,
        deloadScalePct: Number(settings.deload_scale_pct) ?? 0.1,
      },
    }

    return recommend(input)
  }, [exercise, templateExercise, history, currentBodyweightKg, settings, preference])
}
