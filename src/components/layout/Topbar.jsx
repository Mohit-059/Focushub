import React, { useState, useEffect } from 'react';
import { Menu, Search, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ toggleMobile }) {
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { performSearch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = performSearch(searchQuery);
    console.log("Search Results:", results); 
    // For Part 1, we just log to console. In a real app, this would open a modal or dropdown.
    alert(`Found ${results.length} results. Check console.`);
    setSearchQuery('');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="btn-icon mobile-toggle" onClick={toggleMobile}>
          <Menu size={24} />
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'none' }} className="date-display">
          {currentDate}
        </span>
      </div>

      <div className="topbar-right">
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search tasks & deadlines..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', width: '250px', backgroundColor: 'rgba(255,255,255,0.03)' }}
          />
        </form>
        <button className="btn-icon" onClick={() => navigate('/settings')} title="Settings">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}