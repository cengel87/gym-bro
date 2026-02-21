/**
 * 1RM estimation formulas.
 * Epley formula is most common for reps 2–12.
 * Returns null for reps > 15 (formula unreliable).
 */

export function epley1RM(loadKg: number, reps: number): number | null {
  if (reps <= 0 || reps > 15) return null
  if (reps === 1) return loadKg
  return Math.round(loadKg * (1 + reps / 30) * 10) / 10
}

export function brzycki1RM(loadKg: number, reps: number): number | null {
  if (reps <= 0 || reps > 15) return null
  if (reps === 1) return loadKg
  return Math.round((loadKg * 36) / (37 - reps) * 10) / 10
}

/**
 * Best estimate 1RM from a list of sets (takes the max).
 */
export function estimate1RM(
  sets: { effectiveLoadKg: number; repsCompleted: number }[]
): number | null {
  const estimates = sets
    .filter((s) => s.repsCompleted > 0 && s.repsCompleted <= 15)
    .map((s) => epley1RM(s.effectiveLoadKg, s.repsCompleted))
    .filter((e): e is number => e !== null)

  if (estimates.length === 0) return null
  return Math.max(...estimates)
}

/**
 * Calculate load for a target % of 1RM, rounded to nearest increment.
 */
export function loadFromPercentage(
  oneRM: number,
  percentage: number,
  increment: number
): number {
  const raw = oneRM * percentage
  return Math.round(raw / increment) * increment
}
