import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DailyTasks() {
  const { tasks, setTasks } = useAppContext();
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      priority: newPriority,
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

  const priorityColors = {
    'High': 'var(--accent-pink)',
    'Normal': 'var(--accent-blue)',
    'Low': 'var(--text-muted)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <CheckSquare size={28} color="var(--accent-emerald)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Master Task List</h1>
      </div>

      <div className="card">
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="What needs to be done?" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />
          <select className="input" value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={{ width: 'auto' }}>
            <option value="Low">Low Priority</option>
            <option value="Normal">Normal Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button type="submit" className="btn btn-primary">
            <Plus size={18} /> Add Task
          </button>
        </form>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', overflowY: 'auto' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-xl) 0' }}>
            Your task list is completely empty. Enjoy the peace!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: 'var(--space-md)', backgroundColor: 'var(--bg-panel-hover)', 
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer', flex: 1 }} onClick={() => toggleTask(task.id)}>
                {task.completed ? <CheckCircle2 size={22} color="var(--accent-emerald)" /> : <Circle size={22} color="var(--text-muted)" />}
                <div>
                  <div style={{ 
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-main)', 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontSize: '1.05rem', fontWeight: 500
                  }}>
                    {task.text}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: priorityColors[task.priority || 'Normal'], marginTop: '2px' }}>
                    {task.priority || 'Normal'} Priority
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => deleteTask(task.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}