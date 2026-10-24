import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, AlignLeft, Trash2, Mail, CheckCircle2, Send } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNote, setNewTaskNote] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  
  const dayViewRef = useRef(null);
  const dateInputRef = useRef(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchMonthEvents();
    fetchSavedEmail();
  }, [currentDate]);

  const fetchMonthEvents = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_type', 'calendar');
      
    if (data) {
      setEvents(data);
      calculateUpcomingTasks(data);
    }
  };

  const fetchSavedEmail = async () => {
    const { data } = await supabase
      .from('email_subscriptions')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (data) setUserEmail(data.email);
  };

  const calculateUpcomingTasks = (allEvents) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const relevant = allEvents.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      taskDate.setHours(0, 0, 0, 0);
      
      const diffTime = taskDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= 0 && diffDays <= 2;
    });
    setUpcomingTasks(relevant);
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    if (!userEmail.trim()) return;

    const { data, error } = await supabase
      .from('email_subscriptions')
      .upsert([{ email: userEmail.trim() }], { onConflict: 'email' })
      .select();

    if (data) {
      setEmailStatus('Mailbox saved successfully!');
      setTimeout(() => setEmailStatus(''), 3000);
    } else if (error) {
      setEmailStatus('Error saving email.');
    }
  };

  const sendEmailBriefing = () => {
    if (!userEmail) {
      alert('Please enter and save your email address first.');
      return;
    }
    const subject = encodeURIComponent('FocusHub Task Briefing: Upcoming Deadlines');
    const bodyContent = upcomingTasks.map(t => `- [Due: ${t.deadline}] ${t.title}${t.note ? `\n  Note: ${t.note}` : ''}`).join('\n\n');
    const body = encodeURIComponent(`Here is your clutter-free task digest (0-2 day window):\n\n${bodyContent}\n\nStay locked in,\nFocusHub`);
    
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}&su=${subject}&body=${body}`, '_blank');
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

  const handleMonthJump = (e) => {
    const val = e.target.value;
    if (!val) return;
    const [selectedYear, selectedMonth] = val.split('-');
    setCurrentDate(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1));
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
      const updatedEvents = [...events, data[0]];
      setEvents(updatedEvents);
      calculateUpcomingTasks(updatedEvents);
      setNewTaskTitle('');
      setNewTaskNote('');
    } else if (error) {
      console.error("Error adding calendar event:", error);
    }
  };

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    const updatedEvents = events.filter(ev => ev.id !== id);
    setEvents(updatedEvents);
    calculateUpcomingTasks(updatedEvents);
  };

  const selectedDayEvents = selectedDate ? events.filter(e => {
    return e.deadline && e.deadline.startsWith(selectedDate);
  }) : [];

  const monthInputVal = `${year}-${String(month + 1).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', minHeight: '100%', paddingBottom: '100px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Calendar Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div 
          onClick={() => dateInputRef.current?.showPicker?.()} 
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer', position: 'relative' }}
          title="Click to jump to month"
        >
          <CalendarIcon size={28} color="var(--accent-blue)" />
          <h1 style={{ margin: 0, fontSize: '1.8rem', userSelect: 'none' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h1>
          <input 
            ref={dateInputRef}
            type="month"
            value={monthInputVal}
            onChange={handleMonthJump}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn-icon" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <button className="btn-icon" onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
                    overflow: 'hidden'
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
                            fontSize: '0.65rem', 
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

      {/* Selected Day Agenda View */}
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

      {/* CLEANLY REDESIGNED RESPONSIVE MAILBOX CARD AT THE BOTTOM */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
        
        {/* Header row with inline icon and title to prevent awkward wrapping */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
            <Mail size={20} color="var(--accent-blue)" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', lineHeight: '1.3' }}>Email Task Digest (0-2 Day Window)</h3>
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Enter your email to scan calendar deadlines and send clean task briefings for tasks due today, tomorrow, or in 2 days.
        </p>

        {emailStatus && (
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--accent-emerald)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-emerald)', fontSize: '0.8rem' }}>
            {emailStatus}
          </div>
        )}

        {/* Fully responsive form container stacking elements on smaller screens */}
        <form onSubmit={handleSaveEmail} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', width: '100%', boxSizing: 'border-box' }}>
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your email address..." 
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box' }}
            required
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', width: '100%', flexWrap: 'wrap' }}>
            <button type="submit" className="btn" style={{ flex: '1 1 130px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Save Mail
            </button>
            <button type="button" className="btn btn-primary" onClick={sendEmailBriefing} style={{ flex: '1 1 160px', backgroundColor: 'var(--accent-blue)', color: '#fff', justifyContent: 'center' }}>
              <Send size={16} /> Send Briefing
            </button>
          </div>
        </form>

        {upcomingTasks.length > 0 && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
            <CalendarIcon size={14} color="var(--accent-blue)" />
            <span>{upcomingTasks.length} upcoming task(s) currently queued for email delivery.</span>
          </div>
        )}
      </div>

    </div>
  );
}