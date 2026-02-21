import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { BodyweightEntry } from '@/types/app.types'

export function useBodyweightHistory(userId: string | undefined, limit = 90) {
  return useQuery({
    queryKey: ['bodyweight', userId, limit],
    queryFn: async (): Promise<BodyweightEntry[]> => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('bodyweight_entries')
        .select('*')
        .eq('user_id', userId)
        .order('measured_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data ?? []) as BodyweightEntry[]
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useLatestBodyweight(userId: string | undefined) {
  const { data } = useBodyweightHistory(userId, 1)
  return data?.[0]?.weight_kg ?? null
}

export function useLogBodyweight(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ weightKg, measuredAt }: { weightKg: number; measuredAt?: string }) => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('bodyweight_entries')
        .upsert({
          user_id: userId,
          weight_kg: weightKg,
          measured_at: measuredAt ?? new Date().toISOString().slice(0, 10),
        }, { onConflict: 'user_id,measured_at' })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bodyweight', userId] }),
  })
}
