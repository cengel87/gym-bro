import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Exercise } from '@/types/app.types'

interface ExerciseFilters {
  search?: string
  equipment?: string
  muscle?: string
  movementPattern?: string
}

export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: async (): Promise<Exercise[]> => {
      let query = supabase
        .from('exercises')
        .select('*')
        .order('name')

      if (filters.search && filters.search.trim().length > 0) {
        query = query.ilike('name', `%${filters.search.trim()}%`)
      }
      if (filters.equipment) {
        query = query.eq('equipment', filters.equipment)
      }
      if (filters.muscle) {
        query = query.contains('primary_muscles', [filters.muscle])
      }
      if (filters.movementPattern) {
        query = query.eq('movement_pattern', filters.movementPattern)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Exercise[]
    },
    staleTime: 10 * 60 * 1000, // exercises rarely change
  })
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async (): Promise<Exercise> => {
      if (!id) throw new Error('No exercise id')
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Exercise
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
