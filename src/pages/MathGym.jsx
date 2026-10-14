import React, { useState, useEffect, useRef } from 'react';
import { generateMathQuestion } from '../utils/mathGenerator';
import { useAppContext } from '../context/AppContext';
import { Calculator, Play, RotateCcw, Check, X, Save } from 'lucide-react';

export default function MathGym() {
  const { mathHistory, setMathHistory, mistakes, setMistakes } = useAppContext();
  
  // Phase: 'config' | 'session' | 'results'
  const [phase, setPhase] = useState('config');
  
  const [config, setConfig] = useState({
    operation: '+',
    digitMode: '2',
    operandsCount: 2,
    difficulty: 'Medium',
    allowNegatives: false,
    requireExactDivision: true,
    questionLimit: '10' // 'Unlimited', '10', '20', '50'
  });

  const [session, setSession] = useState({
    questionsAttempted: 0,
    correct: 0,
    incorrect: 0,
    currentQ: null,
    history: [],
    startTime: null,
    endTime: null
  });

  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, expected: string }
  const inputRef = useRef(null);

  // Apply difficulty presets
  useEffect(() => {
    if (config.difficulty === 'Custom') return;
    
    let allowNegatives = false;
    let operandsCount = 2;
    
    if (config.difficulty === 'Easy') {
      allowNegatives = false;
    } else if (config.difficulty === 'Medium') {
      allowNegatives = false;
      if (config.operation === '+' || config.operation === '-') operandsCount = 3;
    } else if (config.difficulty === 'Hard') {
      allowNegatives = true;
      if (config.operation === '+' || config.operation === '-') operandsCount = 4;
    }

    setConfig(prev => ({ ...prev, allowNegatives, operandsCount }));
  }, [config.difficulty, config.operation]);

  const startSession = () => {
    setSession({
      questionsAttempted: 0,
      correct: 0,
      incorrect: 0,
      currentQ: generateMathQuestion(config),
      history: [],
      startTime: Date.now(),
      endTime: null
    });
    setPhase('session');
    setFeedback(null);
    setInputVal('');
  };

  const endSession = () => {
    const end = Date.now();
    const finalSession = { ...session, endTime: end };
    
    if (finalSession.questionsAttempted > 0) {
      const record = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        config,
        stats: {
          attempted: finalSession.questionsAttempted,
          correct: finalSession.correct,
          accuracy: Math.round((finalSession.correct / finalSession.questionsAttempted) * 100),
          durationSeconds: Math.round((end - finalSession.startTime) / 1000)
        }
      };
      setMathHistory([record, ...mathHistory]);
    }
    
    setSession(finalSession);
    setPhase('results');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || feedback) return;

    const isCorrect = inputVal.trim() === session.currentQ.expected;
    
    const record = {
      q: session.currentQ.expression,
      ans: inputVal.trim(),
      expected: session.currentQ.expected,
      isCorrect
    };

    if (!isCorrect) {
      setMistakes([{
        id: crypto.randomUUID(),
        source: 'Math Gym',
        question: session.currentQ.expression,
        expected: session.currentQ.expected,
        userAnswer: inputVal.trim(),
        timestamp: new Date().toISOString()
      }, ...mistakes]);
    }

    setFeedback({ isCorrect, expected: session.currentQ.expected });
    setSession(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
      questionsAttempted: prev.questionsAttempted + 1,
      history: [...prev.history, record]
    }));
  };

  const nextQuestion = () => {
    if (config.questionLimit !== 'Unlimited' && session.questionsAttempted >= parseInt(config.questionLimit, 10)) {
      endSession();
      return;
    }
    setSession(prev => ({ ...prev, currentQ: generateMathQuestion(config) }));
    setFeedback(null);
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Calculator size={28} color="var(--accent-emerald)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Math Gym</h1>
      </div>

      {phase === 'config' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h2 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Configure Workout</h2>
          
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            <div className="input-group">
              <label style={{ color: 'var(--text-muted)' }}>Operation</label>
              <select className="input" value={config.operation} onChange={e => setConfig({...config, operation: e.target.value})}>
                <option value="+">Addition (+)</option>
                <option value="-">Subtraction (-)</option>
                <option value="*">Multiplication (×)</option>
                <option value="/">Division (÷)</option>
                <option value="Mixed">Mixed Practice</option>
              </select>
            </div>

            <div className="input-group">
              <label style={{ color: 'var(--text-muted)' }}>Digit Length (Per Operand)</label>
              <select className="input" value={config.digitMode} onChange={e => setConfig({...config, digitMode: e.target.value})}>
                <option value="1">1 Digit</option>
                <option value="2">2 Digits</option>
                <option value="3">3 Digits</option>
                <option value="4">4 Digits</option>
                <option value="Random">Random (Independent lengths)</option>
              </select>
            </div>

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
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Number of Operands (2-5)</label>
                  <input type="number" className="input" min="2" max="5" value={config.operandsCount} onChange={e => setConfig({...config, operandsCount: parseInt(e.target.value) || 2})} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={config.allowNegatives} onChange={e => setConfig({...config, allowNegatives: e.target.checked})} />
                  Allow Negative Answers (Subtraction)
                </label>
              </div>
            )}

            <div className="input-group">
              <label style={{ color: 'var(--text-muted)' }}>Total Questions</label>
              <select className="input" value={config.questionLimit} onChange={e => setConfig({...config, questionLimit: e.target.value})}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="Unlimited">Unlimited</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" onClick={startSession} style={{ width: '100%', marginTop: 'var(--space-xl)', padding: 'var(--space-md)', fontSize: '1.1rem' }}>
            <Play size={20} /> Start Session
          </button>
        </div>
      )}

      {phase === 'session' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
            <span>Question {session.questionsAttempted + (feedback ? 0 : 1)} {config.questionLimit !== 'Unlimited' ? `/ ${config.questionLimit}` : ''}</span>
            <span>Score: {session.correct} / {session.questionsAttempted}</span>
          </div>

          <div style={{ fontSize: '4rem', fontWeight: 700, margin: 'var(--space-xl) 0', letterSpacing: '2px' }}>
            {session.currentQ?.expression} = ?
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <input 
              ref={inputRef}
              type="number" 
              className="input" 
              style={{ fontSize: '2rem', textAlign: 'center', padding: 'var(--space-md)' }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              disabled={!!feedback}
              autoFocus
            />
            {!feedback && (
              <button type="submit" className="btn btn-primary" style={{ padding: '0 var(--space-xl)' }}>
                <Check size={28} />
              </button>
            )}
          </form>

          {feedback && (
            <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', backgroundColor: feedback.isCorrect ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 127, 0.1)' }}>
              <h3 style={{ color: feedback.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-pink)', margin: '0 0 var(--space-xs) 0' }}>
                {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              {!feedback.isCorrect && <p style={{ margin: 0 }}>Correct answer: {feedback.expected}</p>}
              
              <button className="btn btn-primary" onClick={nextQuestion} style={{ marginTop: 'var(--space-md)' }} autoFocus>
                Continue
              </button>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-xl)' }}>
            <button className="btn" onClick={endSession}>End Session Early</button>
          </div>
        </div>
      )}

      {phase === 'results' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          <h2 className="card-title" style={{ justifyContent: 'center', fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>Workout Complete</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: 'var(--space-xl) 0', padding: 'var(--space-lg)', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accuracy</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                {session.questionsAttempted ? Math.round((session.correct / session.questionsAttempted) * 100) : 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correct</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{session.correct}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                {Math.round((session.endTime - session.startTime) / 1000)}s
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setPhase('config')}>
            <RotateCcw size={18} /> New Session
          </button>
        </div>
      )}
    </div>
  );
}