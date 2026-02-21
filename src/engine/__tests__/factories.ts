import type { ExerciseSession, RecommendationInput } from '@/types/recommendation.types'

export function makeSet(overrides: {
  repsCompleted?: number
  effectiveLoadKg?: number
  setType?: 'working' | 'warmup' | 'dropset' | 'amrap'
  rpe?: number | null
} = {}): ExerciseSession['sets'][number] {
  return {
    repsCompleted: overrides.repsCompleted ?? 8,
    effectiveLoadKg: overrides.effectiveLoadKg ?? 80,
    externalLoadKg: overrides.effectiveLoadKg ?? 80,
    bodyweightKg: null,
    addedLoadKg: null,
    setType: overrides.setType ?? 'working',
    rpe: overrides.rpe ?? null,
  }
}

export function makeSession(overrides: Partial<ExerciseSession> = {}): ExerciseSession {
  return {
    sessionId: 'session-' + Math.random().toString(36).slice(2),
    sessionDate: overrides.sessionDate ?? '2026-01-01',
    variantKey: overrides.variantKey ?? {},
    sets: overrides.sets ?? [
      makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }),
    ],
  }
}

export function makePlateauHistory(sessions = 4, load = 80, reps = 8): ExerciseSession[] {
  return Array.from({ length: sessions }, (_, i) =>
    makeSession({
      sessionDate: new Date(Date.now() - i * 7 * 86400000).toISOString().slice(0, 10),
      sets: [
        makeSet({ repsCompleted: reps, effectiveLoadKg: load }),
        makeSet({ repsCompleted: reps, effectiveLoadKg: load }),
        makeSet({ repsCompleted: reps, effectiveLoadKg: load }),
      ],
    })
  )
}

export function makeMissHistory(sessions = 3, load = 80, minReps = 8): ExerciseSession[] {
  return Array.from({ length: sessions }, (_, i) =>
    makeSession({
      sessionDate: new Date(Date.now() - i * 7 * 86400000).toISOString().slice(0, 10),
      sets: [
        makeSet({ repsCompleted: minReps - 2, effectiveLoadKg: load }),
        makeSet({ repsCompleted: minReps - 2, effectiveLoadKg: load }),
        makeSet({ repsCompleted: minReps - 1, effectiveLoadKg: load }),
      ],
    })
  )
}

export function makeInput(overrides: Partial<RecommendationInput> = {}): RecommendationInput {
  return {
    exercise: {
      id: 'ex-1',
      supportsBodyweight: false,
      equipment: 'barbell',
      movementPattern: 'squat',
      ...overrides.exercise,
    },
    templateExercise: {
      targetSets: 3,
      minReps: 6,
      maxReps: 10,
      variantKey: {},
      ...overrides.templateExercise,
    },
    history: overrides.history ?? [],
    currentBodyweightKg: overrides.currentBodyweightKg ?? null,
    preferences: {
      loadIncrementKg: null,
      minRepsOverride: null,
      maxRepsOverride: null,
      ...overrides.preferences,
    },
    userSettings: {
      aggressiveness: 2,
      plateauThreshold: 3,
      autoDeloadEnabled: true,
      deloadScalePct: 0.1,
      ...overrides.userSettings,
    },
  }
}
