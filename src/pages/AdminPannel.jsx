import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Flame, Lock, Mail, User, AtSign, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      // 1. SIGNUP FLOW (4 Inputs)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            display_name: name.trim()
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Account request submitted successfully! Awaiting administrator approval.');
        setIsSignUp(false); // Switch back to login view
      }
    } else {
      // 2. LOGIN FLOW (Accepts Email OR Username)
      let loginIdentifier = email.trim();

      // If what they typed doesn't contain '@', treat it as a username and resolve to their email
      if (!loginIdentifier.includes('@')) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', loginIdentifier)
          .single();

        if (profileError || !profileData) {
          setErrorMsg('Username not found. Try logging in with your email address.');
          setLoading(false);
          return;
        }
        loginIdentifier = profileData.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginIdentifier,
        password
      });

      if (error) {
        setErrorMsg(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'var(--bg-main)', 
      padding: '20px' 
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: '40px 30px' }}>
        
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '50%', display: 'flex' }}>
            <Flame size={32} color="var(--accent-blue)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>FocusHub</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isSignUp ? 'Request access to your private workspace' : 'Sign in to your secure dashboard'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-pink)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-pink)', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--accent-emerald)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Extra fields shown ONLY during Signup */}
          {isSignUp && (
            <>
              <div style={{ position: 'relative' }}>
                <AtSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </>
          )}

          {/* Login/Signup Email or Username Field */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder={isSignUp ? "Email address" : "Email or Username"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* Password Field */}
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              className="input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Request Access' : 'Sign In')} <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <span 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
            style={{ color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </div>

      </div>
    </div>
  );
}