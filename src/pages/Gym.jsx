import React, { useState, useMemo } from 'react';
import { Dumbbell, Plus, Trash2, CheckSquare, Square, Edit2, Check } from 'lucide-react';
import Tabs from '../components/shared/Tabs';
import { generateFullDUP } from '../utils/PowerliftingEngine';
import { usePersistentState } from '../hooks/usePersistentState';

// --- REGULAR GYM TAB ---
function RegularGymTab() {
  const [routines, setRoutines] = usePersistentState('focushub_routines', {
    Push: [
      { id: 1, name: 'Bench Press', sets: 3, reps: '8-10', weight: 80, completed: false },
      { id: 2, name: 'Overhead Press', sets: 3, reps: '8-10', weight: 50, completed: false }
    ],
    Pull: [
      { id: 3, name: 'Barbell Row', sets: 3, reps: '8-10', weight: 70, completed: false },
      { id: 4, name: 'Pull-ups', sets: 3, reps: 'AMRAP', weight: 0, completed: false }
    ],
    Legs: [
      { id: 5, name: 'Squat', sets: 3, reps: '5-8', weight: 100, completed: false },
      { id: 6, name: 'Romanian Deadlift', sets: 3, reps: '8-10', weight: 90, completed: false }
    ]
  });
  
  const [activeRoutine, setActiveRoutine] = useState('Push');

  const toggleComplete = (id) => {
    const updated = routines[activeRoutine].map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    );
    setRoutines({ ...routines, [activeRoutine]: updated });
  };

  const addExercise = () => {
    const newEx = { id: crypto.randomUUID(), name: 'New Exercise', sets: 3, reps: '10', weight: 0, completed: false };
    setRoutines({ ...routines, [activeRoutine]: [...routines[activeRoutine], newEx] });
  };

  const deleteExercise = (id) => {
    setRoutines({ ...routines, [activeRoutine]: routines[activeRoutine].filter(ex => ex.id !== id) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        {['Push', 'Pull', 'Legs'].map(rt => (
          <button 
            key={rt} 
            className={`btn ${activeRoutine === rt ? 'btn-primary' : ''}`}
            onClick={() => setActiveRoutine(rt)}
          >
            {rt} Template
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h3 className="card-title">{activeRoutine} Day</h3>
          <button className="btn" onClick={addExercise}><Plus size={16} /> Add Exercise</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {routines[activeRoutine].map((ex, idx) => (
            <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)' }}>
              <button className="btn-icon" onClick={() => toggleComplete(ex.id)}>
                {ex.completed ? <CheckSquare size={20} color="var(--accent-emerald)" /> : <Square size={20} color="var(--text-muted)" />}
              </button>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
                <input className="input" value={ex.name} onChange={(e) => {
                  const updated = [...routines[activeRoutine]];
                  updated[idx].name = e.target.value;
                  setRoutines({ ...routines, [activeRoutine]: updated });
                }} style={{ background: 'transparent', border: 'none', padding: 0 }} />
                
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sets: {ex.sets}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reps: {ex.reps}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ex.weight} kg</span>
              </div>
              <button className="btn-icon" onClick={() => deleteExercise(ex.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- POWERLIFTING TAB ---
function PowerliftingTab() {
  const [activeLift, setActiveLift] = usePersistentState('fh_dup_active_lift', 'Bench Press');
  
  const [benchBases, setBenchBases] = usePersistentState('fh_dup_bench_bases', [100]);
  const [deadliftBases, setDeadliftBases] = usePersistentState('fh_dup_dl_bases', [140]);
  
  // NEW: Store completed status and remarks for specific sessions securely in local storage
  const [sessionMetadata, setSessionMetadata] = usePersistentState('fh_dup_metadata', {});
  const [activeRemarkId, setActiveRemarkId] = useState(null);
  const [tempRemark, setTempRemark] = useState('');

  const currentBases = activeLift === 'Bench Press' ? benchBases : deadliftBases;
  const setCurrentBases = activeLift === 'Bench Press' ? setBenchBases : setDeadliftBases;

  const sessions = useMemo(() => {
    return generateFullDUP(activeLift, currentBases);
  }, [activeLift, currentBases]);

  const handleBaseChange = (cycleIndex, value) => {
    const newBases = [...currentBases];
    newBases[cycleIndex] = Number(value) || 0;
    setCurrentBases(newBases);
  };

  const advanceToNextCycle = () => {
    if (currentBases.length < 3) {
      setCurrentBases([...currentBases, currentBases[currentBases.length - 1]]);
    }
  };

  const removeLastCycle = () => {
    if (currentBases.length > 1) {
      setCurrentBases(currentBases.slice(0, -1));
    }
  };

  // --- Session Metadata Actions (Done & Remarks) ---
  const toggleCompletion = (metaKey) => {
    const current = sessionMetadata[metaKey] || { completed: false, remark: '' };
    setSessionMetadata({ ...sessionMetadata, [metaKey]: { ...current, completed: !current.completed } });
  };

  const startEditingRemark = (metaKey, currentRemark) => {
    setTempRemark(currentRemark || '');
    setActiveRemarkId(metaKey);
  };

  const saveRemark = (metaKey) => {
    const current = sessionMetadata[metaKey] || { completed: false, remark: '' };
    setSessionMetadata({ ...sessionMetadata, [metaKey]: { ...current, remark: tempRemark.trim() } });
    setActiveRemarkId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* Lift Selector & Bases */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {['Bench Press', 'Deadlift'].map(lift => (
            <button 
              key={lift} 
              className={`btn ${activeLift === lift ? 'btn-primary' : ''}`}
              onClick={() => setActiveLift(lift)}
              style={{ flex: 1 }}
            >
              {lift}
            </button>
          ))}
        </div>

        {/* Dynamic Cycle Inputs */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {currentBases.map((base, i) => (
            <div key={i} className="input-group" style={{ flex: '1 1 200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cycle {i + 1} Base 1RM (kg)</label>
                
                {i > 0 && i === currentBases.length - 1 && (
                  <button className="btn-icon" onClick={removeLastCycle} style={{ padding: '0 4px', height: 'auto' }} title="Remove this cycle">
                    <Trash2 size={14} color="var(--accent-pink)" />
                  </button>
                )}
              </div>
              <input type="number" className="input" value={base === 0 ? '' : base} onChange={(e) => handleBaseChange(i, e.target.value)} step="2.5" />
            </div>
          ))}
          
          {currentBases.length < 3 && (
            <button className="btn btn-primary" onClick={advanceToNextCycle} style={{ flex: '0 0 auto', height: '38px' }}>
              <Plus size={16} /> Log PR (Start Cycle {currentBases.length + 1})
            </button>
          )}
        </div>
      </div>

      {/* Generated Sequence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Generated Sequence</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
          {sessions.map((session) => {
            const metaKey = `${activeLift}-S${session.globalSession}`;
            const meta = sessionMetadata[metaKey] || { completed: false, remark: '' };

            return (
              <div key={session.globalSession} className="card" style={{ padding: 'var(--space-md)', borderTop: `3px solid ${session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Session {session.globalSession}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{session.phase}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cycle {session.cycle}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Base: {session.base1RM}kg</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {session.prescriptions.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
                      <span>
                        <strong>{p.sets}</strong> × <strong>{p.reps}</strong> 
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '4px' }}>@ {Math.round(p.pct * 100)}%</span>
                        {p.isTarget && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginLeft: '8px' }}>(Target PR)</span>}
                        {p.isReach && <span style={{ color: 'var(--accent-amber)', fontSize: '0.75rem', marginLeft: '8px' }}>(Reach)</span>}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.rawLoad.toFixed(1)}</span>
                        <strong style={{ color: session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)' }}>{p.roundedLoad} kg</strong>
                      </span>
                    </div>
                  ))}
                </div>

                {/* NEW: Action Bar (Done & Remark) */}
                <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      className="btn" 
                      onClick={() => toggleCompletion(metaKey)} 
                      style={{ color: meta.completed ? 'var(--accent-emerald)' : 'var(--text-muted)', padding: '4px 8px' }}
                    >
                      {meta.completed ? <CheckSquare size={18} /> : <Square size={18} />} 
                      <span style={{ marginLeft: '6px' }}>{meta.completed ? 'Completed' : 'Mark Done'}</span>
                    </button>
                    
                    <button className="btn-icon" onClick={() => startEditingRemark(metaKey, meta.remark)} title="Add Remark">
                      <Edit2 size={16} />
                    </button>
                  </div>

                  {/* Remark Editor or Display */}
                  {activeRemarkId === metaKey ? (
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <input 
                        className="input" 
                        value={tempRemark} 
                        onChange={e => setTempRemark(e.target.value)} 
                        placeholder="How did it feel?" 
                        style={{ flex: 1, fontSize: '0.85rem', padding: '6px 12px' }} 
                        autoFocus 
                        onKeyDown={(e) => { if (e.key === 'Enter') saveRemark(metaKey); }}
                      />
                      <button className="btn btn-primary" onClick={() => saveRemark(metaKey)} style={{ padding: '0 var(--space-sm)' }}>
                        <Check size={16} />
                      </button>
                    </div>
                  ) : meta.remark ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                      "{meta.remark}"
                    </div>
                  ) : null}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default function Gym() {
  const tabs = [
    { label: 'Regular', content: <RegularGymTab /> },
    { label: 'Powerlifting', content: <PowerliftingTab /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Dumbbell size={28} color="var(--accent-pink)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Gym & Powerlifting</h1>
      </div>
      
      <div style={{ flex: 1 }}>
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
}



// import React from 'react';
// import { Dumbbell, TrendingUp, Activity, Target, CheckCircle2, Flame, Clock } from 'lucide-react';

// export default function Gym() {
//   const currentRoutine = [
//     { exercise: 'Deadlift (Heavy)', sets: '1 x 3, 3 x 5', weight: '180 kg', completed: true },
//     { exercise: 'Bench Press (Volume)', sets: '4 x 8', weight: '85 kg', completed: false },
//     { exercise: 'Pull-ups', sets: '3 x 10', weight: 'Bodyweight', completed: false },
//     { exercise: 'Bulgarian Split Squats', sets: '3 x 10/leg', weight: '24 kg', completed: false }
//   ];

//   const gearChecklist = [
//     { item: 'USI 790PL Powerlifting Belt', packed: true },
//     { item: 'Liquid Chalk', packed: true },
//     { item: 'Lifting Straps', packed: false },
//     { item: 'Water & Pre-workout', packed: true }
//   ];

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
//       {/* Header Section */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
//           <div style={{ backgroundColor: 'rgba(255, 107, 158, 0.1)', padding: '12px', borderRadius: '12px' }}>
//             <Dumbbell size={28} color="var(--accent-pink)" />
//           </div>
//           <div>
//             <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>DUP Engine</h1>
//             <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Block 3 • Week 4 • Power Phase</span>
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
//           <div className="card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-panel-hover)' }}>
//             <Activity size={16} color="var(--accent-emerald)" />
//             <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Readiness: 92%</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Grid Layout */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-lg)' }}>
        
//         {/* Left Column: Active Session */}
//         <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <Flame size={20} color="var(--accent-amber)" /> Today's Session
//             </h2>
//             <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
//               <Clock size={14} /> Est. 75 min
//             </span>
//           </div>
          
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
//             {currentRoutine.map((lift, i) => (
//               <div key={i} style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'space-between',
//                 padding: 'var(--space-md)', 
//                 backgroundColor: lift.completed ? 'rgba(52, 211, 153, 0.05)' : 'var(--bg-panel-hover)',
//                 border: lift.completed ? '1px solid rgba(52, 211, 153, 0.2)' : '1px solid transparent',
//                 borderRadius: 'var(--radius-md)',
//                 transition: 'all 0.2s ease'
//               }}>
//                 <div>
//                   <div style={{ fontWeight: 600, fontSize: '1.05rem', color: lift.completed ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
//                     {lift.exercise}
//                   </div>
//                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
//                     {lift.sets} @ {lift.weight}
//                   </div>
//                 </div>
//                 <CheckCircle2 size={24} color={lift.completed ? "var(--accent-emerald)" : "var(--text-muted)"} style={{ opacity: lift.completed ? 1 : 0.3 }} />
//               </div>
//             ))}
//           </div>
          
//           <button className="btn btn-primary" style={{ marginTop: 'auto', padding: '12px', fontWeight: 600 }}>
//             Complete Workout
//           </button>
//         </div>

//         {/* Right Column: Stats & Checklist */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          
//           {/* PR Tracker */}
//           <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
//             <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <Target size={20} color="var(--accent-blue)" /> Active PR Targets
//             </h2>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
//               <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}>
//                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadlift 1RM</div>
//                 <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-pink)' }}>200 kg</div>
//               </div>
//               <div style={{ backgroundColor: 'var(--bg-panel-hover)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}>
//                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bench 1RM</div>
//                 <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-blue)' }}>100 kg</div>
//               </div>
//             </div>
//           </div>

//           {/* Pre-flight Gear Check */}
//           <div className="card" style={{ flex: 1 }}>
//             <h2 style={{ margin: '0 0 var(--space-md) 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
//               Gear Bag
//             </h2>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
//               {gearChecklist.map((item, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.95rem' }}>
//                   <div style={{ 
//                     width: '18px', 
//                     height: '18px', 
//                     borderRadius: '4px', 
//                     border: item.packed ? 'none' : '1px solid var(--text-muted)',
//                     backgroundColor: item.packed ? 'var(--accent-blue)' : 'transparent',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}>
//                     {item.packed && <CheckCircle2 size={14} color="#fff" />}
//                   </div>
//                   <span style={{ color: item.packed ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: item.packed ? 'line-through' : 'none' }}>
//                     {item.item}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }