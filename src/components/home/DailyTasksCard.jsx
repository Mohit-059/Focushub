import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function DailyTasksCard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_type', 'task')
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (data) setTasks(data);
  };

  const toggleTask = async (id, currentStatus) => {
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColors = {
    'High': 'var(--accent-pink)',
    'Normal': 'var(--accent-blue)',
    'Low': 'var(--text-muted)'
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Master Tasks</h3>
        <button className="btn-icon" onClick={() => navigate('/tasks')} title="View All">
          <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        {tasks.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto 0' }}>
            All caught up!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', 
              padding: '10px 12px', backgroundColor: 'var(--bg-panel-hover)', 
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${priorityColors[task.priority || 'Normal']}`
            }}>
              <div 
                onClick={() => toggleTask(task.id, task.is_completed)} 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {task.is_completed ? <CheckCircle2 size={20} color="var(--accent-emerald)" /> : <Circle size={20} color="var(--text-muted)" />}
              </div>
              
              <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{task.title}</div>
              </div>

              <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ padding: '4px' }}>
                <Trash2 size={16} color="var(--text-muted)" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}