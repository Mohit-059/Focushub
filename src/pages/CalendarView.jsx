import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchMonthEvents();
  }, [currentDate]);

  const fetchMonthEvents = async () => {
    // Fetch any task/deadline that has a date set
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .not('deadline', 'is', null);
      
    if (data) setEvents(data);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Generate the responsive grid structure
  const gridCells = [];
  for (let i = 0; i < firstDay; i++) gridCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) gridCells.push(i);
  
  // Pad the end of the grid to complete the last row
  const paddingEnd = (7 - (gridCells.length % 7)) % 7;
  for (let i = 0; i < paddingEnd; i++) gridCells.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <CalendarIcon size={28} color="var(--accent-blue)" />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        
        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-panel-hover)' }}>
          {daysOfWeek.map(day => (
            <div key={day} style={{ padding: 'var(--space-sm)', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {/* Truncate to 1 letter on ultra-small screens automatically via CSS if needed, but 3 letters usually fits */}
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(100px, 1fr)', flex: 1, overflowY: 'auto' }}>
          {gridCells.map((date, index) => {
            // Find events that match this exact date block
            const dayEvents = date ? events.filter(e => {
              const eventDate = new Date(e.deadline);
              // Account for timezone offsets to ensure the day matches exactly
              return eventDate.getUTCFullYear() === year && 
                     eventDate.getUTCMonth() === month && 
                     eventDate.getUTCDate() === date;
            }) : [];

            return (
              <div key={index} style={{ 
                borderRight: '1px solid rgba(255,255,255,0.05)', 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                padding: 'var(--space-sm)',
                backgroundColor: date ? 'transparent' : 'rgba(0,0,0,0.2)',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {date && (
                  <>
                    <div style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)', color: 'var(--text-main)', fontWeight: 'bold' }}>
                      {date}
                    </div>
                    
                    {/* Database-synced Event Pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
                      {dayEvents.map(ev => (
                        <div key={ev.id} style={{ 
                          backgroundColor: ev.is_completed ? 'var(--bg-panel-hover)' : 'var(--accent-blue)', 
                          color: ev.is_completed ? 'var(--text-muted)' : '#fff', 
                          fontSize: '0.75rem', 
                          padding: '4px 6px', 
                          borderRadius: '4px', 
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: ev.is_completed ? 'line-through' : 'none'
                        }}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}