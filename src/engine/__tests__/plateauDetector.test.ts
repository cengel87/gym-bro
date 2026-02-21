import { describe, it, expect } from 'vitest'
import { countPlateauSessions, countConsecutiveMissSessions } from '../plateauDetector'
import { makeSession, makeSet } from './factories'

describe('countPlateauSessions', () => {
  it('counts consecutive sessions with same load and reps', () => {
    const history = [
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
    ]
    expect(countPlateauSessions(history, 80, 8)).toBe(3)
  })

  it('stops counting at session with different load', () => {
    const history = [
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 77.5 })] }), // different load
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
    ]
    // Only first session matches
    expect(countPlateauSessions(history, 80, 8)).toBe(1)
  })

  it('returns 0 when no sessions match', () => {
    const history = [
      makeSession({ sets: [makeSet({ repsCompleted: 10, effectiveLoadKg: 80 })] }),
    ]
    expect(countPlateauSessions(history, 82.5, 8)).toBe(0)
  })
})

describe('countConsecutiveMissSessions', () => {
  it('counts consecutive sessions where 2+ sets miss minReps', () => {
    const minReps = 8
    const history = [
      makeSession({ sets: [
        makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 6, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 7, effectiveLoadKg: 100 }),
      ]}),
      makeSession({ sets: [
        makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 6, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 8, effectiveLoadKg: 100 }),
      ]}),
    ]
    expect(countConsecutiveMissSessions(history, minReps, 2)).toBe(2)
  })

  it('stops when a session does NOT have 2+ misses', () => {
    const minReps = 8
    const history = [
      makeSession({ sets: [
        makeSet({ repsCompleted: 8, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 8, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 8, effectiveLoadKg: 100 }),
      ]}),
      makeSession({ sets: [
        makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 6, effectiveLoadKg: 100 }),
        makeSet({ repsCompleted: 7, effectiveLoadKg: 100 }),
      ]}),
    ]
    // history[0] is newest: no misses → count stops at 0
    expect(countConsecutiveMissSessions(history, minReps, 2)).toBe(0)
  })

  it('returns 0 for empty history', () => {
    expect(countConsecutiveMissSessions([], 8, 2)).toBe(0)
  })
})
