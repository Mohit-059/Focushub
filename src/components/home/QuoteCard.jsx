import React, { useState } from 'react';
import { RefreshCw, Quote } from 'lucide-react';

const QUOTES = [
  { text: "Small steps today, big results tomorrow.", author: "FocusHub" },
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" }
];

export default function QuoteCard() {
  const [index, setIndex] = useState(0);

  const refreshQuote = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * QUOTES.length);
    } while (nextIndex === index && QUOTES.length > 1);
    setIndex(nextIndex);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, var(--bg-panel) 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Quote size={24} color="var(--accent-violet)" style={{ opacity: 0.5 }} />
        <button className="btn-icon" onClick={refreshQuote} title="Next Quote">
          <RefreshCw size={16} />
        </button>
      </div>
      
      <div>
        <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: 'var(--space-xs)', lineHeight: 1.4 }}>
          "{QUOTES[index].text}"
        </p>
        <p style={{ color: 'var(--accent-violet)', fontSize: '0.85rem', fontWeight: 600 }}>
          — {QUOTES[index].author}
        </p>
      </div>
    </div>
  );
}