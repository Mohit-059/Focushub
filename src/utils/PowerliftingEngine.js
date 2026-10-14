/**
 * Core DUP Engine for FocusHub
 * Implements the exact 10-session master key and specific rounding rules.
 */

const MASTER_KEY = [
  { session: 1, phase: 'Accumulation 1', type: 'heavy', reps: [ { sets: 1, reps: 5, pct: 0.80 }, { sets: 2, reps: 5, pct: 0.84 }, { sets: 1, reps: 5, pct: 0.80 } ] },
  { session: 2, phase: 'Speed Volume', type: 'speed', liftSpecific: { 'Bench Press': [{ sets: 4, reps: 5, pct: 0.74 }], 'Deadlift': [{ sets: 3, reps: 5, pct: 0.72 }] } },
  { session: 3, phase: 'Accumulation 2', type: 'heavy', reps: [ { sets: 1, reps: 4, pct: 0.82 }, { sets: 2, reps: 4, pct: 0.88 }, { sets: 1, reps: 4, pct: 0.82 } ] },
  { session: 4, phase: 'Speed Volume', type: 'speed', liftSpecific: { 'Bench Press': [{ sets: 4, reps: 4, pct: 0.76 }], 'Deadlift': [{ sets: 3, reps: 4, pct: 0.76 }] } },
  { session: 5, phase: 'Intensification', type: 'heavy', reps: [ { sets: 1, reps: 3, pct: 0.88 }, { sets: 2, reps: 3, pct: 0.92 }, { sets: 1, reps: 3, pct: 0.88 } ] },
  { session: 6, phase: 'Speed Volume', type: 'speed', reps: [ { sets: 3, reps: 3, pct: 0.80 } ] },
  { session: 7, phase: 'Overload Peak', type: 'heavy', reps: [ { sets: 1, reps: 1, pct: 0.95 }, { sets: 1, reps: 1, pct: 0.98 }, { sets: 2, reps: 4, pct: 0.80 } ] },
  { session: 8, phase: 'Speed Volume', type: 'speed', reps: [ { sets: 3, reps: 3, pct: 0.80 } ] },
  { session: 9, phase: 'Taper Deload', type: 'heavy', reps: [ { sets: 2, reps: 2, pct: 0.79 } ] },
  { session: 10, phase: 'PR Test', type: 'heavy', reps: [ { sets: 1, reps: 1, pct: 0.90 }, { sets: 1, reps: 1, pct: 0.97 }, { sets: 1, reps: 1, pct: 1.03, isTarget: true }, { sets: 1, reps: 1, pct: 1.06, isReach: true } ] }
];

export function calculateLoad(base1RM, percentage) {
  return base1RM * percentage;
}

export function roundLoad(rawLoad, type, manualOverride = null) {
  const increment = 2.5;
  const lower = Math.floor(rawLoad / increment) * increment;
  const upper = Math.ceil(rawLoad / increment) * increment;
  const nearest = (rawLoad - lower < upper - rawLoad) ? lower : upper;

  if (type === 'speed') return lower;
  
  if (type === 'heavy') {
    if (manualOverride === 'down') return lower;
    if (manualOverride === 'up') return upper;
    return nearest;
  }
  return nearest;
}

export function generateCycle(liftName, cycleNumber, base1RM) {
  const sessions = [];
  const globalOffset = (cycleNumber - 1) * 10;

  MASTER_KEY.forEach((key) => {
    const sessionReps = key.liftSpecific ? key.liftSpecific[liftName] : key.reps;
    
    const prescriptions = sessionReps.map(r => {
      const raw = calculateLoad(base1RM, r.pct);
      return {
        ...r,
        rawLoad: raw,
        roundedLoad: roundLoad(raw, key.type)
      };
    });

    sessions.push({
      globalSession: globalOffset + key.session,
      cycle: cycleNumber,
      sessionInCycle: key.session,
      phase: key.phase,
      type: key.type,
      base1RM,
      prescriptions,
      completed: false,
      actualData: null
    });
  });

  return sessions;
}

export function generateFullDUP(liftName, bases = [100, 105, 110]) {
  // bases array should contain the confirmed 1RM for Cycle 1, 2, and 3.
  let allSessions = [];
  bases.forEach((base, index) => {
    allSessions = allSessions.concat(generateCycle(liftName, index + 1, base));
  });
  return allSessions;
}