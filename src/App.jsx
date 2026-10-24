import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './pages/Auth';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TongueTwisters from './components/study/TongueTwisters';

// Styles
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css'; 
import AdminPanel from './pages/AdminPannel';

// Components & Layout
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import SOSButton from './components/shared/SOSButton';

// Main Pages
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import StudyHub from './pages/StudyHub';
import PlaceholderPage from './pages/PlaceholderPage';

// Part 2 Pages
import MathGym from './pages/MathGym';
import MemoryLab from './pages/MemoryLab';
import Study from './pages/Study';

// Part 3 Pages
import Gym from './pages/Gym';
import DevilMode from './pages/DevilMode';
import Notes from './pages/Notes';
import Stats from './pages/Stats';
import DailyTasks from './pages/DailyTasks';
import Settings from './pages/Settings';
import DailyLogs from './pages/DailyLogs';


export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-main)', color: 'var(--accent-blue)' }}>
        Loading Workspace...
      </div>
    );
  }

  // If no active session, intercept the render and force the login screen
  if (!session) {
    return <Auth />;
  }

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          
          {/* Global Emergency Button */}
          <SOSButton />
          
          <Sidebar isMobileOpen={isSidebarOpen} setMobileOpen={setSidebarOpen} />
          
          <main className="main-content">
            <Topbar toggleMobile={() => setSidebarOpen(!isSidebarOpen)} />
            
            <div className="page-container">
              <Routes>
                {/* Main */}
                <Route path="/" element={<Home />} />
                
                {/* Part 2: Learning & Drills */}
                <Route path="/study" element={<Study />} />
                <Route path="/memory-lab" element={<MemoryLab />} />
                <Route path="/math-gym" element={<MathGym />} />
                
                {/* Part 3: Gym, Media, & Supporting Pages */}
                <Route path="/gym" element={<Gym />} />
                <Route path="/devil-mode" element={<DevilMode />} />
                {/* <Route path="/data-lab" element={<DataLab />} /> */}
                <Route path="/notes" element={<Notes />} />
                <Route path="/speech-gym" element={<TongueTwisters />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/daily-tasks" element={<DailyTasks />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/study-hub" element={<StudyHub />} />
                <Route path="/calendar" element={<CalendarView />} />

                <Route path="/admin" element={<AdminPanel />} />
                
                {/* Unbuilt / Future Feature */}
                <Route path="/daily-logs" element={<DailyLogs/>} />

                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );  
}