import React, { useState, useEffect, useRef } from 'react';
import { Flame, Upload, X, Trash2, Maximize2, Quote as QuoteIcon, Plus } from 'lucide-react';
import Tabs from '../components/shared/Tabs';
import { usePersistentState } from '../hooks/usePersistentState';
import { saveMedia, getAllMedia, deleteMedia } from '../utils/mediaStorage';

export default function DevilMode() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quotes, setQuotes] = usePersistentState('focushub_devil_quotes', [
    { id: '1', text: 'Discipline equals freedom.', author: 'Jocko Willink' }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxContent, setLightboxContent] = useState(null); // { type, url, title }
  const fileInputRef = useRef(null);

  // Load media from IndexedDB on mount
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const allImages = await getAllMedia('image');
      const allVideos = await getAllMedia('video');
      
      // Convert blobs to displayable object URLs
      setImages(allImages.map(img => ({ ...img, url: URL.createObjectURL(img.file) })));
      setVideos(allVideos.map(vid => ({ ...vid, url: URL.createObjectURL(vid.file) })));
    } catch (error) {
      console.error("Failed to load media from IndexedDB:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
    
    if (type) {
      try {
        await saveMedia(file, type);
        await loadMedia();
      } catch (err) {
        alert("Failed to save media. File might be too large or unsupported.");
      }
    } else {
      alert("Only images and videos are supported.");
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteMedia = async (id, type) => {
    if (window.confirm("Remove this from your vault?")) {
      await deleteMedia(id);
      await loadMedia();
      setLightboxContent(null);
    }
  };

  const ImagesTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
        {/* Upload Card */}
        <button 
          className="card" 
          onClick={() => fileInputRef.current?.click()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', cursor: 'pointer', border: '2px dashed var(--border-subtle)', background: 'transparent' }}
        >
          <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 'var(--space-sm)' }} />
          <span style={{ color: 'var(--text-muted)' }}>{isUploading ? 'Saving...' : 'Upload Image'}</span>
        </button>

        {images.map(img => (
          <div key={img.id} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', group: 'true' }}>
            <img 
              src={img.url} 
              alt={img.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onClick={() => setLightboxContent({ type: 'image', ...img })}
            />
            <button 
              className="btn-icon" 
              onClick={(e) => { e.stopPropagation(); handleDeleteMedia(img.id, 'image'); }}
              style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              <Trash2 size={16} color="white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const VideosTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ alignSelf: 'flex-start' }}>
        <Upload size={18} /> Upload Phonk / Edit
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
        {videos.map(vid => (
          <div key={vid.id} className="card" style={{ padding: 'var(--space-sm)' }}>
            <video 
              src={vid.url} 
              controls 
              preload="metadata"
              style={{ width: '100%', borderRadius: 'var(--radius-sm)', backgroundColor: 'black', maxHeight: '400px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)', padding: '0 var(--space-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</span>
              <button className="btn-icon" onClick={() => handleDeleteMedia(vid.id, 'video')}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuotesTab = () => {
    const [newText, setNewText] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddQuote = (e) => {
      e.preventDefault();
      if (!newText) return;
      setQuotes([{ id: crypto.randomUUID(), text: newText, author: newAuthor }, ...quotes]);
      setNewText(''); setNewAuthor(''); setIsAdding(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ alignSelf: 'flex-start' }}>
          <Plus size={18} /> Add Quote
        </button>

        {isAdding && (
          <form onSubmit={handleAddQuote} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', backgroundColor: 'var(--bg-panel-hover)' }}>
            <textarea className="input" placeholder="Quote text" rows="3" value={newText} onChange={e => setNewText(e.target.value)} required />
            <input className="input" placeholder="Author (Optional)" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
            <button type="submit" className="btn btn-primary">Save Quote</button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
          {quotes.map(q => (
            <div key={q.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.05) 0%, var(--bg-panel) 100%)' }}>
              <div>
                <QuoteIcon size={24} color="var(--accent-pink)" style={{ opacity: 0.5, marginBottom: 'var(--space-sm)' }} />
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.5 }}>"{q.text}"</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'var(--space-lg)' }}>
                <span style={{ color: 'var(--accent-pink)', fontWeight: 600, fontSize: '0.9rem' }}>— {q.author || 'Unknown'}</span>
                <button className="btn-icon" onClick={() => setQuotes(quotes.filter(item => item.id !== q.id))}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = [
    { label: 'Images', content: <ImagesTab /> },
    { label: 'Quotes', content: <QuotesTab /> },
    { label: 'Videos', content: <VideosTab /> }
  ];

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Flame size={28} color="var(--accent-pink)" />
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>Motivation</h1>
        </div>
        
        <div style={{ flex: 1 }}>
          <Tabs tabs={tabs} defaultTab={0} />
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*,video/mp4,video/webm" 
          onChange={handleFileUpload} 
        />
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxContent && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)'
        }}>
          <div style={{ position: 'absolute', top: 'var(--space-lg)', right: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)' }}>
            <button className="btn-icon" onClick={() => setLightboxContent(null)} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <X size={24} />
            </button>
          </div>
          
          {lightboxContent.type === 'image' && (
            <img 
              src={lightboxContent.url} 
              alt={lightboxContent.title} 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
            />
          )}
        </div>
      )}
    </>
  );
}