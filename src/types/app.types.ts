import type { Database } from './database.types'

export type Exercise = Database['public']['Tables']['exercises']['Row']
export type Program = Database['public']['Tables']['programs']['Row']
export type Template = Database['public']['Tables']['templates']['Row']
export type TemplateExercise = Database['public']['Tables']['template_exercises']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type Set = Database['public']['Tables']['sets']['Row']
export type BodyweightEntry = Database['public']['Tables']['bodyweight_entries']['Row']
export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserExercisePreference = Database['public']['Tables']['user_exercise_preferences']['Row']

// Rich types with joins
export interface TemplateWithExercises extends Template {
  template_exercises: (TemplateExercise & { exercise: Exercise })[]
}

export interface SessionWithExercises extends WorkoutSession {
  workout_exercises: (WorkoutExercise & {
    exercise: Exercise
    sets: Set[]
  })[]
}

// Active workout types (Zustand store)
export interface ActiveSet {
  id: string // local temp ID
  setNumber: number
  setType: 'working' | 'warmup' | 'dropset' | 'amrap'
  externalLoadKg: number | null
  bodyweightKg: number | null
  addedLoadKg: number | null
  repsTarget: number | null
  repsCompleted: number | null
  rpe: number | null
  isCompleted: boolean
  completedAt: string | null
  restSecondsTaken: number | null
  notes: string | null
}

export interface ActiveWorkoutExercise {
  id: string // local temp ID
  exerciseId: string
  exercise: Exercise
  templateExerciseId: string | null
  sortOrder: number
  variantKey: Record<string, unknown>
  sets: ActiveSet[]
  notes: string | null
}

export interface ActiveWorkoutState {
  sessionId: string | null // null = not yet persisted
  templateId: string | null
  name: string
  startedAt: string
  exercises: ActiveWorkoutExercise[]
  isFinishing: boolean
}
