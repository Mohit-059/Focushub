import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Flame, User, Lock } from 'lucide-react';


export default function Auth() {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Format the username into a dummy email that Supabase accepts
    const formattedEmail = `${username.toLowerCase().replace(/\s+/g, '')}@focushub.com`;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: formattedEmail, 
          password 
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email: formattedEmail, 
          password,
          options: {
            data: {
              display_name: displayName // Attach the name to the account
            }
          }
        });
        if (error) throw error;
        setMessage('Account created successfully! You can now sign in.');
      }
    } catch (error) {
      // Clean up the error message so it doesn't show the fake email
      setMessage(error.message.replace('email', 'username'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: 'var(--space-md)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-xl)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <Flame size={40} color="var(--accent-blue)" style={{ marginBottom: 'var(--space-sm)' }} />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>FocusHub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', textAlign: 'center' }}>
            {isLogin ? 'Welcome back, builder.' : 'Initialize your workspace.'}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Display Name (e.g. MOhit)" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={!isLogin}
                style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-panel-hover)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'white', boxSizing: 'border-box', marginBottom: '8px' }}
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-panel-hover)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'white', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--bg-panel-hover)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'white', boxSizing: 'border-box' }}
            />
          </div>

          {message && (
            <div style={{ color: message.includes('created') ? 'var(--accent-emerald)' : 'var(--accent-pink)', fontSize: '0.85rem', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 'var(--space-sm)' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}