export const MOVEMENT_PATTERNS = [
  'squat',
  'hinge',
  'push_horizontal',
  'push_vertical',
  'pull_horizontal',
  'pull_vertical',
  'carry',
  'core',
  'isolation',
] as const

export type MovementPattern = (typeof MOVEMENT_PATTERNS)[number]

export const EQUIPMENT_LIST = [
  'barbell',
  'dumbbell',
  'bodyweight',
  'cable',
  'machine',
  'kettlebell',
  'band',
  'other',
] as const

export type Equipment = (typeof EQUIPMENT_LIST)[number]

export const MUSCLE_GROUPS = [
  'quads',
  'glutes',
  'hamstrings',
  'chest',
  'triceps',
  'biceps',
  'back',
  'lats',
  'traps',
  'shoulders',
  'anterior_deltoid',
  'lateral_deltoid',
  'rear_deltoid',
  'core',
  'abs',
  'calves',
  'adductors',
  'abductors',
  'erectors',
  'serratus',
  'forearms',
  'hip_flexors',
  'neck',
] as const

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number]

// Default load increments in kg by movement pattern
export const DEFAULT_INCREMENTS_KG: Record<MovementPattern, number> = {
  squat: 2.5,
  hinge: 2.5,
  push_horizontal: 2.5,
  push_vertical: 1.25,
  pull_horizontal: 2.5,
  pull_vertical: 2.5,
  carry: 2.5,
  core: 1.0,
  isolation: 1.0,
}

// Dumbbell increments (typically larger jumps at commercial gyms)
export const DUMBBELL_INCREMENT_KG = 2.0

// Minimum effective loads (starting weights) by equipment
export const STARTING_LOADS_KG: Record<Equipment, number> = {
  barbell: 20, // empty barbell
  dumbbell: 5,
  bodyweight: 0,
  cable: 5,
  machine: 10,
  kettlebell: 8,
  band: 0,
  other: 0,
}

export const AGGRESSIVENESS_LABELS = {
  1: 'Conservative',
  2: 'Moderate',
  3: 'Aggressive',
} as const

// Decrease % when failing sets, per aggressiveness level
export const DECREASE_PCT: Record<number, number> = {
  1: 0.05,  // 5% decrease
  2: 0.0375, // 3.75% decrease
  3: 0.025, // 2.5% decrease
}

export const BOTTOM_NAV_ITEMS = [
  { path: '/', label: 'Today', icon: 'Home' },
  { path: '/templates', label: 'Templates', icon: 'Layout' },
  { path: '/progress', label: 'Progress', icon: 'TrendingUp' },
  { path: '/library', label: 'Library', icon: 'BookOpen' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
] as const

export const SET_TYPES = ['working', 'warmup', 'dropset', 'amrap'] as const
export type SetType = (typeof SET_TYPES)[number]
