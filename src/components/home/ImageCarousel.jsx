import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function ImageCarousel({ images = [
  { src: "https://img.magnific.com/free-photo/happy-family-spending-time-together-green-nature_1098-1063.jpg?semt=ais_hybrid&w=740&q=80", title: "Motivation" }
] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (!images || images.length === 0) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', backgroundColor: 'var(--bg-panel-hover)' }}>
        <ImageIcon size={32} color="var(--text-muted)" style={{ marginBottom: 'var(--space-sm)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Devil Mode Gallery</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', opacity: 0.6 }}>Coming in Part 3</span>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, position: 'relative', height: '250px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        flex: 1, 
        backgroundImage: `url(${images[currentIndex].src})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        transition: 'background-image 0.3s ease-in-out'
      }} />
      
      {/* Overlay gradient for text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />

      <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h4 style={{ color: 'var(--text-main)', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {images[currentIndex].title || 'Devil Mode'}
          </h4>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn-icon" onClick={prev} style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronLeft size={18} color="white" />
          </button>
          <button className="btn-icon" onClick={next} style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <ChevronRight size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}