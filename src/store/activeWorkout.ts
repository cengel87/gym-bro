import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActiveWorkoutState, ActiveWorkoutExercise, ActiveSet, Exercise } from '@/types/app.types'

interface ActiveWorkoutActions {
  startWorkout: (params: {
    templateId?: string
    name: string
    exercises: Array<{
      exercise: Exercise
      templateExerciseId?: string
      variantKey?: Record<string, unknown>
      suggestedSets?: Array<{ externalLoadKg?: number; addedLoadKg?: number; bodyweightKg?: number; repsTarget: number }>
      targetSets: number
      minReps: number
      maxReps: number
    }>
  }) => void
  finishWorkout: () => void
  cancelWorkout: () => void
  addExercise: (exercise: Exercise, variantKey?: Record<string, unknown>) => void
  removeExercise: (exerciseId: string) => void
  updateExerciseVariant: (exerciseId: string, variantKey: Record<string, unknown>) => void
  addSet: (exerciseId: string, set?: Partial<ActiveSet>) => void
  removeSet: (exerciseId: string, setNumber: number) => void
  updateSet: (exerciseId: string, setNumber: number, updates: Partial<ActiveSet>) => void
  completeSet: (exerciseId: string, setNumber: number) => void
  setIsFinishing: (value: boolean) => void
  setSessionId: (id: string) => void
}

type ActiveWorkoutStore = { workout: ActiveWorkoutState | null } & ActiveWorkoutActions

function makeDefaultSet(setNumber: number, suggestion?: {
  externalLoadKg?: number
  addedLoadKg?: number
  bodyweightKg?: number
  repsTarget?: number
}): ActiveSet {
  return {
    id: `set-${Date.now()}-${setNumber}`,
    setNumber,
    setType: 'working',
    externalLoadKg: suggestion?.externalLoadKg ?? null,
    bodyweightKg: suggestion?.bodyweightKg ?? null,
    addedLoadKg: suggestion?.addedLoadKg ?? null,
    repsTarget: suggestion?.repsTarget ?? null,
    repsCompleted: null,
    rpe: null,
    isCompleted: false,
    completedAt: null,
    restSecondsTaken: null,
    notes: null,
  }
}

export const useActiveWorkout = create<ActiveWorkoutStore>()(
  persist(
    (set, get) => ({
      workout: null,

      startWorkout: ({ templateId, name, exercises }) => {
        const workoutExercises: ActiveWorkoutExercise[] = exercises.map((ex, i) => ({
          id: `wex-${Date.now()}-${i}`,
          exerciseId: ex.exercise.id,
          exercise: ex.exercise,
          templateExerciseId: ex.templateExerciseId ?? null,
          sortOrder: i,
          variantKey: ex.variantKey ?? {},
          notes: null,
          sets: Array.from({ length: ex.targetSets }, (_, j) => ({
            ...makeDefaultSet(j + 1, ex.suggestedSets?.[j]),
            id: `set-${Date.now()}-${i}-${j}`,
          })),
        }))

        set({
          workout: {
            sessionId: null,
            templateId: templateId ?? null,
            name,
            startedAt: new Date().toISOString(),
            exercises: workoutExercises,
            isFinishing: false,
          },
        })
      },

      finishWorkout: () => set({ workout: null }),
      cancelWorkout: () => set({ workout: null }),
      setIsFinishing: (value) => {
        const { workout } = get()
        if (!workout) return
        set({ workout: { ...workout, isFinishing: value } })
      },
      setSessionId: (id) => {
        const { workout } = get()
        if (!workout) return
        set({ workout: { ...workout, sessionId: id } })
      },

      addExercise: (exercise, variantKey = {}) => {
        const { workout } = get()
        if (!workout) return
        const newEx: ActiveWorkoutExercise = {
          id: `wex-${Date.now()}`,
          exerciseId: exercise.id,
          exercise,
          templateExerciseId: null,
          sortOrder: workout.exercises.length,
          variantKey,
          notes: null,
          sets: [makeDefaultSet(1)],
        }
        set({ workout: { ...workout, exercises: [...workout.exercises, newEx] } })
      },

      removeExercise: (exerciseLocalId) => {
        const { workout } = get()
        if (!workout) return
        set({
          workout: {
            ...workout,
            exercises: workout.exercises.filter((e) => e.id !== exerciseLocalId),
          },
        })
      },

      updateExerciseVariant: (exerciseLocalId, variantKey) => {
        const { workout } = get()
        if (!workout) return
        const exercises = workout.exercises.map((ex) =>
          ex.id === exerciseLocalId ? { ...ex, variantKey } : ex
        )
        set({ workout: { ...workout, exercises } })
      },

      addSet: (exerciseLocalId, setOverrides = {}) => {
        const { workout } = get()
        if (!workout) return
        const exercises = workout.exercises.map((ex) => {
          if (ex.id !== exerciseLocalId) return ex
          const lastSet = ex.sets.at(-1)
          const newSet: ActiveSet = {
            ...makeDefaultSet(ex.sets.length + 1),
            // Autofill from last set
            externalLoadKg: lastSet?.externalLoadKg ?? null,
            addedLoadKg: lastSet?.addedLoadKg ?? null,
            bodyweightKg: lastSet?.bodyweightKg ?? null,
            repsTarget: lastSet?.repsTarget ?? null,
            ...setOverrides,
          }
          return { ...ex, sets: [...ex.sets, newSet] }
        })
        set({ workout: { ...workout, exercises } })
      },

      removeSet: (exerciseLocalId, setNumber) => {
        const { workout } = get()
        if (!workout) return
        const exercises = workout.exercises.map((ex) => {
          if (ex.id !== exerciseLocalId) return ex
          const sets = ex.sets
            .filter((s) => s.setNumber !== setNumber)
            .map((s, i) => ({ ...s, setNumber: i + 1 }))
          return { ...ex, sets }
        })
        set({ workout: { ...workout, exercises } })
      },

      updateSet: (exerciseLocalId, setNumber, updates) => {
        const { workout } = get()
        if (!workout) return
        const exercises = workout.exercises.map((ex) => {
          if (ex.id !== exerciseLocalId) return ex
          const sets = ex.sets.map((s) => (s.setNumber === setNumber ? { ...s, ...updates } : s))
          return { ...ex, sets }
        })
        set({ workout: { ...workout, exercises } })
      },

      completeSet: (exerciseLocalId, setNumber) => {
        const { workout } = get()
        if (!workout) return
        const exercises = workout.exercises.map((ex) => {
          if (ex.id !== exerciseLocalId) return ex
          const sets = ex.sets.map((s) =>
            s.setNumber === setNumber
              ? { ...s, isCompleted: true, completedAt: new Date().toISOString() }
              : s
          )
          return { ...ex, sets }
        })
        set({ workout: { ...workout, exercises } })
      },
    }),
    {
      name: 'gymbro-active-workout',
      // Only persist the workout object — actions are not serializable
      partialize: (state) => ({ workout: state.workout }),
    }
  )
)
