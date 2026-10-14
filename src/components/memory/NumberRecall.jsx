import React, { useState, useEffect, useRef } from 'react';
import { Play, Check, RotateCcw } from 'lucide-react';

export default function NumberRecall({ onComplete }) {
  const [phase, setPhase] = useState('config'); // config, display, recall, results
  const [config, setConfig] = useState({ difficulty: 'Medium', length: 5, duration: 3000, reverse: false });
  const [sequence, setSequence] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState(null);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (config.difficulty === 'Custom') return;
    
    if (config.difficulty === 'Easy') {
      setConfig(prev => ({ ...prev, length: 4, duration: 4000, reverse: false }));
    } else if (config.difficulty === 'Medium') {
      setConfig(prev => ({ ...prev, length: 6, duration: 3000, reverse: false }));
    } else if (config.difficulty === 'Hard') {
      setConfig(prev => ({ ...prev, length: 8, duration: 2500, reverse: true }));
    }
  }, [config.difficulty]);

  const startExercise = () => {
    let seq = '';
    for (let i = 0; i < config.length; i++) {
      seq += Math.floor(Math.random() * 10).toString();
    }
    setSequence(seq);
    setPhase('display');
    setInputVal('');
    
    setTimeout(() => {
      setPhase('recall');
      setTimeout(() => inputRef.current?.focus(), 50);
    }, config.duration);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal) return;

    const expected = config.reverse ? sequence.split('').reverse().join('') : sequence;
    const isCorrect = inputVal === expected;
    
    const record = {
      exercise: 'Number Recall',
      config,
      expected,
      userAnswer: inputVal,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setResult(record);
    setPhase('results');
    onComplete(record); // Pass result to the dashboard
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {phase === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <h3 style={{ margin: 0 }}>Number Recall</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Memorize the sequence of digits. {config.reverse ? 'Enter them in reverse order!' : ''}</p>
          
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
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sequence Length</label>
                <input type="number" className="input" min="3" max="20" value={config.length} onChange={e => setConfig({...config, length: parseInt(e.target.value) || 5})} />
              </div>
              <div className="input-group">
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Display Duration (ms)</label>
                <input type="number" className="input" step="500" value={config.duration} onChange={e => setConfig({...config, duration: parseInt(e.target.value) || 3000})} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={config.reverse} onChange={e => setConfig({...config, reverse: e.target.checked})} />
                Reverse Recall
              </label>
            </div>
          )}

          <button className="btn btn-primary" onClick={startExercise} style={{ marginTop: 'var(--space-md)' }}>
            <Play size={18} /> Start
          </button>
        </div>
      )}

      {phase === 'display' && (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>Memorize:</div>
          <div style={{ fontSize: '4rem', fontWeight: 700, letterSpacing: '8px', color: 'var(--text-main)' }}>
            {sequence}
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            Enter the sequence {config.reverse ? 'BACKWARDS' : ''}:
          </div>
          <input 
            ref={inputRef}
            type="text"
            className="input"
            style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '8px', padding: 'var(--space-md)' }}
            value={inputVal}
            onChange={e => setInputVal(e.target.value.replace(/[^0-9]/g, ''))}
            autoFocus
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)', width: '100%' }}>
            <Check size={18} /> Submit
          </button>
        </form>
      )}

      {phase === 'results' && (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <h2 style={{ color: result.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
            {result.isCorrect ? 'Perfect Recall!' : 'Incorrect'}
          </h2>
          
          <div style={{ margin: 'var(--space-lg) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You entered</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{result.userAnswer}</div>
            </div>
            {!result.isCorrect && (
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correct Answer</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>{result.expected}</div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={() => setPhase('config')}>
            <RotateCcw size={18} /> Play Again
          </button>
        </div>
      )}
    </div>
  );
}