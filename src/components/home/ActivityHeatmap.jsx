import React from 'react';
import { Activity } from 'lucide-react';

export default function ActivityHeatmap({ data = [] }) {
  // For the initial implementation, we generate an empty grid 
  // representing the last 12 weeks of 7 days.
  const weeks = 12;
  const daysPerWeek = 7;
  
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={20} color="var(--accent-emerald)" />
          Weekly Activity
        </h3>
      </div>
      
      {data.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${weeks}, 1fr)`, 
            gap: '4px',
            opacity: 0.5 
          }}>
            {Array.from({ length: weeks * daysPerWeek }).map((_, i) => (
              <div key={i} style={{
                width: '12px', 
                height: '12px', 
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '2px'
              }} />
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'var(--space-md)' }}>
            No activity history yet. Start working to build your streak.
          </p>
        </div>
      ) : (
        <div>{/* Future implementation for actual data */}</div>
      )}
    </div>
  );
}