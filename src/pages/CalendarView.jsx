import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Generates a simple 35-block grid for the month view
  const dates = Array.from({ length: 35 }, (_, i) => i - 2); 

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <CalendarIcon size={28} color="var(--accent-blue)" />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>October 2026</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn-icon"><ChevronLeft size={20} /></button>
          <button className="btn-icon"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-panel-hover)' }}>
          {days.map(day => (
            <div key={day} style={{ padding: 'var(--space-sm)', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(100px, 1fr)', flex: 1 }}>
          {dates.map((date, i) => (
            <div key={i} style={{ 
              borderRight: '1px solid rgba(255,255,255,0.05)', 
              borderBottom: '1px solid rgba(255,255,255,0.05)', 
              padding: 'var(--space-sm)',
              opacity: date > 0 && date <= 31 ? 1 : 0.3
            }}>
              <div style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                {date > 0 && date <= 31 ? date : (date <= 0 ? 30 + date : date - 31)}
              </div>
              
              {/* Example Notion-like event pill */}
              {date === 14 && (
                <div style={{ backgroundColor: 'var(--accent-blue)', color: '#fff', fontSize: '0.75rem', padding: '4px 6px', borderRadius: '4px', marginBottom: '4px' }}>
                  Bench Press PR
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}