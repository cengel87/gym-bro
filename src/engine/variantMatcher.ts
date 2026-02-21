/**
 * Matches exercise sessions by variant key (incline_deg, grip, stance, etc.)
 * Strategy: exact → partial (incline ±10°) → any
 */

export function matchesVariantExact(
  sessionVariant: Record<string, unknown>,
  targetVariant: Record<string, unknown>
): boolean {
  const targetKeys = Object.keys(targetVariant)
  if (targetKeys.length === 0) {
    // No target variant = match sessions with no variant or any variant
    return Object.keys(sessionVariant).length === 0
  }
  return targetKeys.every((key) => sessionVariant[key] === targetVariant[key])
}

export function matchesVariantPartial(
  sessionVariant: Record<string, unknown>,
  targetVariant: Record<string, unknown>,
  tolerance = 10
): boolean {
  const targetKeys = Object.keys(targetVariant)
  if (targetKeys.length === 0) return true

  return targetKeys.every((key) => {
    const sessionVal = sessionVariant[key]
    const targetVal = targetVariant[key]

    // Numeric keys (e.g. incline_deg): allow tolerance
    if (typeof targetVal === 'number' && typeof sessionVal === 'number') {
      return Math.abs(sessionVal - targetVal) <= tolerance
    }
    // String keys: must match exactly
    return sessionVal === targetVal
  })
}

export type VariantMatchStrategy = 'exact' | 'partial' | 'any'

export function filterByVariant<T extends { variantKey: Record<string, unknown> }>(
  sessions: T[],
  targetVariant: Record<string, unknown>
): { sessions: T[]; strategy: VariantMatchStrategy } {
  // Try exact match first
  const exact = sessions.filter((s) => matchesVariantExact(s.variantKey, targetVariant))
  if (exact.length >= 1) return { sessions: exact, strategy: 'exact' }

  // Try partial match (incline ±10°)
  const partial = sessions.filter((s) => matchesVariantPartial(s.variantKey, targetVariant))
  if (partial.length >= 1) return { sessions: partial, strategy: 'partial' }

  // Fallback: return all sessions regardless of variant
  return { sessions, strategy: 'any' }
}
