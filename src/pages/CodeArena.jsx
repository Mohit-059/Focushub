import React, { useState } from 'react';
import { Code, Play, Check, X, Terminal, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { usePersistentState } from '../hooks/usePersistentState';

const CHALLENGES = [
  {
    id: 1,
    title: 'Sum of Two Numbers',
    functionName: 'sum',
    difficulty: 'Easy',
    description: 'Write a function named `sum` that takes two numbers `a` and `b` as arguments and returns their total sum.',
    initialCode: 'function sum(a, b) {\n  // your code here\n  \n}',
    testCases: [
      { args: [2, 3], expected: 5 },
      { args: [-1, 5], expected: 4 },
      { args: [0, 0], expected: 0 }
    ]
  },
  {
    id: 2,
    title: 'Check if Even',
    functionName: 'isEven',
    difficulty: 'Easy',
    description: 'Write a function named `isEven` that takes a number `n` and returns `true` if it is even, and `false` otherwise.',
    initialCode: 'function isEven(n) {\n  \n}',
    testCases: [
      { args: [4], expected: true },
      { args: [7], expected: false },
      { args: [0], expected: true }
    ]
  },
  {
    id: 3,
    title: 'Reverse a String',
    functionName: 'reverseString',
    difficulty: 'Medium',
    description: 'Write a function named `reverseString` that takes a string `str` and returns the reversed version of it.',
    initialCode: 'function reverseString(str) {\n  \n}',
    testCases: [
      { args: ['hello'], expected: 'olleh' },
      { args: ['FocusHub'], expected: 'buHsucoF' },
      { args: [''], expected: '' }
    ]
  },
  {
    id: 4,
    title: 'Find Maximum in Array',
    functionName: 'findMax',
    difficulty: 'Medium',
    description: 'Write a function named `findMax` that takes an array of numbers and returns the largest number.',
    initialCode: 'function findMax(arr) {\n  \n}',
    testCases: [
      { args: [[1, 5, 3, 9, 2]], expected: 9 },
      { args: [[-5, -1, -10]], expected: -1 },
      { args: [[42]], expected: 42 }
    ]
  },
  {
    id: 5,
    title: 'Count Vowels',
    functionName: 'countVowels',
    difficulty: 'Hard',
    description: 'Write a function `countVowels` that takes a string and returns the number of vowels (a, e, i, o, u) it contains. Ignore case.',
    initialCode: 'function countVowels(str) {\n  \n}',
    testCases: [
      { args: ['hello'], expected: 2 },
      { args: ['FOCUS'], expected: 2 },
      { args: ['gym'], expected: 0 }
    ]
  }
];

export default function CodeArena() {
  const { mistakes, setMistakes } = useAppContext();
  
  // Track solved challenges locally
  const [solvedIds, setSolvedIds] = usePersistentState('focushub_code_solved', []);
  
  const [activeEx, setActiveEx] = useState(CHALLENGES[0]);
  const [code, setCode] = useState(CHALLENGES[0].initialCode);
  const [feedback, setFeedback] = useState(null); // { success: boolean, messages: array }

  const loadChallenge = (challenge) => {
    setActiveEx(challenge);
    setCode(challenge.initialCode);
    setFeedback(null);
  };

  const handleRunCode = () => {
    let allPassed = true;
    let consoleOutput = [];

    try {
      // 1. Safe-ish local evaluation wrapper. 
      // It executes the user's string and extracts the requested function.
      const executeCode = new Function(`
        ${code}
        return typeof ${activeEx.functionName} !== 'undefined' ? ${activeEx.functionName} : null;
      `);
      
      const userFunc = executeCode();

      if (typeof userFunc !== 'function') {
        throw new Error(`Function '${activeEx.functionName}' is not defined or is not a function.`);
      }

      // 2. Run test cases
      activeEx.testCases.forEach((test, index) => {
        // Deep copy args to prevent user function from mutating our test cases
        const argsCopy = JSON.parse(JSON.stringify(test.args));
        const result = userFunc(...argsCopy);
        
        // Basic equality check (handles primitives. Arrays/Objects would need deep equal)
        if (result !== test.expected) {
          allPassed = false;
          consoleOutput.push(`Test ${index + 1} Failed: Expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(result)}`);
        } else {
          consoleOutput.push(`Test ${index + 1} Passed!`);
        }
      });

    } catch (error) {
      allPassed = false;
      consoleOutput.push(`Error: ${error.message}`);
    }

    setFeedback({ success: allPassed, messages: consoleOutput });

    if (allPassed) {
      if (!solvedIds.includes(activeEx.id)) {
        setSolvedIds([...solvedIds, activeEx.id]);
      }
    } else {
      // Log failure to Mistake Vault
      setMistakes([{
        id: crypto.randomUUID(),
        source: `Code Arena: ${activeEx.title}`,
        question: activeEx.description,
        expected: `Pass all test cases`,
        userAnswer: `Failing Output:\n${consoleOutput.filter(m => m.includes('Failed') || m.includes('Error')).join('\n')}`,
        timestamp: new Date().toISOString()
      }, ...mistakes]);
    }
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'var(--accent-emerald)';
    if (diff === 'Medium') return 'var(--accent-amber)';
    return 'var(--accent-pink)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Code size={28} color="var(--accent-blue)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Code Arena</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-lg)', alignItems: 'start' }}>
        
        {/* Left Column: Challenges */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Drills</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Trophy size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', color: 'var(--accent-amber)' }} /> {solvedIds.length} / {CHALLENGES.length}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {CHALLENGES.map((ex) => {
              const isSolved = solvedIds.includes(ex.id);
              return (
                <button 
                  key={ex.id}
                  onClick={() => loadChallenge(ex)}
                  style={{ 
                    textAlign: 'left', 
                    padding: 'var(--space-sm)', 
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeEx.id === ex.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: activeEx.id === ex.id ? '1px solid var(--accent-blue)' : '1px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ color: activeEx.id === ex.id ? 'var(--accent-blue)' : 'var(--text-main)', fontWeight: 500 }}>
                      {ex.title}
                    </span>
                    {isSolved && <Check size={16} color="var(--accent-emerald)" />}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: getDifficultyColor(ex.difficulty) }}>
                    {ex.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Editor & Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Prompt */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 'var(--space-sm)' }}>{activeEx.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
              {activeEx.description}
            </p>
          </div>

          {/* Editor */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(0,0,0,0.3)', borderBottom: 'var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>main.js</span>
              <button className="btn btn-primary" onClick={handleRunCode} style={{ padding: '4px 12px' }}>
                <Play size={14} /> Run Tests
              </button>
            </div>
            
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              style={{ 
                width: '100%', 
                minHeight: '250px',
                padding: 'var(--space-md)', 
                backgroundColor: 'var(--bg-input)', 
                color: '#A6ACCD', // Soft editor text color
                fontFamily: '"Fira Code", monospace', 
                fontSize: '0.95rem',
                border: 'none',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Console / Output */}
          {feedback && (
            <div className="card" style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              border: feedback.success ? '1px solid var(--accent-emerald)' : '1px solid var(--accent-pink)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <Terminal size={18} color={feedback.success ? 'var(--accent-emerald)' : 'var(--accent-pink)'} />
                <span style={{ fontWeight: 600, color: feedback.success ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                  {feedback.success ? 'All Tests Passed!' : 'Execution Failed'}
                </span>
              </div>
              
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {feedback.messages.map((msg, i) => (
                  <div key={i} style={{ color: msg.includes('Passed') ? 'var(--accent-emerald)' : 'var(--accent-pink)' }}>
                    &gt; {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}