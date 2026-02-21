import type { ExerciseSession } from '@/types/recommendation.types'

/**
 * Count consecutive sessions where load AND average reps are unchanged.
 * Resets on the first session that differs.
 */
export function countPlateauSessions(
  history: ExerciseSession[], // newest first
  referenceLoadKg: number,
  referenceAvgReps: number,
  repsTolerance = 0.5
): number {
  let count = 0
  for (const session of history) {
    const workingSets = session.sets.filter((s) => s.setType === 'working')
    if (workingSets.length === 0) break

    const sessionLoad = modeLoad(workingSets.map((s) => s.effectiveLoadKg))
    const sessionAvgReps =
      workingSets.reduce((sum, s) => sum + s.repsCompleted, 0) / workingSets.length

    if (
      sessionLoad === referenceLoadKg &&
      Math.abs(sessionAvgReps - referenceAvgReps) < repsTolerance
    ) {
      count++
    } else {
      break // non-consecutive → stop
    }
  }
  return count
}

/**
 * Count consecutive sessions where 2+ working sets missed minReps.
 */
export function countConsecutiveMissSessions(
  history: ExerciseSession[], // newest first
  minReps: number,
  missThreshold = 2
): number {
  let count = 0
  for (const session of history) {
    const workingSets = session.sets.filter((s) => s.setType === 'working')
    const missCount = workingSets.filter((s) => s.repsCompleted < minReps).length
    if (missCount >= missThreshold) {
      count++
    } else {
      break
    }
  }
  return count
}

function modeLoad(loads: number[]): number {
  if (loads.length === 0) return 0
  const freq = new Map<number, number>()
  let maxFreq = 0
  let mode = loads[0]
  for (const load of loads) {
    const count = (freq.get(load) ?? 0) + 1
    freq.set(load, count)
    if (count > maxFreq) {
      maxFreq = count
      mode = load
    }
  }
  return mode
}

export { modeLoad }
