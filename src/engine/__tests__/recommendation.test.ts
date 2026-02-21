import { describe, it, expect } from 'vitest'
import { recommend } from '../recommendation'
import { makeInput, makeSession, makeSet, makePlateauHistory, makeMissHistory } from './factories'

describe('recommend() — first session', () => {
  it('returns first_session state with no history', () => {
    const result = recommend(makeInput({ history: [] }))
    expect(result.progressionState).toBe('first_session')
  })

  it('returns empty bar weight for barbell with no history', () => {
    const result = recommend(makeInput({ history: [] }))
    expect(result.suggestedLoadKg).toBe(20) // empty barbell
  })

  it('returns correct number of sets', () => {
    const result = recommend(makeInput({ history: [], templateExercise: { targetSets: 4, minReps: 8, maxReps: 12, variantKey: {} } }))
    expect(result.sets).toHaveLength(4)
  })

  it('targets midpoint of rep range on first session', () => {
    const result = recommend(makeInput({
      history: [],
      templateExercise: { targetSets: 3, minReps: 8, maxReps: 12, variantKey: {} }
    }))
    expect(result.suggestedReps).toBe(10) // (8+12)/2 = 10
  })
})

describe('recommend() — load increase (all sets hit maxReps)', () => {
  it('increases load by 2.5kg for barbell squat', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('increase')
    expect(result.suggestedLoadKg).toBe(82.5)
  })

  it('uses user override increment when set', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 12, effectiveLoadKg: 50 }),
      makeSet({ repsCompleted: 12, effectiveLoadKg: 50 }),
      makeSet({ repsCompleted: 12, effectiveLoadKg: 50 }),
    ]})]
    const result = recommend(makeInput({
      history,
      preferences: { loadIncrementKg: 5, minRepsOverride: null, maxRepsOverride: null },
      templateExercise: { targetSets: 3, minReps: 8, maxReps: 12, variantKey: {} }
    }))
    expect(result.progressionState).toBe('increase')
    expect(result.suggestedLoadKg).toBe(55)
  })

  it('targets minReps after load increase', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 2, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('increase')
    expect(result.sets.every((s) => s.repsTarget === 6)).toBe(true)
  })

  it('uses dumbbell increment for dumbbell exercises', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 12, effectiveLoadKg: 20 }),
      makeSet({ repsCompleted: 12, effectiveLoadKg: 20 }),
    ]})]
    const result = recommend(makeInput({
      history,
      exercise: { id: 'db', supportsBodyweight: false, equipment: 'dumbbell', movementPattern: 'push_horizontal' },
      templateExercise: { targetSets: 2, minReps: 8, maxReps: 12, variantKey: {} }
    }))
    expect(result.progressionState).toBe('increase')
    expect(result.suggestedLoadKg).toBe(22) // 20 + 2kg dumbbell increment
  })
})

describe('recommend() — rep progression (maintain load)', () => {
  it('keeps same load when not all sets hit maxReps', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 9, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('maintain')
    expect(result.suggestedLoadKg).toBe(80)
  })

  it('targets +1 rep on lagging sets', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 9, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 7, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 6, effectiveLoadKg: 80 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.sets[0].repsTarget).toBe(10) // 9+1 = 10 (capped at max)
    expect(result.sets[1].repsTarget).toBe(8) // 7+1
    expect(result.sets[2].repsTarget).toBe(7) // 6+1
  })

  it('does not increase reps above maxReps', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }),
      makeSet({ repsCompleted: 9, effectiveLoadKg: 80 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 2, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    // First set was already at max → but second set wasn't → maintain, not increase
    expect(result.progressionState).toBe('maintain')
    expect(result.sets[0].repsTarget).toBeLessThanOrEqual(10)
    expect(result.sets[1].repsTarget).toBeLessThanOrEqual(10)
  })
})

describe('recommend() — load decrease', () => {
  it('decreases load when 2+ sets miss minReps', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 4, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 7, effectiveLoadKg: 100 }),
    ]})]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('decrease')
    expect(result.suggestedLoadKg!).toBeLessThan(100)
  })

  it('aggressiveness 1 decreases by ~5%', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 3, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 4, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
    ]})]
    const result = recommend(makeInput({
      history,
      userSettings: { aggressiveness: 1, plateauThreshold: 3, autoDeloadEnabled: true, deloadScalePct: 0.1 },
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('decrease')
    // 100 * 0.95 = 95, rounded to nearest 2.5 = 95
    expect(result.suggestedLoadKg).toBe(95)
  })

  it('aggressiveness 3 decreases by ~2.5%', () => {
    const history = [makeSession({ sets: [
      makeSet({ repsCompleted: 3, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 4, effectiveLoadKg: 100 }),
      makeSet({ repsCompleted: 5, effectiveLoadKg: 100 }),
    ]})]
    const result = recommend(makeInput({
      history,
      userSettings: { aggressiveness: 3, plateauThreshold: 3, autoDeloadEnabled: true, deloadScalePct: 0.1 },
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('decrease')
    // 100 * 0.975 = 97.5, rounded = 97.5
    expect(result.suggestedLoadKg).toBe(97.5)
  })
})

describe('recommend() — plateau detection', () => {
  it('detects plateau after N identical sessions', () => {
    const history = makePlateauHistory(4, 80, 8) // 4 sessions, same load and reps
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: false, deloadScalePct: 0.1 }
    }))
    expect(result.progressionState).toBe('plateau_break')
  })

  it('does NOT detect plateau with fewer sessions than threshold', () => {
    const history = makePlateauHistory(2, 80, 8) // only 2 sessions
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: false, deloadScalePct: 0.1 }
    }))
    expect(result.progressionState).not.toBe('plateau_break')
  })

  it('resets plateau count when load changes', () => {
    const history = [
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 82.5 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 82.5 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 82.5 })] }),
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
      makeSession({ sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 80 })] }),
    ]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 6, maxReps: 10, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: false, deloadScalePct: 0.1 }
    }))
    // Last session was at a different load (82.5), so plateau count resets to 1
    expect(result.progressionState).not.toBe('plateau_break')
  })
})

describe('recommend() — deload', () => {
  it('triggers deload after 3 consecutive sessions with 2+ misses', () => {
    const history = makeMissHistory(3, 100, 8) // 3 sessions all missing
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 8, maxReps: 12, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: true, deloadScalePct: 0.1 }
    }))
    expect(result.progressionState).toBe('deload')
  })

  it('does not trigger deload when autoDeloadEnabled is false', () => {
    const history = makeMissHistory(3, 100, 8)
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 8, maxReps: 12, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: false, deloadScalePct: 0.1 }
    }))
    expect(result.progressionState).not.toBe('deload')
  })

  it('scales load down by deloadScalePct', () => {
    const history = makeMissHistory(3, 100, 8)
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 3, minReps: 8, maxReps: 12, variantKey: {} },
      userSettings: { aggressiveness: 2, plateauThreshold: 3, autoDeloadEnabled: true, deloadScalePct: 0.1 }
    }))
    expect(result.progressionState).toBe('deload')
    // 100 * 0.9 = 90
    expect(result.suggestedLoadKg).toBe(90)
  })
})

describe('recommend() — bodyweight exercises', () => {
  it('returns addedLoadKg for weighted pull-ups', () => {
    const history = [makeSession({
      sets: [
        { ...makeSet({ repsCompleted: 10, effectiveLoadKg: 90 }), bodyweightKg: 80, addedLoadKg: 10, externalLoadKg: null },
        { ...makeSet({ repsCompleted: 10, effectiveLoadKg: 90 }), bodyweightKg: 80, addedLoadKg: 10, externalLoadKg: null },
      ]
    })]
    const result = recommend(makeInput({
      history,
      exercise: { id: 'pullup', supportsBodyweight: true, equipment: 'bodyweight', movementPattern: 'pull_vertical' },
      currentBodyweightKg: 80,
      templateExercise: { targetSets: 2, minReps: 6, maxReps: 10, variantKey: {} }
    }))
    expect(result.progressionState).toBe('increase')
    expect(result.sets[0].addedLoadKg).toBeDefined()
    expect(result.sets[0].bodyweightKg).toBe(80)
    expect(result.sets[0].externalLoadKg).toBeUndefined()
  })

  it('does not return externalLoadKg for bodyweight exercises', () => {
    const history = [makeSession({
      sets: [
        { ...makeSet({ repsCompleted: 10, effectiveLoadKg: 80 }), bodyweightKg: 80, addedLoadKg: 0, externalLoadKg: null },
      ]
    })]
    const result = recommend(makeInput({
      history,
      exercise: { id: 'pushup', supportsBodyweight: true, equipment: 'bodyweight', movementPattern: 'push_horizontal' },
      currentBodyweightKg: 80,
      templateExercise: { targetSets: 2, minReps: 8, maxReps: 20, variantKey: {} }
    }))
    expect(result.sets[0].externalLoadKg).toBeUndefined()
    expect(result.suggestedLoadKg).toBeNull()
  })
})

describe('recommend() — variant matching', () => {
  it('exact-matches incline_deg for incline bench (hit maxReps → increase)', () => {
    // 30° session: hit maxReps (12) → should increase if correctly matched
    // 45° session: only 8 reps → if incorrectly matched, would maintain
    const history = [
      makeSession({ variantKey: { incline_deg: 30 }, sets: [makeSet({ repsCompleted: 12, effectiveLoadKg: 60 }), makeSet({ repsCompleted: 12, effectiveLoadKg: 60 })] }),
      makeSession({ variantKey: { incline_deg: 45 }, sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 55 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 55 })] }),
    ]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 2, minReps: 8, maxReps: 12, variantKey: { incline_deg: 30 } }
    }))
    // Should match the 30° session (exact match), both sets hit maxReps (12) → increase
    expect(result.progressionState).toBe('increase')
    expect(result.suggestedLoadKg).toBe(62.5)
  })

  it('falls back to any history when no variant match exists', () => {
    const history = [
      makeSession({ variantKey: { incline_deg: 45 }, sets: [makeSet({ repsCompleted: 8, effectiveLoadKg: 55 }), makeSet({ repsCompleted: 8, effectiveLoadKg: 55 })] }),
    ]
    const result = recommend(makeInput({
      history,
      templateExercise: { targetSets: 2, minReps: 8, maxReps: 12, variantKey: { incline_deg: 30 } }
    }))
    // Partial match (within ±10°) found for 45° when targeting 30°
    expect(result.progressionState).not.toBe('first_session')
  })
})
