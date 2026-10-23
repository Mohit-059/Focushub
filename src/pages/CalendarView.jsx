import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, AlignLeft, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');
  
  const dayViewRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchMonthEvents();
  }, [currentDate]);

  const fetchMonthEvents = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_type', 'calendar');
      
    if (data) setEvents(data);
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const gridCells = [];
  for (let i = 0; i < firstDay; i++) gridCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) gridCells.push(i);
  
  const paddingEnd = (7 - (gridCells.length % 7)) % 7;
  for (let i = 0; i < paddingEnd; i++) gridCells.push(null);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const clickedDate = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
    setSelectedDate(clickedDate);
    
    setTimeout(() => {
      dayViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedDate) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        title: newTaskTitle.trim(), 
        note: newTaskNote.trim(),
        deadline: selectedDate,
        task_type: 'calendar'
      }])
      .select();

    if (data) {
      setEvents([...events, data[0]]);
      setNewTaskTitle('');
      setNewTaskNote('');
    } else if (error) {
      console.error("Error adding calendar event:", error);
    }
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setEvents(events.filter(ev => ev.id !== id));
  };

  const selectedDayEvents = selectedDate ? events.filter(e => {
    return e.deadline && e.deadline.startsWith(selectedDate);
  }) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', minHeight: '100%', paddingBottom: '100px' }}>
      
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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* THE FIX: Width 100% and NO scrolling. Strict grid containment. */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* minmax(0, 1fr) ensures columns can shrink aggressively on mobile without breaking */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-panel-hover)' }}>
            {daysOfWeek.map(day => (
              <div key={day} style={{ padding: 'var(--space-sm) 2px', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {day.charAt(0)}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gridAutoRows: 'minmax(70px, 1fr)' }}>
            {gridCells.map((date, index) => {
              const dayEvents = date ? events.filter(e => {
                const eventDate = new Date(e.deadline);
                return eventDate.getUTCFullYear() === year && 
                       eventDate.getUTCMonth() === month && 
                       eventDate.getUTCDate() === date;
              }) : [];
              
              const isSelected = date && selectedDate === new Date(Date.UTC(year, month, date)).toISOString().split('T')[0];

              return (
                <div 
                  key={index} 
                  onClick={() => handleDayClick(date)}
                  style={{ 
                    borderRight: '1px solid rgba(255,255,255,0.05)', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)', 
                    padding: '4px 2px',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : (date ? 'transparent' : 'rgba(0,0,0,0.2)'),
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: date ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                    border: isSelected ? '1px solid var(--accent-blue)' : 'none',
                    overflow: 'hidden' // Absolutely prevents cell stretching
                  }}
                >
                  {date && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.85rem', color: isSelected ? 'var(--accent-blue)' : 'var(--text-main)', fontWeight: isSelected ? 'bold' : 'normal' }}>
                          {date}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'hidden', flex: 1 }}>
                        {dayEvents.map(ev => (
                          <div key={ev.id} style={{ 
                            backgroundColor: 'var(--accent-blue)', 
                            color: '#fff', 
                            fontSize: '0.65rem', // Scaled down for mobile fit
                            padding: '1px 4px', 
                            borderRadius: '3px', 
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
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

      {selectedDate && (
        <div ref={dayViewRef} className="card" style={{ borderTop: '3px solid var(--accent-blue)', marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
              Agenda for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
            <button className="btn-icon" onClick={() => setSelectedDate(null)}><X size={20} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
            {selectedDayEvents.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No events scheduled for this day.</div>
            ) : (
              selectedDayEvents.map(ev => (
                <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-md)', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', wordWrap: 'break-word' }}>
                      {ev.title}
                    </div>
                    {ev.note && (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <AlignLeft size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ lineHeight: '1.4', wordWrap: 'break-word', flex: 1 }}>{ev.note}</span>
                      </div>
                    )}
                  </div>
                  <button className="btn-icon" onClick={() => deleteTask(ev.id)} style={{ padding: '4px', marginLeft: '10px' }}>
                    <Trash2 size={18} color="var(--accent-pink)" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ margin: '0 0 var(--space-sm) 0', fontSize: '1rem' }}>Add Calendar Event</h4>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              
              <input 
                className="input" 
                placeholder="Event name..." 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />

              <textarea 
                className="input" 
                placeholder="Description or notes..." 
                value={newTaskNote}
                onChange={(e) => setNewTaskNote(e.target.value)}
                style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
              />

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 20px' }}>
                <Plus size={18} /> Save Event
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}