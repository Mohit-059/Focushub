import React, { useState, useEffect } from 'react';
import Tabs from '../shared/Tabs';
import { supabase } from '../../supabaseClient';
import { Calendar, Brain, Activity, Target, Plus, Trash2 } from 'lucide-react';

function DeadlinesTab() {
  const [deadlines, setDeadlines] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ name: '', start: '', target: '' });

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
        start_date: newDeadline.start, 
        deadline: newDeadline.target,
        task_type: 'deadline'
      }])
      .select();

    if (data) {
      setDeadlines(prev => [...prev, data[0]].sort((a, b) => new Date(a.deadline) - new Date(b.deadline)));
      setIsAdding(false);
      setNewDeadline({ name: '', start: '', target: '' });
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', overflowY: 'auto', maxHeight: '300px' }}>
        {deadlines.length === 0 && !isAdding && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-lg) 0' }}>No active deadlines tracked.</p>
        )}
        
        {deadlines.map(item => {
          const { total, elapsed, remaining } = calculateDays(item.start_date, item.deadline);
          return (
            <div key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
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

function PlaceholderTab({ icon: Icon, title, message }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 'var(--space-xl) 0', color: 'var(--text-muted)' }}>
      <Icon size={40} style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }} />
      <h4 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{title}</h4>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', maxWidth: '80%' }}>{message}</p>
    </div>
  );
}

export default function TrackerPanel() {
  const tabs = [
    { label: 'Deadlines', content: <DeadlinesTab /> },
    { label: 'Habits', content: <PlaceholderTab icon={Activity} title="Habit Tracker" message="Daily habit tracking integration is pending." /> },
    { label: 'Focus', content: <PlaceholderTab icon={Target} title="Focus Sessions" message="Recorded focus session metrics will appear here once the Focus Timer engine is implemented." /> }
  ];

  return (
    <div className="card" style={{ gridColumn: 'span 2' }}>
      <Tabs tabs={tabs} defaultTab={0} />
    </div>
  );
}