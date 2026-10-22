// import React, { useState, useMemo } from 'react';
// import { Dumbbell, Plus, Trash2, CheckSquare, Square, Edit2, Check } from 'lucide-react';
// import Tabs from '../components/shared/Tabs';
// import { generateFullDUP } from '../utils/PowerliftingEngine';
// import { usePersistentState } from '../hooks/usePersistentState';

// // --- REGULAR GYM TAB ---
// function RegularGymTab() {
//   const [routines, setRoutines] = usePersistentState('focushub_routines', {
//     Push: [
//       { id: 1, name: 'Bench Press', sets: 3, reps: '8-10', weight: 80, completed: false },
//       { id: 2, name: 'Overhead Press', sets: 3, reps: '8-10', weight: 50, completed: false }
//     ],
//     Pull: [
//       { id: 3, name: 'Barbell Row', sets: 3, reps: '8-10', weight: 70, completed: false },
//       { id: 4, name: 'Pull-ups', sets: 3, reps: 'AMRAP', weight: 0, completed: false }
//     ],
//     Legs: [
//       { id: 5, name: 'Squat', sets: 3, reps: '5-8', weight: 100, completed: false },
//       { id: 6, name: 'Romanian Deadlift', sets: 3, reps: '8-10', weight: 90, completed: false }
//     ]
//   });
  
//   const [activeRoutine, setActiveRoutine] = useState('Push');

//   const toggleComplete = (id) => {
//     const updated = routines[activeRoutine].map(ex => 
//       ex.id === id ? { ...ex, completed: !ex.completed } : ex
//     );
//     setRoutines({ ...routines, [activeRoutine]: updated });
//   };

//   const addExercise = () => {
//     const newEx = { id: crypto.randomUUID(), name: 'New Exercise', sets: 3, reps: '10', weight: 0, completed: false };
//     setRoutines({ ...routines, [activeRoutine]: [...routines[activeRoutine], newEx] });
//   };

//   const deleteExercise = (id) => {
//     setRoutines({ ...routines, [activeRoutine]: routines[activeRoutine].filter(ex => ex.id !== id) });
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
//       <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
//         {['Push', 'Pull', 'Legs'].map(rt => (
//           <button 
//             key={rt} 
//             className={`btn ${activeRoutine === rt ? 'btn-primary' : ''}`}
//             onClick={() => setActiveRoutine(rt)}
//           >
//             {rt} Template
//           </button>
//         ))}
//       </div>

//       <div className="card">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
//           <h3 className="card-title">{activeRoutine} Day</h3>
//           <button className="btn" onClick={addExercise}><Plus size={16} /> Add Exercise</button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
//           {routines[activeRoutine].map((ex, idx) => (
//             <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)' }}>
//               <button className="btn-icon" onClick={() => toggleComplete(ex.id)}>
//                 {ex.completed ? <CheckSquare size={20} color="var(--accent-emerald)" /> : <Square size={20} color="var(--text-muted)" />}
//               </button>
//               <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
//                 <input className="input" value={ex.name} onChange={(e) => {
//                   const updated = [...routines[activeRoutine]];
//                   updated[idx].name = e.target.value;
//                   setRoutines({ ...routines, [activeRoutine]: updated });
//                 }} style={{ background: 'transparent', border: 'none', padding: 0 }} />
                
//                 <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sets: {ex.sets}</span>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reps: {ex.reps}</span>
//                 <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{ex.weight} kg</span>
//               </div>
//               <button className="btn-icon" onClick={() => deleteExercise(ex.id)}><Trash2 size={16} /></button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- POWERLIFTING TAB ---
// function PowerliftingTab() {
//   const [activeLift, setActiveLift] = usePersistentState('fh_dup_active_lift', 'Bench Press');
  
//   const [benchBases, setBenchBases] = usePersistentState('fh_dup_bench_bases', [100]);
//   const [deadliftBases, setDeadliftBases] = usePersistentState('fh_dup_dl_bases', [140]);
  
//   // NEW: Store completed status and remarks for specific sessions securely in local storage
//   const [sessionMetadata, setSessionMetadata] = usePersistentState('fh_dup_metadata', {});
//   const [activeRemarkId, setActiveRemarkId] = useState(null);
//   const [tempRemark, setTempRemark] = useState('');

//   const currentBases = activeLift === 'Bench Press' ? benchBases : deadliftBases;
//   const setCurrentBases = activeLift === 'Bench Press' ? setBenchBases : setDeadliftBases;

//   const sessions = useMemo(() => {
//     return generateFullDUP(activeLift, currentBases);
//   }, [activeLift, currentBases]);

//   const handleBaseChange = (cycleIndex, value) => {
//     const newBases = [...currentBases];
//     newBases[cycleIndex] = Number(value) || 0;
//     setCurrentBases(newBases);
//   };

//   const advanceToNextCycle = () => {
//     if (currentBases.length < 3) {
//       setCurrentBases([...currentBases, currentBases[currentBases.length - 1]]);
//     }
//   };

//   const removeLastCycle = () => {
//     if (currentBases.length > 1) {
//       setCurrentBases(currentBases.slice(0, -1));
//     }
//   };

//   // --- Session Metadata Actions (Done & Remarks) ---
//   const toggleCompletion = (metaKey) => {
//     const current = sessionMetadata[metaKey] || { completed: false, remark: '' };
//     setSessionMetadata({ ...sessionMetadata, [metaKey]: { ...current, completed: !current.completed } });
//   };

//   const startEditingRemark = (metaKey, currentRemark) => {
//     setTempRemark(currentRemark || '');
//     setActiveRemarkId(metaKey);
//   };

//   const saveRemark = (metaKey) => {
//     const current = sessionMetadata[metaKey] || { completed: false, remark: '' };
//     setSessionMetadata({ ...sessionMetadata, [metaKey]: { ...current, remark: tempRemark.trim() } });
//     setActiveRemarkId(null);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
//       {/* Lift Selector & Bases */}
//       <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
//         <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
//           {['Bench Press', 'Deadlift'].map(lift => (
//             <button 
//               key={lift} 
//               className={`btn ${activeLift === lift ? 'btn-primary' : ''}`}
//               onClick={() => setActiveLift(lift)}
//               style={{ flex: 1 }}
//             >
//               {lift}
//             </button>
//           ))}
//         </div>

//         {/* Dynamic Cycle Inputs */}
//         <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
//           {currentBases.map((base, i) => (
//             <div key={i} className="input-group" style={{ flex: '1 1 200px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cycle {i + 1} Base 1RM (kg)</label>
                
//                 {i > 0 && i === currentBases.length - 1 && (
//                   <button className="btn-icon" onClick={removeLastCycle} style={{ padding: '0 4px', height: 'auto' }} title="Remove this cycle">
//                     <Trash2 size={14} color="var(--accent-pink)" />
//                   </button>
//                 )}
//               </div>
//               <input type="number" className="input" value={base === 0 ? '' : base} onChange={(e) => handleBaseChange(i, e.target.value)} step="2.5" />
//             </div>
//           ))}
          
//           {currentBases.length < 3 && (
//             <button className="btn btn-primary" onClick={advanceToNextCycle} style={{ flex: '0 0 auto', height: '38px' }}>
//               <Plus size={16} /> Log PR (Start Cycle {currentBases.length + 1})
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Generated Sequence */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
//         <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Generated Sequence</h3>
        
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
//           {sessions.map((session) => {
//             const metaKey = `${activeLift}-S${session.globalSession}`;
//             const meta = sessionMetadata[metaKey] || { completed: false, remark: '' };

//             return (
//               <div key={session.globalSession} className="card" style={{ padding: 'var(--space-md)', borderTop: `3px solid ${session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)'}` }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
//                   <div>
//                     <div style={{ fontWeight: 700 }}>Session {session.globalSession}</div>
//                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{session.phase}</div>
//                   </div>
//                   <div style={{ textAlign: 'right' }}>
//                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cycle {session.cycle}</div>
//                     <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Base: {session.base1RM}kg</div>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                   {session.prescriptions.map((p, i) => (
//                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
//                       <span>
//                         <strong>{p.sets}</strong> × <strong>{p.reps}</strong> 
//                         <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '4px' }}>@ {Math.round(p.pct * 100)}%</span>
//                         {p.isTarget && <span style={{ color: 'var(--accent-emerald)', fontSize: '0.75rem', marginLeft: '8px' }}>(Target PR)</span>}
//                         {p.isReach && <span style={{ color: 'var(--accent-amber)', fontSize: '0.75rem', marginLeft: '8px' }}>(Reach)</span>}
//                       </span>
//                       <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.rawLoad.toFixed(1)}</span>
//                         <strong style={{ color: session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)' }}>{p.roundedLoad} kg</strong>
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* NEW: Action Bar (Done & Remark) */}
//                 <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <button 
//                       className="btn" 
//                       onClick={() => toggleCompletion(metaKey)} 
//                       style={{ color: meta.completed ? 'var(--accent-emerald)' : 'var(--text-muted)', padding: '4px 8px' }}
//                     >
//                       {meta.completed ? <CheckSquare size={18} /> : <Square size={18} />} 
//                       <span style={{ marginLeft: '6px' }}>{meta.completed ? 'Completed' : 'Mark Done'}</span>
//                     </button>
                    
//                     <button className="btn-icon" onClick={() => startEditingRemark(metaKey, meta.remark)} title="Add Remark">
//                       <Edit2 size={16} />
//                     </button>
//                   </div>

//                   {/* Remark Editor or Display */}
//                   {activeRemarkId === metaKey ? (
//                     <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
//                       <input 
//                         className="input" 
//                         value={tempRemark} 
//                         onChange={e => setTempRemark(e.target.value)} 
//                         placeholder="How did it feel?" 
//                         style={{ flex: 1, fontSize: '0.85rem', padding: '6px 12px' }} 
//                         autoFocus 
//                         onKeyDown={(e) => { if (e.key === 'Enter') saveRemark(metaKey); }}
//                       />
//                       <button className="btn btn-primary" onClick={() => saveRemark(metaKey)} style={{ padding: '0 var(--space-sm)' }}>
//                         <Check size={16} />
//                       </button>
//                     </div>
//                   ) : meta.remark ? (
//                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
//                       "{meta.remark}"
//                     </div>
//                   ) : null}
//                 </div>

//               </div>
//             );
//           })}
//         </div>
//       </div>

//     </div>
//   );
// }

// export default function Gym() {
//   const tabs = [
//     { label: 'Regular', content: <RegularGymTab /> },
//     { label: 'Powerlifting', content: <PowerliftingTab /> }
//   ];

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
//         <Dumbbell size={28} color="var(--accent-pink)" />
//         <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Gym & Powerlifting</h1>
//       </div>
      
//       <div style={{ flex: 1 }}>
//         <Tabs tabs={tabs} defaultTab={0} />
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Dumbbell, Plus, Trash2, CheckSquare, Square, XSquare, Edit2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Tabs from '../components/shared/Tabs';
import { generateFullDUP } from '../utils/PowerliftingEngine';
import { supabase } from '../supabaseClient';

// --- WEEKLY SCHEDULE TAB (VERTICAL ACCORDION) ---
function WeeklyScheduleTab({ schedule, updateSchedule }) {
  // Default to keeping the first day open
  const [expandedDayId, setExpandedDayId] = useState(1);

  // Always applied to the LATEST schedule inside the parent, never to a stale prop
  const patchDay = (dayId, fn) =>
    updateSchedule(prev => (prev || []).map(d => (d.id === dayId ? fn(d) : d)));

  const addExercise = (day) => {
    const newEx = { id: crypto.randomUUID(), name: '', sets: 3, reps: '10', weight: 0, completed: false, note: '' };
    patchDay(day.id, d => ({ ...d, exercises: [...(d.exercises || []), newEx] }));
  };

  const updateExercise = (day, exId, field, value) => {
    patchDay(day.id, d => ({
      ...d,
      exercises: (d.exercises || []).map(ex => (ex.id === exId ? { ...ex, [field]: value } : ex))
    }));
  };

  const deleteExercise = (day, exId) => {
    patchDay(day.id, d => ({ ...d, exercises: (d.exercises || []).filter(ex => ex.id !== exId) }));
  };

  // used by the rename input
  const renameDay = (day, title) => patchDay(day.id, d => ({ ...d, title }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {schedule.map(day => {
        const isExpanded = expandedDayId === day.id;
        return (
          <div key={day.id} className="card" style={{ padding: 0, overflow: 'hidden', border: isExpanded ? '1px solid var(--accent-blue)' : '1px solid rgba(255,255,255,0.05)', transition: 'border 0.2s ease' }}>
            
            {/* Accordion Header */}
            <div 
              onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
              style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isExpanded ? 'var(--accent-blue)' : 'var(--text-main)' }}>
                  {day.title || `Day ${day.id}`}
                </span>
                {(!day.exercises || day.exercises.length === 0) && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Rest / Empty</span>
                )}
              </div>
              {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
            </div>

            {/* Accordion Content */}
            {isExpanded && (
              <div style={{ padding: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-panel)' }}>
                
                {/* Editable Title & Add Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '10px' }}>
                  <input 
                    value={day.title}
                    onChange={(e) => renameDay(day, e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold', outline: 'none', width: '100%', maxWidth: '250px', paddingBottom: '4px' }}
                    placeholder="Rename this day..."
                  />
                  <button className="btn btn-primary" onClick={() => addExercise(day)}><Plus size={16} /> Add Exercise</button>
                </div>

                {/* Exercise List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {(!day.exercises || day.exercises.length === 0) && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-md) 0' }}>No exercises scheduled.</p>
                  )}
                  
                  {(day.exercises || []).map((ex) => (
                    <div key={ex.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 'var(--space-md)', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', border: ex.completed ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                        <button className="btn-icon" onClick={() => updateExercise(day, ex.id, 'completed', !ex.completed)} style={{ marginTop: '2px' }}>
                          {ex.completed ? <CheckSquare size={22} color="var(--accent-emerald)" /> : <Square size={22} color="var(--text-muted)" />}
                        </button>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input className="input" value={ex.name} onChange={(e) => updateExercise(day, ex.id, 'name', e.target.value)} placeholder="Exercise Name" style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '1.1rem', fontWeight: 600 }} />
                          
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sets</span>
                              <input type="number" className="input" value={ex.sets} onChange={(e) => updateExercise(day, ex.id, 'sets', e.target.value)} style={{ width: '45px', padding: '4px 8px' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reps</span>
                              <input type="text" className="input" value={ex.reps} onChange={(e) => updateExercise(day, ex.id, 'reps', e.target.value)} style={{ width: '65px', padding: '4px 8px' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kg</span>
                              <input type="number" className="input" value={ex.weight} onChange={(e) => updateExercise(day, ex.id, 'weight', e.target.value)} style={{ width: '55px', padding: '4px 8px' }} />
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button className="btn-icon" onClick={() => deleteExercise(day, ex.id)}><Trash2 size={18} color="var(--accent-pink)" /></button>
                        </div>
                      </div>

                      {/* Note Section attached to DB */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginLeft: '34px', marginTop: '4px' }}>
                        <Edit2 size={14} color="var(--text-muted)" style={{ marginTop: '6px' }} />
                        <input 
                          className="input" 
                          value={ex.note || ''} 
                          onChange={(e) => updateExercise(day, ex.id, 'note', e.target.value)} 
                          placeholder="Add a note (e.g., Felt heavy, up the weight next time)" 
                          style={{ background: 'transparent', border: 'none', padding: '4px', fontSize: '0.85rem', color: 'var(--accent-amber)', flex: 1, fontStyle: 'italic' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- POWERLIFTING TAB (MOBILE RESPONSIVE UPDATE) ---
function PowerliftingTab({ pState, updatePState }) {
  const { activeLift } = pState;
  const benchBases = pState.benchBases || [100];
  const deadliftBases = pState.deadliftBases || [140];
  const sessionMetadata = pState.sessionMetadata || {};
  const currentBases = activeLift === 'Bench Press' ? benchBases : deadliftBases;

  // Accepts either a new array or (prevArray => newArray). Touches ONLY the active lift's bases.
  const setCurrentBases = (valueOrFn) => {
    updatePState(p => {
      const key = p.activeLift === 'Bench Press' ? 'benchBases' : 'deadliftBases';
      const prev = p[key] || [];
      const next = typeof valueOrFn === 'function' ? valueOrFn(prev) : valueOrFn;
      return { ...p, [key]: next };
    });
  };

  const sessions = useMemo(() => generateFullDUP(activeLift, currentBases), [activeLift, currentBases]);

  const [activeRemarkId, setActiveRemarkId] = useState(null);
  const [tempRemark, setTempRemark] = useState('');

  // `updates` can be an object, or (currentMeta => object) when it depends on the current value
  const updateSessionMeta = (metaKey, updates) => {
    updatePState(p => {
      const sm = p.sessionMetadata || {};
      const current = sm[metaKey] || { completed: false, remark: '', setsStatus: [] };
      const patch = typeof updates === 'function' ? updates(current) : updates;
      return { ...p, sessionMetadata: { ...sm, [metaKey]: { ...current, ...patch } } };
    });
  };

  const toggleSetStatus = (metaKey, setIndex, totalSets) => {
    updateSessionMeta(metaKey, (current) => {
      const newSets = [...(current.setsStatus || [])];
      while (newSets.length < totalSets) newSets.push(null);

      if (newSets[setIndex] === null || newSets[setIndex] === undefined) newSets[setIndex] = true;
      else if (newSets[setIndex] === true) newSets[setIndex] = false;
      else newSets[setIndex] = null;

      return { setsStatus: newSets };
    });
  };

  const handleMarkDone = (metaKey, totalSets) => {
    updateSessionMeta(metaKey, (current) => {
      const currentSets = [...(current.setsStatus || [])];
      while (currentSets.length < totalSets) currentSets.push(null);
      const hasAnyChecks = currentSets.some(s => s === true);

      const newSets = currentSets.map(status =>
        hasAnyChecks ? (status === null || status === undefined ? false : status) : true
      );
      return { completed: true, setsStatus: newSets };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* Lift Selector & Bases */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {['Bench Press', 'Deadlift'].map(lift => (
            <button key={lift} className={`btn ${activeLift === lift ? 'btn-primary' : ''}`} onClick={() => updatePState(p => ({ ...p, activeLift: lift }))} style={{ flex: 1 }}>
              {lift}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {currentBases.map((base, i) => (
            <div key={i} className="input-group" style={{ flex: '1 1 140px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Cycle {i + 1} Base</label>
                {i > 0 && i === currentBases.length - 1 && (
                  <button className="btn-icon" onClick={() => setCurrentBases(currentBases.slice(0, -1))} style={{ padding: '0 4px', height: 'auto' }}><Trash2 size={14} color="var(--accent-pink)" /></button>
                )}
              </div>
              <input type="number" className="input" value={base === 0 ? '' : base} onChange={(e) => { const nb = [...currentBases]; nb[i] = Number(e.target.value)||0; setCurrentBases(nb); }} step="2.5" />
            </div>
          ))}
          {currentBases.length < 3 && (
            <button className="btn btn-primary" onClick={() => setCurrentBases([...currentBases, currentBases[currentBases.length - 1]])} style={{ flex: '1 1 140px', height: '38px', justifyContent: 'center' }}>
              <Plus size={16} /> Add Cycle
            </button>
          )}
        </div>
      </div>

      {/* Generated Sequence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {/* USING A FLUID MIN-WIDTH TO PREVENT OVERFLOW ON PHONES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-md)' }}>
          
          {sessions.map((session, index) => {
            const metaKey = `${activeLift}-S${session.globalSession}`;
            const meta = sessionMetadata[metaKey] || { completed: false, remark: '', setsStatus: [] };
            const totalSetsInSession = session.prescriptions.reduce((sum, p) => sum + parseInt(p.sets), 0);
            
            // Identify if this is the final card
            const isLastCard = index === sessions.length - 1;

            return (
              <div key={session.globalSession} className="card" style={{ 
                padding: 'var(--space-md)', 
                borderTop: `3px solid ${session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)'}`,
                marginBottom: isLastCard ? '80px' : '0'
              }}>
                {/* Responsive Header ensures Base kg never gets cut off */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)', gap: '10px' }}>
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Session {session.globalSession}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.phase}</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cycle {session.cycle}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Base: {session.base1RM}kg</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(() => {
                    let globalSetCounter = 0;
                    return session.prescriptions.map((p, pIndex) => (
                      <div key={pIndex} style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span>
                            <strong>{p.sets}</strong> × <strong>{p.reps}</strong> 
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '4px' }}>@ {Math.round(p.pct * 100)}%</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: session.type === 'heavy' ? 'var(--accent-pink)' : 'var(--accent-blue)' }}>{p.roundedLoad} kg</strong>
                          </span>
                        </div>
                        
                        {/* Slightly Larger Touch Targets for Checkboxes on Mobile */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {Array.from({ length: parseInt(p.sets) }).map((_, setIdx) => {
                            const currentIndex = globalSetCounter++;
                            const status = (meta.setsStatus || [])[currentIndex];
                            
                            return (
                              <button 
                                key={currentIndex}
                                onClick={() => toggleSetStatus(metaKey, currentIndex, totalSetsInSession)}
                                style={{
                                  width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                  backgroundColor: status === true ? 'var(--accent-emerald)' : status === false ? 'var(--accent-pink)' : 'rgba(255,255,255,0.1)',
                                  color: 'white',
                                  transition: 'background-color 0.15s ease'
                                }}
                              >
                                {status === true ? <Check size={18} /> : status === false ? <XSquare size={18} /> : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Action Bar (Done & Remark) */}
                <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      className="btn" 
                      onClick={() => meta.completed ? updateSessionMeta(metaKey, { completed: false }) : handleMarkDone(metaKey, totalSetsInSession)} 
                      style={{ color: meta.completed ? 'var(--accent-emerald)' : 'var(--text-muted)', padding: '6px 12px', fontWeight: meta.completed ? 'bold' : 'normal' }}
                    >
                      {meta.completed ? <CheckSquare size={18} /> : <Square size={18} />} 
                      <span style={{ marginLeft: '6px' }}>{meta.completed ? 'Completed' : 'Mark Done'}</span>
                    </button>
                    
                    <button className="btn-icon" onClick={() => { setTempRemark(meta.remark || ''); setActiveRemarkId(metaKey); }} title="Add Remark">
                      <Edit2 size={16} />
                    </button>
                  </div>

                  {activeRemarkId === metaKey ? (
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <input 
                        className="input" value={tempRemark} onChange={e => setTempRemark(e.target.value)} 
                        placeholder="How did it feel?" style={{ flex: 1, fontSize: '0.85rem', padding: '6px 12px' }} autoFocus 
                        onKeyDown={(e) => { if (e.key === 'Enter') { updateSessionMeta(metaKey, { remark: tempRemark }); setActiveRemarkId(null); } }}
                      />
                      <button className="btn btn-primary" onClick={() => { updateSessionMeta(metaKey, { remark: tempRemark }); setActiveRemarkId(null); }} style={{ padding: '0 var(--space-sm)' }}>
                        <Check size={16} />
                      </button>
                    </div>
                  ) : meta.remark ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--text-muted)' }}>
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

// --- MAIN PARENT COMPONENT ---
const SAVE_DEBOUNCE_MS = 600;
const RETRY_DELAY_MS = 3000;

const DEFAULT_SCHEDULE = [
  { id: 1, title: 'Day 1 - Chest & Tris', exercises: [] },
  { id: 2, title: 'Day 2 - Back & Bis', exercises: [] },
  { id: 3, title: 'Day 3 - Legs', exercises: [] },
  { id: 4, title: 'Day 4 - Rest', exercises: [] },
  { id: 5, title: 'Day 5 - Upper', exercises: [] },
  { id: 6, title: 'Day 6 - Lower', exercises: [] },
  { id: 7, title: 'Day 7 - Weak Points', exercises: [] }
];

const DEFAULT_POWERLIFTING = {
  activeLift: 'Bench Press',
  benchBases: [100],
  deadliftBases: [140],
  sessionMetadata: {}
};

// Fill in anything missing so a half-empty DB row can never crash or wipe a lift
const normalizeRow = (row) => ({
  ...row,
  weekly_schedule: Array.isArray(row.weekly_schedule) && row.weekly_schedule.length
    ? row.weekly_schedule
    : DEFAULT_SCHEDULE,
  powerlifting_data: { ...DEFAULT_POWERLIFTING, ...(row.powerlifting_data || {}) }
});

export default function Gym() {
  const [gymData, setGymData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error

  const stateRef = useRef(null);     // ALWAYS the latest data (source of truth for updates)
  const rowIdRef = useRef(null);
  const pendingRef = useRef({});     // columns waiting to be written
  const timerRef = useRef(null);
  const savingRef = useRef(false);   // writes are serialized
  const initRef = useRef(false);     // blocks StrictMode double-run (duplicate rows)
  const mountedRef = useRef(true);

  const adoptRow = useCallback((row) => {
    const clean = normalizeRow(row);
    rowIdRef.current = clean.id;
    stateRef.current = clean;
    if (mountedRef.current) setGymData(clean);
  }, []);

  // ---------- LOAD ----------
  const fetchGymData = useCallback(async () => {
    setLoadError(null);

    const { data, error } = await supabase
      .from('gym_state')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();

    // A failed fetch must never fall through to creating a new row
    if (error) {
      console.error('Database Fetch Error:', error);
      if (mountedRef.current) setLoadError(error.message || 'Could not load gym data.');
      return;
    }

    if (data) {
      adoptRow(data);
      // If we had to fill in missing keys, persist the repaired version once
      const fixed = normalizeRow(data);
      if (JSON.stringify(fixed.powerlifting_data) !== JSON.stringify(data.powerlifting_data) ||
          JSON.stringify(fixed.weekly_schedule) !== JSON.stringify(data.weekly_schedule)) {
        pendingRef.current = { weekly_schedule: fixed.weekly_schedule, powerlifting_data: fixed.powerlifting_data };
        flushSavesRef.current();
      }
      return;
    }

    console.log('No data found for this user, building fresh template...');
    const { data: newData, error: insertError } = await supabase
      .from('gym_state')
      .insert([{
        id: Math.floor(Math.random() * 10000000),
        weekly_schedule: DEFAULT_SCHEDULE,
        powerlifting_data: DEFAULT_POWERLIFTING
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Database Insert Error:', insertError);
      if (mountedRef.current) setLoadError(insertError.message || 'Could not create gym data.');
      return;
    }
    adoptRow(newData);
  }, [adoptRow]);

  // ---------- SAVE (debounced, serialized, per column, auto-retry) ----------
  const flushSavesRef = useRef(() => {});

  const flushSaves = useCallback(async () => {
    clearTimeout(timerRef.current);
    if (savingRef.current) return;                      // running loop will pick up new changes
    if (rowIdRef.current === null) return;
    if (Object.keys(pendingRef.current).length === 0) return;

    savingRef.current = true;
    if (mountedRef.current) setSaveStatus('saving');

    try {
      while (Object.keys(pendingRef.current).length > 0) {
        const batch = pendingRef.current;
        pendingRef.current = {};

        const { error } = await supabase
          .from('gym_state')
          .update(batch)
          .eq('id', rowIdRef.current);

        if (error) {
          pendingRef.current = { ...batch, ...pendingRef.current }; // keep, never overwrite newer
          throw error;
        }
      }
      if (mountedRef.current) setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to save gym data:', err);
      if (mountedRef.current) setSaveStatus('error');
      timerRef.current = setTimeout(() => flushSavesRef.current(), RETRY_DELAY_MS);
    } finally {
      savingRef.current = false;
    }
  }, []);
  flushSavesRef.current = flushSaves;

  // ---------- THE CORE FIX: apply updates to the LATEST data ----------
  // `updater` is either a new value or (prevValue => newValue).
  const applyUpdate = useCallback((column, updater) => {
    const latest = stateRef.current;
    if (!latest) return;

    const nextValue = typeof updater === 'function' ? updater(latest[column]) : updater;
    const next = { ...latest, [column]: nextValue };
    stateRef.current = next;          // synchronous, so two quick taps never see old data
    setGymData(next);                 // instant UI

    pendingRef.current = { ...pendingRef.current, [column]: nextValue };
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flushSaves, SAVE_DEBOUNCE_MS);
  }, [flushSaves]);

  const updateWeeklySchedule = useCallback((updater) => applyUpdate('weekly_schedule', updater), [applyUpdate]);
  const updatePowerliftingState = useCallback((updater) => applyUpdate('powerlifting_data', updater), [applyUpdate]);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    mountedRef.current = true;
    if (!initRef.current) {
      initRef.current = true;
      fetchGymData();
    }
    return () => { mountedRef.current = false; };
  }, [fetchGymData]);

  // Flush pending edits when the tab is hidden / page closes / component unmounts
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') flushSaves(); };
    const onPageHide = () => flushSaves();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      flushSaves();
    };
  }, [flushSaves]);

  // ---------- RENDER ----------
  if (loadError) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'center' }}>
        <div>Couldn't load your gym data: {loadError}</div>
        <button className="btn btn-primary" onClick={fetchGymData}>Try again</button>
      </div>
    );
  }

  if (!gymData) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)' }}>Loading Secure Gym Data...</div>;
  }

  const tabs = [
    { label: 'Weekly Plan', content: <WeeklyScheduleTab schedule={gymData.weekly_schedule} updateSchedule={updateWeeklySchedule} /> },
    { label: 'Powerlifting (DUP)', content: <PowerliftingTab pState={gymData.powerlifting_data} updatePState={updatePowerliftingState} /> }
  ];

  const statusLabel = { saving: 'Saving…', saved: 'Saved', error: 'Save failed, retrying…' }[saveStatus];
  const statusColor = saveStatus === 'error' ? 'var(--accent-pink)' : saveStatus === 'saved' ? 'var(--accent-emerald)' : 'var(--text-muted)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Dumbbell size={28} color="var(--accent-pink)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Gym Command</h1>
        {statusLabel && (
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: statusColor }}>{statusLabel}</span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
}