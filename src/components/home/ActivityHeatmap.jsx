import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function WeeklyActivityCard() {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const generatedDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 21); // Last 3 weeks view for dashboard card

    let current = new Date(startDate);
    while (current <= today) {
      const tzOffset = current.getTimezoneOffset() * 60000;
      const localISOTime = new Date(current.getTime() - tzOffset).toISOString().split('T')[0];
      generatedDates.push(localISOTime);
      current.setDate(current.getDate() + 1);
    }
    setDates(generatedDates);
  }, []);

  useEffect(() => {
    if (dates.length > 0) {
      fetchHabits();
    }
  }, [dates]);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*');

    if (error) {
      console.error("Error fetching habits for widget:", error);
      return;
    }

    if (data) {
      setHabits(data);
    }
  };

  const getGraphData = () => {
    if (habits.length === 0 || dates.length === 0) return dates.map(() => 0);
    return dates.map(date => {
      const greens = habits.filter(h => h.logs && h.logs[date] === 'green').length;
      return (greens / habits.length) * 100;
    });
  };

  const graphData = getGraphData();

  // Format date nicely for display (e.g., "Oct 25")
  const formatNiceDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeDateLabel = hoveredIndex !== null && dates[hoveredIndex] 
    ? `${formatNiceDate(dates[hoveredIndex])}: ${Math.round(graphData[hoveredIndex])}% Complete` 
    : 'Hover over bars for details';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      
      {/* Header with Live Status & Dynamic Hover Text */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Activity size={20} color="var(--accent-emerald)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Weekly Activity Performance</h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: hoveredIndex !== null ? 'var(--accent-blue)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
          {activeDateLabel}
        </span>
      </div>

      {/* Bar Graph Area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '4px', paddingBottom: 'var(--space-xs)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {graphData.map((percentage, i) => {
          const isToday = i === graphData.length - 1;
          const isHovered = hoveredIndex === i;

          return (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%', cursor: 'pointer' }}
            >
              <div 
                style={{ 
                  width: '100%', 
                  height: `${Math.max(percentage, 4)}%`, 
                  backgroundColor: percentage > 75 ? 'var(--accent-emerald)' : percentage > 40 ? 'var(--accent-amber)' : percentage > 0 ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                  opacity: isHovered ? 1 : (isToday ? 0.9 : 0.7),
                  filter: isHovered ? 'brightness(1.2)' : 'none',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  transition: 'height 0.3s ease, filter 0.2s ease, opacity 0.2s ease'
                }} 
              />
            </div>
          );
        })}
      </div>

      {/* Exact Date Axis Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>{dates.length > 0 ? formatNiceDate(dates[0]) : ''}</span>
        <span>{dates.length > 0 ? formatNiceDate(dates[dates.length - 1]) : 'Today'}</span>
      </div>

    </div>
  );
}