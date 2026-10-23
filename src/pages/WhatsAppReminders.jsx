import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Send, Clock, Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function WhatsAppReminders() {
  const [reminders, setReminders] = useState([]);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [remindTime, setRemindTime] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    fetchReminders();
    
    // Request browser notification permission for alerts
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Background clock listener checking every 30 seconds
    const interval = setInterval(() => {
      checkDueReminders();
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('whatsapp_reminders')
      .select('*')
      .order('remind_at', { ascending: true });
    if (data) setReminders(data);
  };

  const checkDueReminders = () => {
    const now = new Date();
    reminders.forEach(rem => {
      const targetTime = new Date(rem.remind_at);
      if (!rem.is_sent && targetTime <= now) {
        // Trigger alert popup
        setActiveAlert(rem);
        if (Notification.permission === 'granted') {
          new Notification('WhatsApp Reminder Due!', { body: rem.message });
        }
      }
    });
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !message.trim() || !remindTime) return;

    const { data, error } = await supabase
      .from('whatsapp_reminders')
      .insert([{
        phone_number: phone.trim(),
        message: message.trim(),
        remind_at: new Date(remindTime).toISOString(),
        is_sent: false
      }])
      .select();

    if (data) {
      setReminders([...reminders, data[0]].sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at)));
      setMessage('');
      setRemindTime('');
      alert('Reminder scheduled successfully!');
    } else if (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    await supabase.from('whatsapp_reminders').delete().eq('id', id);
    setReminders(reminders.filter(r => r.id !== id));
  };

  const markAsSent = async (id) => {
    await supabase.from('whatsapp_reminders').update({ is_sent: true }).eq('id', id);
    setReminders(reminders.map(r => r.id === id ? { ...r, is_sent: true } : r));
    setActiveAlert(null);
  };

  const openWhatsApp = (phoneNum, text, id = null) => {
    const encodedText = encodeURIComponent(text);
    // Cleans phone number of any dashes/spaces
    const cleanPhone = phoneNum.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, '_blank');
    if (id) markAsSent(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <MessageSquare size={28} color="var(--accent-emerald)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>WhatsApp Reminders</h1>
      </div>

      {/* Due Alert Banner Popup if triggered */}
      {activeAlert && (
        <div className="card" style={{ border: '2px solid var(--accent-emerald)', backgroundColor: 'rgba(52, 211, 153, 0.05)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 'bold' }}>
            <Clock size={20} /> Reminder Triggered!
          </div>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>"{activeAlert.message}"</p>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => openWhatsApp(activeAlert.phone_number, activeAlert.message, activeAlert.id)}
              style={{ backgroundColor: 'var(--accent-emerald)', color: '#000', fontWeight: 'bold' }}
            >
              <Send size={16} /> Open in WhatsApp Now
            </button>
            <button className="btn" onClick={() => markAsSent(activeAlert.id)}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Scheduler Form */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Schedule New Reminder</h3>
        <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 250px', position: 'relative' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>WhatsApp Number (with country code, e.g. 919876543210)</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="919876543210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '36px', width: '100%' }}
                  required
                />
              </div>
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date & Time</label>
              <input 
                type="datetime-local" 
                className="input" 
                value={remindTime}
                onChange={(e) => setRemindTime(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Message Content</label>
            <textarea 
              className="input" 
              placeholder="What do you want WhatsApp to remind you?" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Plus size={18} /> Schedule Reminder
          </button>
        </form>
      </div>

      {/* Scheduled Reminders List */}
      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Scheduled Queue</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {reminders.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-lg) 0' }}>
              No WhatsApp reminders queued.
            </div>
          ) : (
            reminders.map(rem => {
              const formattedDate = new Date(rem.remind_at).toLocaleString();
              return (
                <div key={rem.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: 'var(--space-md)', backgroundColor: 'var(--bg-panel-hover)', 
                  borderRadius: 'var(--radius-sm)', opacity: rem.is_sent ? 0.5 : 1,
                  borderLeft: `3px solid ${rem.is_sent ? 'var(--text-muted)' : 'var(--accent-emerald)'}`
                }}>
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                      {rem.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Target: {formattedDate} | To: +{rem.phone_number} {rem.is_sent && '(Sent)'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => openWhatsApp(rem.phone_number, rem.message, rem.id)}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'var(--accent-emerald)', color: '#000' }}
                      title="Send via WhatsApp now"
                    >
                      <Send size={14} /> Send
                    </button>
                    <button className="btn-icon" onClick={() => deleteReminder(rem.id)}>
                      <Trash2 size={16} color="var(--accent-pink)" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}