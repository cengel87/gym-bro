import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { WorkoutSession, SessionWithExercises } from '@/types/app.types'

export function useSessions(userId: string | undefined, limit = 20) {
  return useQuery({
    queryKey: ['sessions', userId, limit],
    queryFn: async (): Promise<WorkoutSession[]> => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('finished_at', 'is', null)
        .order('started_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data ?? []) as WorkoutSession[]
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  })
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async (): Promise<SessionWithExercises> => {
      if (!id) throw new Error('No session id')
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (*),
            sets (*)
          )
        `)
        .eq('id', id)
        .order('sort_order', { referencedTable: 'workout_exercises' })
        .order('set_number', { referencedTable: 'workout_exercises.sets' })
        .single()
      if (error) throw error
      return data as unknown as SessionWithExercises
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch the last N completed sessions for a specific exercise.
 * Used by the recommendation engine.
 */
export function useExerciseHistory(
  userId: string | undefined,
  exerciseId: string | undefined,
  limit = 10
) {
  return useQuery({
    queryKey: ['exercise-history', userId, exerciseId, limit],
    queryFn: async () => {
      if (!userId || !exerciseId) throw new Error('Missing params')
      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          id,
          variant_key,
          session:workout_sessions!inner (
            id,
            started_at,
            user_id
          ),
          sets (
            set_type,
            reps_completed,
            effective_load_kg,
            external_load_kg,
            bodyweight_kg,
            added_load_kg,
            rpe,
            is_completed
          )
        `)
        .eq('exercise_id', exerciseId)
        .eq('workout_sessions.user_id', userId)
        .not('workout_sessions.finished_at', 'is', null)
        .order('started_at', { referencedTable: 'workout_sessions', ascending: false })
        .limit(limit)
      if (error) throw error
      return data ?? []
    },
    enabled: !!userId && !!exerciseId,
    staleTime: 30 * 1000,
  })
}
