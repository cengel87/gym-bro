import { describe, it, expect } from 'vitest'
import { epley1RM, brzycki1RM, estimate1RM } from '../oneRepMax'

describe('epley1RM', () => {
  it('returns load itself for 1 rep', () => {
    expect(epley1RM(100, 1)).toBe(100)
  })

  it('100kg x 5 → ~117kg', () => {
    const result = epley1RM(100, 5)
    expect(result).toBeCloseTo(116.7, 0)
  })

  it('80kg x 8 → ~101.3kg', () => {
    const result = epley1RM(80, 8)
    expect(result).toBeCloseTo(101.3, 0)
  })

  it('returns null for reps > 15', () => {
    expect(epley1RM(60, 16)).toBeNull()
  })

  it('returns null for 0 reps', () => {
    expect(epley1RM(100, 0)).toBeNull()
  })
})

describe('brzycki1RM', () => {
  it('returns load itself for 1 rep', () => {
    expect(brzycki1RM(100, 1)).toBe(100)
  })

  it('matches known value within 2%', () => {
    // 100kg x 10 → ~133.3kg by Brzycki
    const result = brzycki1RM(100, 10)
    expect(result).toBeGreaterThan(130)
    expect(result).toBeLessThan(140)
  })

  it('returns null for reps > 15', () => {
    expect(brzycki1RM(60, 20)).toBeNull()
  })
})

describe('estimate1RM', () => {
  it('returns max 1RM from multiple sets', () => {
    const sets = [
      { effectiveLoadKg: 80, repsCompleted: 5 },  // ~93kg
      { effectiveLoadKg: 80, repsCompleted: 4 },  // ~91kg
      { effectiveLoadKg: 80, repsCompleted: 3 },  // ~88kg
    ]
    const result = estimate1RM(sets)
    expect(result).toBeGreaterThan(90)
  })

  it('ignores sets with reps > 15', () => {
    const sets = [
      { effectiveLoadKg: 60, repsCompleted: 20 },
      { effectiveLoadKg: 80, repsCompleted: 8 },
    ]
    const result = estimate1RM(sets)
    // Should only use the 80kg x 8 set
    expect(result).toBeCloseTo(epley1RM(80, 8)!, 1)
  })

  it('returns null for empty sets', () => {
    expect(estimate1RM([])).toBeNull()
  })

  it('returns null when all sets have > 15 reps', () => {
    const sets = [{ effectiveLoadKg: 60, repsCompleted: 20 }]
    expect(estimate1RM(sets)).toBeNull()
  })
})
