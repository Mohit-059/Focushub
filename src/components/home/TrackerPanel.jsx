import React, { useState, useEffect } from 'react';
import Tabs from '../shared/Tabs';
import { supabase } from '../../supabaseClient';
import { Calendar, Activity, Target, Plus, Trash2, Bell, CheckSquare, Square, AlignLeft } from 'lucide-react';

function DeadlinesTab() {
  const [deadlines, setDeadlines] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ name: '', note: '', start: '', target: '' });

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_type', 'deadline')
      .order('deadline', { ascending: true });
    if (data) setDeadlines(data);
  };

  const calculateDays = (start, target) => {
    if (!start || !target) return { total: 0, elapsed: 0, remaining: 0 };
    const startDate = new Date(start);
    const targetDate = new Date(target);
    const today = new Date();
    
    const totalDays = Math.max(1, Math.ceil((targetDate - startDate) / (1000 * 60 * 60 * 24)));
    let elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    if (elapsedDays < 0) elapsedDays = 0;
    if (elapsedDays > totalDays) elapsedDays = totalDays;
    
    return { total: totalDays, elapsed: elapsedDays, remaining: totalDays - elapsedDays };
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDeadline.name || !newDeadline.start || !newDeadline.target) return;
    
    const { data } = await supabase
      .from('tasks')
      .insert([{ 
        title: newDeadline.name, 
        note: newDeadline.note,
        start_date: newDeadline.start, 
        deadline: newDeadline.target,
        task_type: 'deadline'
      }])
      .select();

    if (data) {
      setDeadlines(prev => [...prev, data[0]].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      setIsAdding(false);
      setNewDeadline({ name: '', note: '', start: '', target: '' });
    }
  };

  const removeDeadline = async (id) => {
    if(window.confirm('Delete this deadline?')) {
      await supabase.from('tasks').delete().eq('id', id);
      setDeadlines(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--text-main)' }}>Active Deadlines</h4>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
          <Plus size={16} /> Add
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', backgroundColor: 'rgba(255,255,255,0.03)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}>
          <input className="input" placeholder="Deadline Name (e.g. PySpark)" value={newDeadline.name} onChange={e => setNewDeadline({...newDeadline, name: e.target.value})} required />
          
          <textarea 
            className="input" 
            placeholder="Add a description or note..." 
            value={newDeadline.note} 
            onChange={e => setNewDeadline({...newDeadline, note: e.target.value})} 
            style={{ resize: 'vertical', minHeight: '60px', fontFamily: 'inherit', fontSize: '0.85rem' }} 
          />

          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start Date</label>
              <input type="date" className="input" style={{ width: '100%' }} value={newDeadline.start} onChange={e => setNewDeadline({...newDeadline, start: e.target.value})} required />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Date</label>
              <input type="date" className="input" style={{ width: '100%' }} value={newDeadline.target} onChange={e => setNewDeadline({...newDeadline, target: e.target.value})} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save Deadline</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', overflowY: 'auto', maxHeight: '300px', paddingRight: '5px' }}>
        {deadlines.length === 0 && !isAdding && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-lg) 0' }}>No active deadlines tracked.</p>
        )}
        
        {deadlines.map(item => {
          const { total, elapsed, remaining } = calculateDays(item.start_date, item.deadline);
          return (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
                  {item.note && (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <AlignLeft size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.4 }}>{item.note}</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{elapsed} / {total} days</span>
                  <button className="btn-icon" onClick={() => removeDeadline(item.id)} style={{ padding: 0 }}><Trash2 size={14}/></button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: i < elapsed ? 'var(--accent-pink)' : 'rgba(255,255,255,0.2)',
                    boxShadow: i < elapsed ? '0 0 5px rgba(255, 0, 127, 0.5)' : 'none'
                  }} title={`Day ${i + 1}`} />
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>
                {remaining} days remaining
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- REMINDERS TAB ---
function RemindersTab({ todaysTasks, toggleTask, deleteTask }) {
  if (!todaysTasks || todaysTasks.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl) 0', color: 'var(--text-muted)' }}>
        <Bell size={40} style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }} />
        <h4 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>No Reminders</h4>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', maxWidth: '80%' }}>You have no events or deadlines scheduled for today. You're clear.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <h4 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--text-main)' }}>Today's Agenda</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '300px', paddingRight: '5px' }}>
        {todaysTasks.map(task => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-amber)', opacity: task.is_completed ? 0.6 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
               <button className="btn-icon" onClick={() => toggleTask(task.id, task.is_completed)} style={{ padding: 0, marginTop: '2px' }}>
                 {task.is_completed ? <CheckSquare size={18} color="var(--accent-emerald)"/> : <Square size={18} color="var(--text-muted)"/>}
               </button>
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ fontWeight: 600, color: task.is_completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.is_completed ? 'line-through' : 'none' }}>
                   {task.title}
                 </span>
                 {task.note && (
                   <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginTop: '4px', color: 'var(--accent-amber)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                     <AlignLeft size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                     <span style={{ lineHeight: 1.4 }}>{task.note}</span>
                   </div>
                 )}
               </div>
            </div>
            <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ padding: 0 }}>
              <Trash2 size={16} color="var(--text-muted)" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderTab({ icon: Icon, title, message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl) 0', color: 'var(--text-muted)' }}>
      <Icon size={40} style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }} />
      <h4 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{title}</h4>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', maxWidth: '80%' }}>{message}</p>
    </div>
  );
}

// --- MAIN PANEL ---
export default function TrackerPanel() {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    fetchTodaysReminders();
  }, []);

  const fetchTodaysReminders = async () => {
    const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('deadline', todayStr)
      .order('is_completed', { ascending: true });
      
    if (data) {
      setTodaysTasks(data);
      const uncompleted = data.filter(t => !t.is_completed);
      setHasNotification(uncompleted.length > 0);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const { data } = await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id).select();
    if (data) {
      const updated = todaysTasks.map(t => t.id === id ? data[0] : t).sort((a, b) => a.is_completed - b.is_completed);
      setTodaysTasks(updated);
      setHasNotification(updated.some(t => !t.is_completed));
    }
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    const updated = todaysTasks.filter(t => t.id !== id);
    setTodaysTasks(updated);
    setHasNotification(updated.some(t => !t.is_completed));
  };

  const RemindersLabel = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
      Reminders
      {hasNotification && (
        <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-pink)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-pink)', display: 'inline-block' }}></span>
      )}
    </div>
  );

  const tabs = [
    { label: 'Deadlines', content: <DeadlinesTab /> },
    { label: RemindersLabel, content: <RemindersTab todaysTasks={todaysTasks} toggleTask={toggleTask} deleteTask={deleteTask} /> },
    { label: 'Focus', content: <PlaceholderTab icon={Target} title="Focus Sessions" message="Recorded focus session metrics will appear here once the Focus Timer engine is implemented." /> }
  ];

  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <Tabs tabs={tabs} defaultTab={0} />
    </div>
  );
}