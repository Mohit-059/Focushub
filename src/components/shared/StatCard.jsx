import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'var(--accent-blue)' }) {
  return (
    <div className="card" style={{ padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
      <div style={{ 
        backgroundColor: `rgba(255,255,255,0.05)`, 
        padding: '12px', 
        borderRadius: 'var(--radius-md)',
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
      <div>
        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>{title}</h4>
        <div style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}