import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, AlertCircle, Plus, Search, Trash2, Check, X as XIcon } from 'lucide-react';
import Tabs from '../components/shared/Tabs';

export default function Study() {
  const { flashcards, setFlashcards, mistakes, setMistakes } = useAppContext();

  // ----- Flashcards Tab -----
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '', topic: '' });
  const [activeReviewCard, setActiveReviewCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const saveCard = (e) => {
    e.preventDefault();
    if (!newCard.question || !newCard.answer) return;
    setFlashcards([{
      id: crypto.randomUUID(),
      ...newCard,
      createdAt: new Date().toISOString(),
      nextReview: new Date().toISOString(),
      history: []
    }, ...flashcards]);
    setNewCard({ question: '', answer: '', topic: '' });
    setIsAddingCard(false);
  };

  const deleteCard = (id) => {
    if (window.confirm('Delete this flashcard?')) {
      setFlashcards(flashcards.filter(c => c.id !== id));
    }
  };

  const handleReview = (success) => {
    // Simple Spaced Repetition logic
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (success ? 2 : 0)); // Review tomorrow if failed, +2 days if success
    
    setFlashcards(flashcards.map(c => 
      c.id === activeReviewCard.id 
        ? { ...c, nextReview: nextDate.toISOString(), history: [...c.history, { date: new Date().toISOString(), success }] }
        : c
    ));
    setActiveReviewCard(null);
    setShowAnswer(false);
  };

  const FlashcardsView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {activeReviewCard ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Topic: {activeReviewCard.topic || 'General'}</span>
          <h2 style={{ margin: 'var(--space-lg) 0', fontSize: '1.5rem' }}>{activeReviewCard.question}</h2>
          
          {!showAnswer ? (
            <button className="btn btn-primary" onClick={() => setShowAnswer(true)}>Reveal Answer</button>
          ) : (
            <>
              <div style={{ margin: 'var(--space-lg) 0', padding: 'var(--space-md)', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', fontSize: '1.2rem' }}>
                {activeReviewCard.answer}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                <button className="btn" onClick={() => handleReview(false)} style={{ color: 'var(--accent-pink)', borderColor: 'var(--accent-pink)' }}>
                  <XIcon size={18} /> Forgot
                </button>
                <button className="btn" onClick={() => handleReview(true)} style={{ color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                  <Check size={18} /> Recalled
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <button className="btn btn-primary" onClick={() => setIsAddingCard(!isAddingCard)} style={{ alignSelf: 'flex-start' }}>
            <Plus size={18} /> Add Flashcard
          </button>

          {isAddingCard && (
            <form onSubmit={saveCard} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)' }}>
              <input className="input" placeholder="Question" value={newCard.question} onChange={e => setNewCard({...newCard, question: e.target.value})} required />
              <textarea className="input" placeholder="Answer" rows="3" value={newCard.answer} onChange={e => setNewCard({...newCard, answer: e.target.value})} required />
              <input className="input" placeholder="Topic (Optional)" value={newCard.topic} onChange={e => setNewCard({...newCard, topic: e.target.value})} />
              <button type="submit" className="btn btn-primary">Save Card</button>
            </form>
          )}

          <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
            {flashcards.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No flashcards yet. Create some to start studying!</p>}
            {flashcards.map(card => {
              const due = new Date(card.nextReview) <= new Date();
              return (
                <div key={card.id} className="card" style={{ padding: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{card.question}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.topic || 'General'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    {due && (
                      <button className="btn btn-primary" onClick={() => { setActiveReviewCard(card); setShowAnswer(false); }}>
                        Review
                      </button>
                    )}
                    <button className="btn-icon" onClick={() => deleteCard(card.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  // ----- Mistake Vault Tab -----
  const deleteMistake = (id) => {
    setMistakes(mistakes.filter(m => m.id !== id));
  };

  const MistakeVaultView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        A collection of errors and incorrect answers automatically saved from Math Gym and Memory Lab.
      </p>

      {mistakes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ opacity: 0.5, marginBottom: 'var(--space-md)' }} />
          <p>Vault is empty. Flawless execution!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
          {mistakes.map(mistake => (
            <div key={mistake.id} className="card" style={{ padding: 'var(--space-md)', borderLeft: '3px solid var(--accent-pink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{mistake.source}</span>
                <button className="btn-icon" onClick={() => deleteMistake(mistake.id)} style={{ padding: 0 }}><Trash2 size={14}/></button>
              </div>
              <div style={{ marginBottom: 'var(--space-xs)' }}>
                <strong>Prompt:</strong> {mistake.question}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.95rem' }}>
                <div style={{ color: 'var(--accent-pink)' }}><strong>You answered:</strong> {mistake.userAnswer || 'Blank'}</div>
                <div style={{ color: 'var(--accent-emerald)' }}><strong>Expected:</strong> {mistake.expected}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
                {new Date(mistake.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { label: 'Flashcards', content: <FlashcardsView /> },
    { label: 'Mistake Vault', content: <MistakeVaultView /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <BookOpen size={28} color="var(--accent-blue)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Study</h1>
      </div>
      
      <div style={{ flex: 1 }}>
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
}