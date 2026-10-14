import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Check, Trash2, Circle, CheckCircle2, ArrowRight, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DailyTasksCard() {
  const { tasks, setTasks } = useAppContext();
  const [newTaskText, setNewTaskText] = useState('');
  const navigate = useNavigate();

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <CheckSquare size={20} color="var(--accent-emerald)" />
          Daily Tasks
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {completedCount} / {totalCount} completed
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-lg) 0', fontSize: '0.9rem' }}>
            No tasks for today. Time to focus!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: 'var(--space-sm)', backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: 'var(--radius-sm)', transition: 'background-color 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', flex: 1 }} onClick={() => toggleTask(task.id)}>
                {task.completed ? <CheckCircle2 size={18} color="var(--accent-emerald)" /> : <Circle size={18} color="var(--text-muted)" />}
                <span style={{ 
                  color: task.completed ? 'var(--text-muted)' : 'var(--text-main)', 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  fontSize: '0.95rem'
                }}>
                  {task.text}
                </span>
              </div>
              <button className="btn-icon" onClick={() => deleteTask(task.id)} style={{ padding: '4px' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'auto' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Add a new task..." 
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0 var(--space-sm)' }}>
          <Plus size={20} />
        </button>
      </form>
      
      <button 
        onClick={() => navigate('/daily-tasks')}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)', width: '100%', marginTop: 'var(--space-md)', color: 'var(--text-muted)', fontSize: '0.85rem' }}
      >
        View Full Task Manager <ArrowRight size={14} />
      </button>
    </div>
  );
}