export interface SetRecord {
  repsCompleted: number
  effectiveLoadKg: number
  externalLoadKg: number | null
  bodyweightKg: number | null
  addedLoadKg: number | null
  setType: 'working' | 'warmup' | 'dropset' | 'amrap'
  rpe: number | null
}

export interface ExerciseSession {
  sessionDate: string // ISO date string
  sessionId: string
  sets: SetRecord[]
  variantKey: Record<string, unknown>
}

export interface ExerciseMeta {
  id: string
  supportsBodyweight: boolean
  equipment: string
  movementPattern: string
}

export interface TemplateExerciseConfig {
  targetSets: number
  minReps: number
  maxReps: number
  variantKey: Record<string, unknown>
}

export interface UserSettings {
  aggressiveness: 1 | 2 | 3
  plateauThreshold: number
  autoDeloadEnabled: boolean
  deloadScalePct: number
}

export interface ExercisePreference {
  loadIncrementKg: number | null
  minRepsOverride: number | null
  maxRepsOverride: number | null
}

export interface RecommendationInput {
  exercise: ExerciseMeta
  templateExercise: TemplateExerciseConfig
  history: ExerciseSession[] // newest first
  currentBodyweightKg: number | null
  preferences: ExercisePreference
  userSettings: UserSettings
}

export interface SetRecommendation {
  externalLoadKg?: number
  addedLoadKg?: number
  bodyweightKg?: number
  repsTarget: number
}

export type ProgressionState =
  | 'increase'
  | 'maintain'
  | 'decrease'
  | 'deload'
  | 'plateau_break'
  | 'first_session'

export interface RecommendationResult {
  sets: SetRecommendation[]
  reasoning: string
  progressionState: ProgressionState
  suggestedLoadKg: number | null // for display: the primary load number
  suggestedReps: number // primary reps target
}
