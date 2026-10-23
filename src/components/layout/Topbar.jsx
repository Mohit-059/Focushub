import React, { useState, useEffect } from 'react';
import { Menu, Search, Settings, Home } from 'lucide-react';
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
    alert(`Found ${results.length} results. Check console.`);
    setSearchQuery('');
  };

  return (
    <header className="topbar" style={{ position: 'sticky', top: 0, zIndex: 999, width: '100%', boxSizing: 'border-box' }}>
      
      {/* Increased gap from 12px to 16px to separate Menu and Home */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-icon mobile-toggle" onClick={toggleMobile}>
          <Menu size={24} />
        </button>
        
        <div 
          className="mobile-toggle"
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px' }}
          title="Go to Homepage"
        >
          <Home size={22} color="var(--text-main)" />
        </div>

        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'none' }} className="date-display">
          {currentDate}
        </span>
      </div>

      {/* Added marginLeft: '16px' to push away from Home icon, and increased gap to 12px for Settings */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end', marginLeft: '21px' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%', maxWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search tasks & deadlines..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', boxSizing: 'border-box' }}
          />
        </form>
        <button className="btn-icon" onClick={() => navigate('/settings')} title="Settings" style={{ flexShrink: 0 }}>
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}