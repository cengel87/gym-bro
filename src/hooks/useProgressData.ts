import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useExercise1RM(userId: string | undefined, exerciseId: string | undefined) {
  return useQuery({
    queryKey: ['1rm', userId, exerciseId],
    queryFn: async () => {
      if (!userId || !exerciseId) throw new Error('Missing params')
      const { data, error } = await supabase
        .from('exercise_1rm_estimates')
        .select('session_date, estimated_1rm_kg')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .order('session_date', { ascending: true })
        .limit(52) // ~1 year of weekly data
      if (error) throw error
      return data ?? []
    },
    enabled: !!userId && !!exerciseId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useWeeklyVolume(userId: string | undefined, exerciseId?: string) {
  return useQuery({
    queryKey: ['weekly-volume', userId, exerciseId],
    queryFn: async () => {
      if (!userId) throw new Error('No user')
      let query = supabase
        .from('v_weekly_volume')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true })
        .limit(52)
      if (exerciseId) {
        query = query.eq('exercise_id', exerciseId)
      }
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useWorkoutConsistency(userId: string | undefined) {
  return useQuery({
    queryKey: ['consistency', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user')
      // Get last 90 days of session dates
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('started_at')
        .eq('user_id', userId)
        .not('finished_at', 'is', null)
        .gte('started_at', ninetyDaysAgo.toISOString())
        .order('started_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((s) => s.started_at)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
