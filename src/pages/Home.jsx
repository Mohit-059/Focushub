import { supabase } from '../supabaseClient';
import React, { useMemo, useState } from 'react';
import { BookOpen, Brain, Calculator, Dumbbell, ShieldAlert } from 'lucide-react';


// Import all the modular components
import StatCard from '../components/shared/StatCard';
import DailyTasksCard from '../components/home/DailyTasksCard';
import TrackerPanel from '../components/home/TrackerPanel';
import ActivityHeatmap from '../components/home/ActivityHeatmap';
import ImageCarousel from '../components/home/ImageCarousel';
import QuoteCard from '../components/home/QuoteCard';

export default function Home() {

  const [userName, setUserName] = useState('Name');

  // Fetch the logged-in user's name
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.display_name) {
        // Use the name they typed at signup
        setUserName(user.user_metadata.display_name);
      } else if (user?.email) {
        // Fallback to the username if they don't have a display name
        const extracted = user.email.split('@')[0];
        setUserName(extracted.charAt(0).toUpperCase() + extracted.slice(1));
      }
    };
    fetchUser();
  }, []);

  // Dynamic Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      
      {/* A. Welcome Header */}
      <section style={{ 
        padding: 'var(--space-xl)', 
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(90deg, var(--bg-panel) 0%, rgba(17, 21, 32, 0.4) 100%)',
        border: 'var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle accent glow behind the text */}
        <div style={{ position: 'absolute', left: '-50px', top: '-50px', width: '200px', height: '200px', background: 'var(--accent-blue)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 var(--space-xs) 0', letterSpacing: '-0.5px' }}>
            {greeting}, <span style={{ color: 'var(--accent-blue)' }}>{userName}.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>
            Small steps today, big results tomorrow.
          </p>
        </div>
      </section>

      {/* B. Today's Progress Cards */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--space-md)' 
      }}>
        {/* We use '0' empty states per the Part 1 requirements */}
        <StatCard title="Study Hours" value="0.0" icon={BookOpen} color="var(--accent-blue)" />
        <StatCard title="Problems Solved" value="0" icon={Brain} color="var(--accent-violet)" />
        <StatCard title="Math Score" value="0%" icon={Calculator} color="var(--accent-emerald)" />
        <StatCard title="Gym Sessions" value="0" icon={Dumbbell} color="var(--accent-pink)" />
        <StatCard title="Self Control" value="100%" icon={ShieldAlert} color="var(--accent-amber)" />
      </section>

      {/* Main Dashboard Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(12, 1fr)', 
        gap: 'var(--space-lg)',
        alignItems: 'start'
      }}>
        
        {/* Left Column (Spans 8 cols on desktop, 12 on mobile) */}
        <div style={{ display: 'grid', gap: 'var(--space-lg)', gridColumn: 'span 12' }} className="col-lg-8">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {/* G. Shared Personal Tracker (Tabs) */}
            <TrackerPanel />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {/* E. Weekly Activity Heatmap */}
            <ActivityHeatmap />
            {/* F. Motivational Image Carousel */}
            <ImageCarousel />
          </div>

        </div>

        {/* Right Column (Spans 4 cols on desktop, 12 on mobile) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', gridColumn: 'span 12' }} className="col-lg-4">
          
          {/* D. Daily Tasks Card */}
          <div style={{ height: '300px' }}>
            <DailyTasksCard />
          </div>

          {/* I. Quote of the Day */}
          <QuoteCard />

        </div>
      </section>
      
      {/* Inline responsive style override for the grid layout */}
      <style>{`
        @media (min-width: 1024px) {
          .col-lg-8 { grid-column: span 8 !important; }
          .col-lg-4 { grid-column: span 4 !important; }
        }
      `}</style>

    </div>
  );
}