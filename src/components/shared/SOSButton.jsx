import React, { useState } from 'react';
import { LifeBuoy, X, ShieldAlert, Lock, Zap, Smartphone, Music, Film, ChevronUp, ChevronDown, PlayCircle } from 'lucide-react';

// ==========================================
// 1. DROP YOUR CLOUDINARY LINKS HERE
// ==========================================

const images = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", // Gym
];

const quotes = [
  "The pain of discipline weighs ounces. The pain of regret weighs tons.",
  "Your ego is comfortable. Your higher self demands suffering. Choose.",
  "Don't trade what you want most for what you want right now.",
  "You said you wanted to be great. Act like it."
];

// Vertical Videos (Insta Edits / TikToks)
const reels = [
  "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with Cloudinary Reel 1
  "https://cdn.pixabay.com/video/2020/05/25/40149-424785465_large.mp4", // Replace with Reel 2
];

// Audio Tracks (Phonks)
const phonks = [
  { title: "Hard Phonk Beta", src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=phonk-4-106517.mp3" },
  { title: "Grind Anthem", src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-rock-king-around-here-15045.mp3" }
];

// Standard 16:9 Long Videos
const longVideos = [
  "https://cdn.pixabay.com/video/2015/08/08/212-135738872_large.mp4", // Replace with Long Phonk Video 1
];


// ==========================================
// 2. COMPONENT LOGIC
// ==========================================
export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Exit Mechanics
  const [unlockAttempt, setUnlockAttempt] = useState('');
  const [error, setError] = useState(false);
  const ESCAPE_PASSWORD = "please@123";

  // State for the randomizers
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  // State for the tabs & media players
  const [activeTab, setActiveTab] = useState('reels'); // 'reels', 'phonks', 'videos'
  const [reelIndex, setReelIndex] = useState(0);
  const [phonkIndex, setPhonkIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  // Randomize Image & Quote
  const hitMeAgain = () => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
    setImageIndex(Math.floor(Math.random() * images.length));
  };

  // Initialize fresh when opened
  const handleOpen = () => {
    hitMeAgain();
    setActiveTab('reels');
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    
    // --- UNCOMMENT THIS BLOCK LATER TO ENABLE THE PASSWORD LOCK ---
    /*
    if (unlockAttempt !== ESCAPE_PASSWORD) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    */
    
    setIsOpen(false);
    setUnlockAttempt('');
  };

  // Infinite Loop Handlers
  const nextReel = () => setReelIndex((prev) => (prev + 1) % reels.length);
  const prevReel = () => setReelIndex((prev) => (prev - 1 + reels.length) % reels.length);

  const nextPhonk = () => setPhonkIndex((prev) => (prev + 1) % phonks.length);
  const nextLongVideo = () => setVideoIndex((prev) => (prev + 1) % longVideos.length);

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <button 
        onClick={handleOpen}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 9998,
          backgroundColor: 'var(--accent-pink)', color: 'white', border: 'none',
          borderRadius: '50%', width: '65px', height: '65px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)', cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <LifeBuoy size={32} />
      </button>

      {/* Full Screen Emergency Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#0a0a0a', zIndex: 9999, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 'var(--space-lg)'
        }}>
          
          <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            
            {/* 1. TOP MODULE: Visuals & Quote */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--bg-panel)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <ShieldAlert size={48} color="var(--accent-pink)" style={{ marginBottom: '10px' }} />
              <h1 style={{ fontSize: '2.5rem', color: 'white', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Hold The Line, MOhit
              </h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%', alignItems: 'center', marginTop: '20px' }}>
                
                {/* Random Image */}
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '250px', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <img src={images[imageIndex]} alt="Drive" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Random Quote & Button */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                  <p style={{ fontSize: '1.4rem', color: 'var(--accent-pink)', fontStyle: 'italic', margin: 0 }}>
                    "{quotes[quoteIndex]}"
                  </p>
                  <button onClick={hitMeAgain} style={{ alignSelf: 'center', padding: '12px 24px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Zap size={20} fill="currentColor" /> Change Image & Quote
                  </button>
                </div>

              </div>
            </div>

            {/* 2. TABS NAVIGATION */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'reels', icon: <Smartphone size={18} />, label: 'Insta Reels' },
                { id: 'phonks', icon: <Music size={18} />, label: 'Phonk Audio' },
                { id: 'videos', icon: <Film size={18} />, label: 'Long Videos' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 24px', backgroundColor: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--bg-panel)',
                    color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', transition: '0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* 3. MEDIA PLAYERS */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              
              {/* TAB: REELS (Infinite Vertical Feed) */}
              {activeTab === 'reels' && (
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '9/16', backgroundColor: 'black', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <video key={reels[reelIndex]} src={reels[reelIndex]} autoPlay loop controls playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* Overlay Controls */}
                  <div style={{ position: 'absolute', right: '15px', bottom: '20%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button onClick={prevReel} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                      <ChevronUp size={30} />
                    </button>
                    <button onClick={nextReel} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid white', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                      <ChevronDown size={30} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: PHONKS (Audio Player) */}
              {activeTab === 'phonks' && (
                <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-panel)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Music size={64} color="var(--accent-blue)" style={{ marginBottom: '20px' }} />
                  <h2 style={{ color: 'white', marginBottom: '20px' }}>{phonks[phonkIndex].title}</h2>
                  
                  <audio key={phonks[phonkIndex].src} src={phonks[phonkIndex].src} autoPlay controls style={{ width: '100%', marginBottom: '20px' }} />
                  
                  <button onClick={nextPhonk} style={{ padding: '10px 24px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                    <PlayCircle size={20} /> Next Track
                  </button>
                </div>
              )}

              {/* TAB: LONG VIDEOS */}
              {activeTab === 'videos' && (
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'black', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                    <video key={longVideos[videoIndex]} src={longVideos[videoIndex]} autoPlay controls style={{ width: '100%', height: '100%' }} />
                  </div>
                  <button onClick={nextLongVideo} style={{ alignSelf: 'center', padding: '10px 24px', backgroundColor: 'var(--bg-panel)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    Play Next Video
                  </button>
                </div>
              )}

            </div>

            {/* 4. EXIT MECHANICS */}
            <div style={{ marginTop: '20px', paddingBottom: '40px', display: 'flex', justifyContent: 'center' }}>
              <form onSubmit={handleClose} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                
                {/* --- UNCOMMENT THIS INPUT LATER TO ENABLE THE PASSWORD LOCK --- */}
                {/* 
                <div style={{ position: 'relative', width: '300px' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password"
                    placeholder="Enter password to exit..."
                    value={unlockAttempt}
                    onChange={(e) => setUnlockAttempt(e.target.value)}
                    style={{ width: '100%', padding: '15px 15px 15px 40px', backgroundColor: 'rgba(255,255,255,0.05)', border: error ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
                  />
                </div>
                */}

                <button type="submit" style={{ padding: '12px 30px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s' }}>
                  <X size={18} /> Back to work.
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}