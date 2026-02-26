import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Template, TemplateWithExercises } from '@/types/app.types'

export function useTemplates(userId: string | undefined) {
  return useQuery({
    queryKey: ['templates', userId],
    queryFn: async (): Promise<Template[]> => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order')
      if (error) throw error
      return (data ?? []) as Template[]
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async (): Promise<TemplateWithExercises> => {
      if (!id) throw new Error('No template id')
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *,
          template_exercises (
            *,
            exercise:exercises (*)
          )
        `)
        .eq('id', id)
        .order('sort_order', { referencedTable: 'template_exercises' })
        .single()
      if (error) throw error
      return data as unknown as TemplateWithExercises
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTemplate(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (template: { name: string; description?: string; program_id?: string }) => {
      if (!userId) throw new Error('No user')
      const { data, error } = await supabase
        .from('templates')
        .insert({ ...template, user_id: userId })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates', userId] }),
  })
}

export function useUpdateTemplate(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Template> }) => {
      const { data, error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates', userId] })
      queryClient.invalidateQueries({ queryKey: ['template', id] })
    },
  })
}

export function useDeleteTemplate(userId: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('templates').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates', userId] }),
  })
}

export function useAddTemplateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (exercise: {
      template_id: string
      exercise_id: string
      sort_order: number
      target_sets?: number
      min_reps?: number
      max_reps?: number
      rest_seconds?: number
      variant_key?: Record<string, unknown>
    }) => {
      const { data, error } = await supabase
        .from('template_exercises')
        .insert(exercise)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, { template_id }) => {
      queryClient.invalidateQueries({ queryKey: ['template', template_id] })
    },
  })
}

export function useUpdateTemplateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, templateId, updates }: {
      id: string
      templateId: string
      updates: { variant_key?: Record<string, unknown> }
    }) => {
      const { data, error } = await supabase
        .from('template_exercises')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_data, { templateId }) => {
      queryClient.invalidateQueries({ queryKey: ['template', templateId] })
    },
  })
}

export function useRemoveTemplateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, templateId }: { id: string; templateId: string }) => {
      const { error } = await supabase.from('template_exercises').delete().eq('id', id)
      if (error) throw error
      return templateId
    },
    onSuccess: (_data, { templateId }) => {
      queryClient.invalidateQueries({ queryKey: ['template', templateId] })
    },
  })
}
