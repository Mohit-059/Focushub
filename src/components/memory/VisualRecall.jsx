import React, { useState, useEffect } from 'react';
import { Play, Check, RotateCcw } from 'lucide-react';

export default function VisualRecall({ onComplete }) {
  const [phase, setPhase] = useState('config'); // config, display, recall, results
  const [config, setConfig] = useState({ difficulty: 'Medium', gridSize: 4, highlightCount: 5, duration: 3000 });
  const [activeCells, setActiveCells] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (config.difficulty === 'Custom') return;
    if (config.difficulty === 'Easy') {
      setConfig(prev => ({ ...prev, gridSize: 3, highlightCount: 3, duration: 3000 }));
    } else if (config.difficulty === 'Medium') {
      setConfig(prev => ({ ...prev, gridSize: 4, highlightCount: 5, duration: 3000 }));
    } else if (config.difficulty === 'Hard') {
      setConfig(prev => ({ ...prev, gridSize: 5, highlightCount: 8, duration: 2500 }));
    }
  }, [config.difficulty]);

  const startExercise = () => {
    const totalCells = config.gridSize * config.gridSize;
    const count = Math.min(config.highlightCount, totalCells);
    
    // Generate unique random cells
    const cells = new Set();
    while (cells.size < count) {
      cells.add(Math.floor(Math.random() * totalCells));
    }
    
    setActiveCells(Array.from(cells));
    setSelectedCells([]);
    setPhase('display');
    
    setTimeout(() => {
      setPhase('recall');
    }, config.duration);
  };

  const toggleCell = (index) => {
    setSelectedCells(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    let correctPicks = 0;
    let incorrectPicks = 0;
    
    selectedCells.forEach(cell => {
      if (activeCells.includes(cell)) correctPicks++;
      else incorrectPicks++;
    });

    const isPerfect = correctPicks === activeCells.length && incorrectPicks === 0;

    const record = {
      exercise: 'Visual Recall',
      config,
      expected: activeCells,
      userAnswer: selectedCells,
      isCorrect: isPerfect,
      timestamp: new Date().toISOString()
    };
    
    setResult({ ...record, correctPicks, incorrectPicks });
    setPhase('results');
    onComplete(record);
  };

  const renderGrid = (interactive = false, showResults = false) => {
    const totalCells = config.gridSize * config.gridSize;
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`, 
        gap: '8px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const isActive = activeCells.includes(i);
          const isSelected = selectedCells.includes(i);
          
          let bgColor = 'rgba(255,255,255,0.05)';
          if (phase === 'display' && isActive) bgColor = 'var(--accent-blue)';
          else if (phase === 'recall' && isSelected) bgColor = 'var(--accent-blue)';
          else if (showResults) {
            if (isActive && isSelected) bgColor = 'var(--accent-emerald)'; // Found
            else if (isActive && !isSelected) bgColor = 'var(--accent-amber)'; // Missed
            else if (!isActive && isSelected) bgColor = 'var(--accent-pink)'; // Wrong pick
          }

          return (
            <button
              key={i}
              onClick={() => interactive && toggleCell(i)}
              disabled={!interactive}
              style={{
                aspectRatio: '1/1',
                backgroundColor: bgColor,
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'background-color 0.2s'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {phase === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h3 style={{ margin: 0 }}>Visual Recall</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Memorize the highlighted pattern on the grid.</p>
          
          <div className="input-group">
            <label style={{ color: 'var(--text-muted)' }}>Difficulty</label>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              {['Easy', 'Medium', 'Hard', 'Custom'].map(level => (
                <button 
                  key={level}
                  className={`btn ${config.difficulty === level ? 'btn-primary' : ''}`}
                  onClick={() => setConfig({...config, difficulty: level})}
                  style={{ flex: 1 }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {config.difficulty === 'Custom' && (
            <div style={{ padding: 'var(--space-md)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 'var(--space-sm)' }}>
              <div className="input-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Grid Size (N x N)</label>
                <input type="number" className="input" min="2" max="8" value={config.gridSize} onChange={e => setConfig({...config, gridSize: parseInt(e.target.value) || 4})} />
              </div>
              <div className="input-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Highlighted Cells</label>
                <input type="number" className="input" min="1" max={config.gridSize * config.gridSize} value={config.highlightCount} onChange={e => setConfig({...config, highlightCount: parseInt(e.target.value) || 5})} />
              </div>
              <div className="input-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Duration (ms)</label>
                <input type="number" className="input" step="500" value={config.duration} onChange={e => setConfig({...config, duration: parseInt(e.target.value) || 3000})} />
              </div>
            </div>
          )}

          <button className="btn btn-primary" onClick={startExercise} style={{ marginTop: 'var(--space-md)' }}>
            <Play size={18} /> Start
          </button>
        </div>
      )}

      {phase === 'display' && (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Memorize Pattern:</div>
          {renderGrid(false, false)}
        </div>
      )}

      {phase === 'recall' && (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Recreate Pattern:</div>
          {renderGrid(true, false)}
          <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 'var(--space-lg)', width: '100%', maxWidth: '400px' }}>
            <Check size={18} /> Submit
          </button>
        </div>
      )}

      {phase === 'results' && (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <h2 style={{ color: result.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-pink)', marginBottom: 'var(--space-md)' }}>
            {result.isCorrect ? 'Perfect Recall!' : 'Pattern Mismatch'}
          </h2>
          
          {renderGrid(false, true)}

          <div style={{ margin: 'var(--space-md) auto', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span><span style={{ color: 'var(--accent-emerald)' }}>■</span> Correct</span>
            <span><span style={{ color: 'var(--accent-amber)' }}>■</span> Missed</span>
            <span><span style={{ color: 'var(--accent-pink)' }}>■</span> Wrong</span>
          </div>

          <button className="btn btn-primary" onClick={() => setPhase('config')} style={{ marginTop: 'var(--space-md)' }}>
            <RotateCcw size={18} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}