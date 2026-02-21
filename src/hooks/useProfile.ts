import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { UserSettings } from '@/types/app.types'

const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id' | 'created_at' | 'updated_at'> = {
  unit_system: 'kg',
  theme: 'dark',
  aggressiveness: 2,
  default_rest_seconds: 120,
  plateau_threshold: 3,
  auto_deload_enabled: true,
  deload_scale_pct: 0.10,
  rest_timer_enabled: true,
}

export function useSettings(userId: string | undefined) {
  return useQuery({
    queryKey: ['settings', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error && error.code === 'PGRST116') {
        // Not found: create default settings
        const { data: created } = await supabase
          .from('user_settings')
          .insert({ user_id: userId, ...DEFAULT_SETTINGS })
          .select('*')
          .single()
        return created as UserSettings
      }
      if (error) throw error
      return data as UserSettings
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateSettings(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', userId] })
    },
  })
}
