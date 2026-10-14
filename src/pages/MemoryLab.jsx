import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Brain, ChevronLeft } from 'lucide-react';
import NumberRecall from '../components/memory/NumberRecall';
import VisualRecall from '../components/memory/VisualRecall';

export default function MemoryLab() {
  const { memoryHistory, setMemoryHistory, mistakes, setMistakes } = useAppContext();
  
  // activeExercise is null (dashboard view) or string identifier ('NumberRecall', 'VisualRecall')
  const [activeExercise, setActiveExercise] = useState(null);

  const handleComplete = (result) => {
    // Save to history
    setMemoryHistory([result, ...memoryHistory]);
    
    // If incorrect, add to mistake vault
    if (!result.isCorrect) {
      setMistakes([{
        id: crypto.randomUUID(),
        source: `Memory Lab: ${result.exercise}`,
        question: `Recall Config: ${JSON.stringify(result.config)}`,
        expected: JSON.stringify(result.expected),
        userAnswer: JSON.stringify(result.userAnswer),
        timestamp: result.timestamp
      }, ...mistakes]);
    }
  };

  const renderDashboard = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)' }}>
        
        {/* Number Recall Button */}
        <button className="card" onClick={() => setActiveExercise('NumberRecall')} style={{ textAlign: 'left', cursor: 'pointer' }}>
          <h3 className="card-title" style={{ marginBottom: 'var(--space-xs)' }}>Number Recall</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Memorize sequences of digits. Tests short-term retention and working memory reversal.</p>
        </button>

        {/* Visual Recall Button (Now unlocked and active!) */}
        <button className="card" onClick={() => setActiveExercise('VisualRecall')} style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--accent-blue)' }}>
          <h3 className="card-title" style={{ marginBottom: 'var(--space-xs)' }}>Visual Recall</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Spatial memory grid matching. Memorize and recreate the highlighted pattern.</p>
        </button>

      </div>

      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Recent Activity</h3>
        {memoryHistory.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No memory sessions recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {memoryHistory.slice(0, 5).map((record, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{record.exercise}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 'var(--space-sm)' }}>{record.config.difficulty}</span>
                </div>
                <span style={{ color: record.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                  {record.isCorrect ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Brain size={28} color="var(--accent-violet)" />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Memory Lab</h1>
        </div>
        {activeExercise && (
          <button className="btn" onClick={() => setActiveExercise(null)}>
            <ChevronLeft size={18} /> Back to Lab
          </button>
        )}
      </div>

      {!activeExercise && renderDashboard()}

      {activeExercise === 'NumberRecall' && (
        <div className="card">
          <NumberRecall onComplete={handleComplete} />
        </div>
      )}

      {/* Visual Recall Active View */}
      {activeExercise === 'VisualRecall' && (
        <div className="card">
          <VisualRecall onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}