import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Code, Calculator, Database, Dumbbell, Zap, PlusSquare, Clock, FileText } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const primaryShortcuts = [
    { name: 'Study', icon: BookOpen, path: '/study', desc: 'Active curriculum' },
    { name: 'Memory', icon: Brain, path: '/memory-lab', desc: 'Spaced repetition' },
    { name: 'Code', icon: Code, path: '/code-arena', desc: 'Programming drills' },
    { name: 'Math', icon: Calculator, path: '/math-gym', desc: 'Quantitative practice' },
    { name: 'Data', icon: Database, path: '/data-lab', desc: 'Analytics projects' },
    { name: 'Gym', icon: Dumbbell, path: '/gym', desc: 'Physical training' }
  ];

  const quickStarts = [
    { name: 'New Flashcard', icon: PlusSquare, path: '/memory-lab' },
    { name: 'Random Math', icon: Calculator, path: '/math-gym' },
    { name: 'Focus Timer', icon: Clock, path: '/study' },
    { name: 'Open Notes', icon: FileText, path: '/notes' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Feature Shortcuts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)' }}>
        {primaryShortcuts.map(item => (
          <button 
            key={item.name}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-md)', gap: 'var(--space-sm)', textAlign: 'center' }}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={28} color="var(--accent-blue)" />
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Quick Starts */}
      <div>
        <h4 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-md)', fontSize: '1rem' }}>
          <Zap size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 'var(--space-xs)', color: 'var(--accent-amber)' }} />
          Quick Start
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {quickStarts.map(action => (
            <button 
              key={action.name}
              className="btn"
              onClick={() => navigate(action.path)}
            >
              <action.icon size={16} /> {action.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}