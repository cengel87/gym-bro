/**
 * Gym Bro — Recommendation Engine
 *
 * Pure TypeScript module. No external dependencies except internal engine modules.
 * Implements double progression with load increase, rep progression, plateau breaking,
 * deload detection, and bodyweight exercise support.
 */

import type {
  RecommendationInput,
  RecommendationResult,
  SetRecommendation,
  ProgressionState,
  SetRecord,
} from '@/types/recommendation.types'
import { filterByVariant } from './variantMatcher'
import { countPlateauSessions, countConsecutiveMissSessions, modeLoad } from './plateauDetector'
import { DEFAULT_INCREMENTS_KG, DUMBBELL_INCREMENT_KG, DECREASE_PCT, STARTING_LOADS_KG } from '@/lib/constants'

// ─── Helpers ────────────────────────────────────────────────────────────────

function resolveIncrement(input: RecommendationInput): number {
  if (input.preferences.loadIncrementKg !== null) {
    return input.preferences.loadIncrementKg
  }
  if (input.exercise.equipment === 'dumbbell') {
    return DUMBBELL_INCREMENT_KG
  }
  const pattern = input.exercise.movementPattern as keyof typeof DEFAULT_INCREMENTS_KG
  return DEFAULT_INCREMENTS_KG[pattern] ?? 1.25
}

function roundToIncrement(load: number, increment: number): number {
  if (increment <= 0) return load
  return Math.round(load / increment) * increment
}

function resolveRepRange(input: RecommendationInput): { minReps: number; maxReps: number } {
  return {
    minReps: input.preferences.minRepsOverride ?? input.templateExercise.minReps,
    maxReps: input.preferences.maxRepsOverride ?? input.templateExercise.maxReps,
  }
}

function buildSets(
  targetSets: number,
  loadKg: number,
  repsPerSet: number | number[],
  isBodyweight: boolean,
  currentBodyweightKg: number | null
): SetRecommendation[] {
  return Array.from({ length: targetSets }, (_, i) => {
    const repsTarget = Array.isArray(repsPerSet) ? (repsPerSet[i] ?? repsPerSet[repsPerSet.length - 1]) : repsPerSet

    if (isBodyweight && currentBodyweightKg !== null) {
      const addedLoad = Math.max(0, loadKg - currentBodyweightKg)
      return {
        addedLoadKg: roundToIncrement(addedLoad, 1.25),
        bodyweightKg: currentBodyweightKg,
        repsTarget,
      }
    }

    return {
      externalLoadKg: loadKg,
      repsTarget,
    }
  })
}

// ─── First Session ────────────────────────────────────────────────────────────

function firstSessionRecommendation(input: RecommendationInput): RecommendationResult {
  const { minReps, maxReps } = resolveRepRange(input)
  const targetReps = Math.round((minReps + maxReps) / 2)
  const targetSets = input.templateExercise.targetSets
  const isBodyweight = input.exercise.supportsBodyweight && input.exercise.equipment === 'bodyweight'

  let startingLoad: number
  if (isBodyweight) {
    // Pure bodyweight: no external load recommendation
    startingLoad = input.currentBodyweightKg ?? 0
  } else {
    startingLoad = STARTING_LOADS_KG[input.exercise.equipment as keyof typeof STARTING_LOADS_KG] ?? 20
  }

  const sets = buildSets(targetSets, startingLoad, targetReps, isBodyweight, input.currentBodyweightKg)

  return {
    sets,
    reasoning: 'First session — starting conservative. Adjust as needed.',
    progressionState: 'first_session',
    suggestedLoadKg: isBodyweight ? null : startingLoad,
    suggestedReps: targetReps,
  }
}

// ─── Deload ──────────────────────────────────────────────────────────────────

function deloadRecommendation(
  lastLoad: number,
  input: RecommendationInput,
  increment: number
): RecommendationResult {
  const { minReps } = resolveRepRange(input)
  const scaledLoad = roundToIncrement(
    lastLoad * (1 - input.userSettings.deloadScalePct),
    increment
  )
  const targetSets = input.templateExercise.targetSets
  const isBodyweight = input.exercise.supportsBodyweight && input.exercise.equipment === 'bodyweight'

  const sets = buildSets(targetSets, scaledLoad, Math.max(1, minReps - 2), isBodyweight, input.currentBodyweightKg)

  return {
    sets,
    reasoning: `Auto-deload: multiple missed sessions detected. Taking ${Math.round(input.userSettings.deloadScalePct * 100)}% off.`,
    progressionState: 'deload',
    suggestedLoadKg: isBodyweight ? null : scaledLoad,
    suggestedReps: Math.max(1, minReps - 2),
  }
}

// ─── Main Function ────────────────────────────────────────────────────────────

export function recommend(input: RecommendationInput): RecommendationResult {
  const { minReps, maxReps } = resolveRepRange(input)
  const increment = resolveIncrement(input)
  const isBodyweight = input.exercise.supportsBodyweight && input.exercise.equipment === 'bodyweight'
  const targetSets = input.templateExercise.targetSets

  // STEP 0: Match relevant history by variant
  const { sessions: relevantHistory } = filterByVariant(
    input.history,
    input.templateExercise.variantKey
  )

  if (relevantHistory.length === 0) {
    return firstSessionRecommendation(input)
  }

  const lastSession = relevantHistory[0]
  const workingSets = lastSession.sets.filter((s) => s.setType === 'working')

  if (workingSets.length === 0) {
    return firstSessionRecommendation(input)
  }

  const lastLoad = modeLoad(workingSets.map((s) => s.effectiveLoadKg))
  const repsPerSet = workingSets.map((s) => s.repsCompleted)

  // STEP 1: Deload check
  if (input.userSettings.autoDeloadEnabled) {
    const missSessions = countConsecutiveMissSessions(relevantHistory, minReps, 2)
    if (missSessions >= 3) {
      return deloadRecommendation(lastLoad, input, increment)
    }
  }

  // STEP 2: Evaluate last session
  const allHitMax = repsPerSet.every((r) => r >= maxReps)
  const missingMin = repsPerSet.filter((r) => r < minReps).length

  let progressionState: ProgressionState
  let newLoad: number
  let setRepTargets: number[]

  if (allHitMax) {
    // STEP 3a: Full progression — increase load
    newLoad = roundToIncrement(lastLoad + increment, increment)
    setRepTargets = Array(targetSets).fill(minReps)
    progressionState = 'increase'
  } else if (missingMin >= 2) {
    // STEP 3b: Multiple misses — decrease load
    const decreasePct = DECREASE_PCT[input.userSettings.aggressiveness] ?? 0.0375
    newLoad = roundToIncrement(lastLoad * (1 - decreasePct), increment)
    setRepTargets = Array(targetSets).fill(minReps)
    progressionState = 'decrease'
  } else {
    // STEP 3c: Maintain load, increase reps on lagging sets
    newLoad = lastLoad
    // Per-set rep targets: completed + 1 on lagging sets, capped at maxReps
    setRepTargets = repsPerSet.map((r) => Math.min(r + 1, maxReps))
    // Pad to target sets if needed
    while (setRepTargets.length < targetSets) {
      setRepTargets.push(Math.min((setRepTargets.at(-1) ?? minReps) + 1, maxReps))
    }
    progressionState = 'maintain'
  }

  // STEP 4: Plateau check (only applies on maintain or if load didn't change)
  if (progressionState === 'maintain' || progressionState === 'increase') {
    const avgReps = repsPerSet.reduce((a, b) => a + b, 0) / repsPerSet.length
    const plateauCount = countPlateauSessions(relevantHistory, lastLoad, avgReps)

    if (plateauCount >= input.userSettings.plateauThreshold) {
      // Apply plateau breaker based on aggressiveness
      progressionState = 'plateau_break'

      if (input.userSettings.aggressiveness === 1) {
        // Conservative: microload (smallest increment / 2)
        newLoad = roundToIncrement(lastLoad + increment / 2, increment / 2)
        setRepTargets = Array(targetSets).fill(minReps)
      } else if (input.userSettings.aggressiveness === 2) {
        // Moderate: drop reps to floor, bump load slightly
        newLoad = roundToIncrement(lastLoad + increment, increment)
        setRepTargets = Array(targetSets).fill(minReps)
      } else {
        // Aggressive: full increment + accept lower rep target
        newLoad = roundToIncrement(lastLoad + increment, increment)
        setRepTargets = Array(targetSets).fill(Math.max(minReps - 1, 1))
      }
    }
  }

  // STEP 5: Build set recommendations
  const sets = buildSets(targetSets, newLoad, setRepTargets, isBodyweight, input.currentBodyweightKg)
  const primaryReps = setRepTargets[0] ?? minReps

  // STEP 6: Build reasoning string
  const reasoning = buildReasoning(
    progressionState,
    lastLoad,
    newLoad,
    repsPerSet,
    minReps,
    maxReps,
    input.userSettings.aggressiveness
  )

  return {
    sets,
    reasoning,
    progressionState,
    suggestedLoadKg: isBodyweight ? null : newLoad,
    suggestedReps: primaryReps,
  }
}

function buildReasoning(
  state: ProgressionState,
  lastLoad: number,
  newLoad: number,
  lastReps: number[],
  minReps: number,
  maxReps: number,
  aggressiveness: number
): string {
  const avgReps = Math.round(lastReps.reduce((a, b) => a + b, 0) / lastReps.length)

  switch (state) {
    case 'first_session':
      return 'First session — starting conservative.'
    case 'increase':
      return `You hit ${maxReps}+ reps on all sets at ${lastLoad}kg. Time to add weight.`
    case 'maintain':
      return `Averaging ${avgReps} reps at ${lastLoad}kg. Keep the weight, push for more reps.`
    case 'decrease':
      return `Struggled at ${lastLoad}kg (avg ${avgReps} reps). Dropping the weight slightly.`
    case 'deload':
      return 'Auto-deload triggered: multiple missed sessions detected.'
    case 'plateau_break':
      return `Plateau detected at ${lastLoad}kg × ${avgReps} reps. ${aggressiveness === 1 ? 'Micro-loading' : 'Bumping load'} to break through.`
    default:
      return ''
  }
}

// Export helpers for testing
export { resolveIncrement, roundToIncrement, resolveRepRange }
