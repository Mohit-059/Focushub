import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Search, Save } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';

export default function Notes() {
  const [notes, setNotes] = usePersistentState('focushub_notes', []);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load active note into editor
  useEffect(() => {
    if (activeNoteId) {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeNoteId, notes]);

  const handleCreateNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleSaveNote = () => {
    if (!activeNoteId) return;
    setNotes(notes.map(n => 
      n.id === activeNoteId 
        ? { ...n, title: title || 'Untitled Note', content, updatedAt: new Date().toISOString() } 
        : n
    ));
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Delete this note forever?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <FileText size={28} color="var(--accent-blue)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Notes</h1>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar List */}
        <div className="card" style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
          <button className="btn btn-primary" onClick={handleCreateNote} style={{ width: '100%' }}>
            <Plus size={18} /> New Note
          </button>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredNotes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: 'var(--space-md)' }}>No notes found.</p>
            ) : (
              filteredNotes.map(note => (
                <div 
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  style={{ 
                    padding: 'var(--space-sm)', 
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: activeNoteId === note.id ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid transparent',
                    borderColor: activeNoteId === note.id ? 'var(--accent-blue)' : 'transparent'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, color: activeNoteId === note.id ? 'var(--accent-blue)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} style={{ padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {activeNoteId ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  style={{ 
                    background: 'transparent', border: 'none', color: 'var(--text-main)', 
                    fontSize: '1.5rem', fontWeight: 600, outline: 'none', width: '100%' 
                  }}
                />
                <button className="btn btn-primary" onClick={handleSaveNote}>
                  <Save size={18} /> Save
                </button>
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your markdown notes here..."
                style={{ 
                  flex: 1, background: 'var(--bg-input)', border: 'var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', color: 'var(--text-main)', 
                  fontFamily: 'var(--font-sans)', fontSize: '1rem', resize: 'none', outline: 'none' 
                }}
              />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              Select a note or create a new one to start writing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}