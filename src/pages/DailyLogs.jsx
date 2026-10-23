import React, { useState, useEffect, useRef } from 'react';
import { Activity, Plus, Trash2, ChevronUp, ChevronDown, Flame } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function DailyLogs() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [dates, setDates] = useState([]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const generatedDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(2026, 9, 17);
    startDate.setHours(0, 0, 0, 0);

    let current = new Date(startDate);
    
    if (today < startDate) {
      current = new Date(today);
    }

    while (current <= today) {
      const tzOffset = current.getTimezoneOffset() * 60000;
      const localISOTime = new Date(current.getTime() - tzOffset).toISOString().split('T')[0];
      generatedDates.push(localISOTime);
      current.setDate(current.getDate() + 1);
    }

    if (generatedDates.length > 45) {
      setDates(generatedDates.slice(-45));
    } else {
      setDates(generatedDates);
    }
  }, []);

  useEffect(() => {
    if (dates.length > 0) {
      fetchHabits();
    }
  }, [dates]);

  // THE FIX: Dedicated listener that waits for the DOM to paint, then snaps to the far right (Today)
  useEffect(() => {
    if (dates.length > 0 && scrollRef.current) {
      const scrollTimer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [habits, dates]);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error("Error fetching habits:", error);
      return;
    }

    if (data) {
      const todayStr = dates[dates.length - 1];
      let needsDbUpdate = false;

      const processedHabits = data.map(habit => {
        let logs = { ...(habit.logs || {}) };
        let changed = false;

        dates.forEach(d => {
          if (d < todayStr && !logs[d]) {
            logs[d] = 'red';
            changed = true;
          }
        });

        if (changed) {
          needsDbUpdate = true;
          supabase.from('habits').update({ logs }).eq('id', habit.id).then();
        }
        return { ...habit, logs };
      });

      setHabits(processedHabits);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newIndex = habits.length > 0 ? Math.max(...habits.map(h => h.order_index)) + 1 : 0;

    const { data } = await supabase
      .from('habits')
      .insert([{ name: newHabitName.trim(), order_index: newIndex, logs: {} }])
      .select();

    if (data) {
      setHabits([...habits, data[0]]);
      setNewHabitName('');
    }
  };

  const deleteHabit = async (id) => {
    if(window.confirm('Delete this habit history?')) {
      await supabase.from('habits').delete().eq('id', id);
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const toggleStatus = async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    const currentStatus = habit.logs[date];
    
    let newStatus = 'green';
    if (currentStatus === 'green') newStatus = 'red';
    else if (currentStatus === 'red') newStatus = null;

    const newLogs = { ...habit.logs, [date]: newStatus };
    if (newStatus === null) delete newLogs[date];

    setHabits(habits.map(h => h.id === habitId ? { ...h, logs: newLogs } : h));
    await supabase.from('habits').update({ logs: newLogs }).eq('id', habitId);
  };

  const moveHabit = async (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === habits.length - 1) return;

    const newHabits = [...habits];
    const temp = newHabits[index];
    newHabits[index] = newHabits[index + direction];
    newHabits[index + direction] = temp;

    const updatedHabits = newHabits.map((h, i) => ({ ...h, order_index: i }));
    setHabits(updatedHabits);

    updatedHabits.forEach(async (h) => {
      await supabase.from('habits').update({ order_index: h.order_index }).eq('id', h.id);
    });
  };

  const calculateStreak = (logs) => {
    let streak = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      if (logs[dates[i]] === 'green') {
        streak++;
      } else if (logs[dates[i]] === 'red') {
        break; 
      }
    }
    return streak;
  };

  const getGraphData = () => {
    if (habits.length === 0) return dates.map(() => 0);
    return dates.map(date => {
      const greens = habits.filter(h => h.logs[date] === 'green').length;
      return (greens / habits.length) * 100; 
    });
  };

  const graphData = getGraphData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', minHeight: '100%', paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Activity size={28} color="var(--accent-emerald)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Daily Logs</h1>
      </div>

      <form onSubmit={handleAddHabit} style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%' }}>
        <input 
          className="input" 
          placeholder="New habit (e.g. Icebath, Meditate)..." 
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div ref={scrollRef} style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px', width: '100%' }}>
          <table style={{ width: 'max-content', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'var(--bg-panel)', padding: 'var(--space-sm)', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)', minWidth: '140px', maxWidth: '160px', boxShadow: '2px 0 5px rgba(0,0,0,0.2)' }}>
                  Habit
                </th>
                {dates.map((date, i) => {
                  const d = new Date(date);
                  const isToday = i === dates.length - 1;
                  return (
                    <th key={date} style={{ padding: 'var(--space-sm) 4px', minWidth: '42px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: isToday ? 'bold' : 'normal', color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                      <div style={{ fontSize: '0.7rem' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.9rem' }}>{d.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, index) => {
                const streak = calculateStreak(habit.logs);
                return (
                  <tr key={habit.id}>
                    <td style={{ position: 'sticky', left: 0, zIndex: 10, backgroundColor: 'var(--bg-panel)', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', boxShadow: '2px 0 5px rgba(0,0,0,0.2)', minWidth: '140px', maxWidth: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                          <button className="btn-icon" onClick={() => moveHabit(index, -1)} style={{ padding: 0 }}><ChevronUp size={14} color="var(--text-muted)"/></button>
                          <button className="btn-icon" onClick={() => moveHabit(index, 1)} style={{ padding: 0 }}><ChevronDown size={14} color="var(--text-muted)"/></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }} title={habit.name}>
                            {habit.name}
                          </span>
                          {streak > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-amber)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              <Flame size={12} fill="var(--accent-amber)" /> {streak}
                            </div>
                          )}
                        </div>
                        <button className="btn-icon" onClick={() => deleteHabit(habit.id)} style={{ padding: '2px', flexShrink: 0 }}>
                          <Trash2 size={14} color="var(--text-muted)" />
                        </button>
                      </div>
                    </td>

                    {dates.map(date => {
                      const status = habit.logs[date];
                      let bgColor = 'rgba(255,255,255,0.05)';
                      if (status === 'green') bgColor = 'var(--accent-emerald)';
                      if (status === 'red') bgColor = 'var(--accent-pink)';

                      return (
                        <td key={date} style={{ textAlign: 'center', padding: '4px', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <div 
                            onClick={() => toggleStatus(habit.id, date)}
                            style={{
                              width: '24px', 
                              height: '24px', 
                              margin: '0 auto',
                              borderRadius: '6px',
                              backgroundColor: bgColor,
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              boxShadow: status === 'green' ? '0 0 8px rgba(52, 211, 153, 0.4)' : status === 'red' ? '0 0 8px rgba(2fb, 113, 133, 0.4)' : 'none'
                            }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 var(--space-md) 0', fontSize: '1.2rem' }}>Performance Overview</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '2px', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {graphData.map((percentage, i) => {
            const isToday = i === graphData.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%', group: 'hover' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${Math.max(percentage, 2)}%`, 
                    backgroundColor: percentage > 75 ? 'var(--accent-emerald)' : percentage > 40 ? 'var(--accent-amber)' : 'var(--accent-pink)',
                    opacity: isToday ? 1 : 0.7,
                    borderTopLeftRadius: '2px',
                    borderTopRightRadius: '2px',
                    transition: 'height 0.3s ease'
                  }} 
                  title={`${dates[i]}: ${Math.round(percentage)}% Complete`}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{new Date(dates[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          <span>Today</span>
        </div>
      </div>

    </div>
  );
}