import React from 'react';
import { Settings, Lock } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'var(--text-muted)'
    }}>
      <Lock size={48} style={{ marginBottom: 'var(--space-md)', color: 'var(--accent-violet)' }} />
      <h1 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{title}</h1>
      <p>This module is locked. It will be implemented in a future phase of FocusHub.</p>
    </div>
  );
}