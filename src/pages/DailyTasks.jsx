import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_type', 'task')
      .order('created_at', { ascending: false });
      
    if (data) setTasks(data);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const { data } = await supabase
      .from('tasks')
      .insert([{ 
        title: newTaskText.trim(),
        priority: newPriority,
        task_type: 'task',
        is_completed: false
      }])
      .select();

    if (data) {
      setTasks([data[0], ...tasks]);
      setNewTaskText('');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const { data } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', id)
      .select();

    if (data) {
      setTasks(tasks.map(task => task.id === id ? data[0] : task));
    }
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', cursor: 'pointer', flex: 1 }} onClick={() => toggleTask(task.id, task.is_completed)}>
                {task.is_completed ? <CheckCircle2 size={22} color="var(--accent-emerald)" /> : <Circle size={22} color="var(--text-muted)" />}
                <div>
                  <div style={{ 
                    color: task.is_completed ? 'var(--text-muted)' : 'var(--text-main)', 
                    textDecoration: task.is_completed ? 'line-through' : 'none',
                    fontSize: '1.05rem', fontWeight: 500
                  }}>
                    {task.title}
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