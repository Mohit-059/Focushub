import React from 'react';
import { BarChart2, Brain, Calculator, CheckSquare, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/shared/StatCard';

export default function Stats() {
  const { mathHistory, memoryHistory, tasks, flashcards } = useAppContext();

  // Aggregate Math Stats
  const totalMathQuestions = mathHistory.reduce((acc, curr) => acc + (curr.stats?.attempted || 0), 0);
  const totalMathCorrect = mathHistory.reduce((acc, curr) => acc + (curr.stats?.correct || 0), 0);
  const mathAccuracy = totalMathQuestions > 0 ? Math.round((totalMathCorrect / totalMathQuestions) * 100) : 0;

  // Aggregate Memory Stats
  const memoryAttempts = memoryHistory.length;
  const memorySuccesses = memoryHistory.filter(m => m.isCorrect).length;
  const memoryAccuracy = memoryAttempts > 0 ? Math.round((memorySuccesses / memoryAttempts) * 100) : 0;

  // Aggregate Task Stats
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <BarChart2 size={28} color="var(--accent-emerald)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Performance Stats</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
        <StatCard title="Math Accuracy" value={`${mathAccuracy}%`} icon={Calculator} color="var(--accent-blue)" />
        <StatCard title="Memory Recall" value={`${memoryAccuracy}%`} icon={Brain} color="var(--accent-violet)" />
        <StatCard title="Tasks Completed" value={completedTasks} icon={CheckSquare} color="var(--accent-emerald)" />
        <StatCard title="Total Flashcards" value={flashcards.length} icon={Target} color="var(--accent-pink)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Recent Math Sessions</h3>
          {mathHistory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No math sessions recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {mathHistory.slice(0, 5).map(session => (
                <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{session.config?.operation} ({session.config?.difficulty})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(session.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{session.stats?.accuracy}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Recent Memory Drills</h3>
          {memoryHistory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No memory sessions recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {memoryHistory.slice(0, 5).map((record, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{record.exercise}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(record.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: record.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                    {record.isCorrect ? 'Success' : 'Missed'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}