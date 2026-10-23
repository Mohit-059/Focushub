import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { 
  Home, BookOpen, Brain, Code, Calculator, Calendar,
  Dumbbell, Flame, CheckSquare, BarChart2, FileText, Settings, X, Mic, MessageSquare 
} from 'lucide-react';

const navItems = [
  { name: 'Daily Tasks', path: '/daily-tasks', icon: CheckSquare },
  { name: 'Motivation', path: '/devil-mode', icon: Flame, color: 'var(--accent-pink)' },
  { name: 'Speech Gym', path: '/speech-gym', icon: Mic },
  
  { name: 'Memory Lab', path: '/memory-lab', icon: Brain },
  
  { name: 'Math Gym', path: '/math-gym', icon: Calculator },
  // { name: 'Data Lab', path: '/data-lab', icon: Database },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Gym Logs', path: '/gym', icon: Dumbbell },

  { name: 'Daily Logs', path: '/code-arena', icon: Code },
  
  { name: 'Study', path: '/study', icon: BookOpen },

  // Added WhatsApp Reminders
  { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare, color: 'var(--accent-emerald)' },
  
  { name: 'Stats', path: '/stats', icon: BarChart2 },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link 
            to="/" 
            onClick={() => setMobileOpen(false)} // Closes sidebar on mobile when clicked
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', textDecoration: 'none', color: 'inherit' }}
          >
            <Flame size={24} color="var(--accent-blue)" />
            <span>FocusHub</span>
          </Link>
          {isMobileOpen && (
            <button className="btn-icon mobile-toggle" style={{ marginLeft: 'auto' }} onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon 
                size={20} 
                style={item.color ? { color: item.color } : {}} 
              />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}