import React from 'react';
import { Settings as SettingsIcon, Download, Upload, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { theme, setTheme } = useAppContext();

  const handleExport = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('focushub_')) {
        data[key] = JSON.parse(localStorage.getItem(key));
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focushub_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith('focushub_')) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        }
        alert("Data imported successfully! The application will now reload.");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleWipe = () => {
    if (window.confirm("WARNING: This will delete ALL FocusHub data forever. Are you absolutely sure?")) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith('focushub_')) {
          localStorage.removeItem(key);
        }
      }
      alert("All data wiped. Reloading.");
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <SettingsIcon size={28} color="var(--text-muted)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Settings</h1>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Appearance</h3>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <label style={{ color: 'var(--text-muted)' }}>Theme</label>
          <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Cinematic Dark (Default)</option>
            {/* Real theming CSS toggles would connect here in the future */}
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Data Management</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
          Your data is stored locally in your browser. Export it regularly to keep it safe.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <button className="btn" onClick={handleExport} style={{ justifyContent: 'flex-start' }}>
            <Download size={18} /> Export Backup (JSON)
          </button>
          
          <label className="btn" style={{ justifyContent: 'flex-start', cursor: 'pointer' }}>
            <Upload size={18} /> Import Backup
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: 'var(--space-sm) 0' }} />

          <button className="btn" onClick={handleWipe} style={{ justifyContent: 'flex-start', color: 'var(--accent-pink)', borderColor: 'rgba(255,0,127,0.3)' }}>
            <Trash2 size={18} /> Wipe All Local Data
          </button>
        </div>
      </div>
    </div>
  );
}