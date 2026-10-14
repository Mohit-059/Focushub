import React, { useState } from 'react';
import { Mic, Volume2, RefreshCw, X } from 'lucide-react';

const TWISTERS = [
  // S & SH (Sibilants)
  { id: 1, text: "She sells seashells by the seashore. The shells she sells are surely seashells.", focus: "S & SH", level: "Easy" },
  { id: 2, text: "I saw Susie sitting in a shoeshine shop. Where she sits she shines, and where she shines she sits.", focus: "S & SH", level: "Medium" },
  { id: 3, text: "Selfish shellfish. Selfish shellfish. Selfish shellfish.", focus: "S & SH", level: "Easy" },
  { id: 4, text: "Surely Sylvia swims swiftly, shearing short shallow seas.", focus: "S & SH", level: "Medium" },
  { id: 5, text: "The sixth sick sheik's sixth sheep's sick.", focus: "S & SH", level: "Hard" },
  { id: 6, text: "Scissors sizzle, thistles sizzle.", focus: "S & Z", level: "Medium" },
  { id: 7, text: "Swan swam over the sea, swim, swan, swim!", focus: "S & W", level: "Easy" },
  { id: 8, text: "Six sleek swans swam swiftly southwards.", focus: "S & SW", level: "Medium" },
  { id: 9, text: "A skunk sat on a stump and thunk the stump stunk.", focus: "SK & ST", level: "Hard" },
  { id: 10, text: "Which wristwatches are Swiss wristwatches?", focus: "S & W", level: "Hard" },

  // R & L (Liquids)
  { id: 11, text: "Red lorry, yellow lorry. Red lorry, yellow lorry.", focus: "R & L", level: "Easy" },
  { id: 12, text: "Truly rural, truly rural, truly rural.", focus: "R & L", level: "Hard" },
  { id: 13, text: "A loyal warrior will rarely worry why we rule.", focus: "R & L", level: "Hard" },
  { id: 14, text: "Rolling red wagons roll rapidly along the road.", focus: "R & W", level: "Medium" },
  { id: 15, text: "Larry sent the latter a letter later.", focus: "L & T", level: "Easy" },
  { id: 16, text: "Round and round the rugged rock the ragged rascal ran.", focus: "R", level: "Medium" },
  { id: 17, text: "Eleven benevolent elephants.", focus: "L & V", level: "Medium" },
  { id: 18, text: "Rory the warrior and Roger the worrier were reared wrongly in a rural brewery.", focus: "R & W", level: "Hard" },
  { id: 19, text: "Little lucky Luke likes lakes, lucky little Luke likes licking lakes.", focus: "L", level: "Medium" },
  { id: 20, text: "Red leather, yellow leather. Red leather, yellow leather.", focus: "R & L", level: "Easy" },

  // TH (Voiced & Voiceless Fricatives)
  { id: 21, text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.", focus: "TH", level: "Hard" },
  { id: 22, text: "I thought a thought, but the thought I thought wasn't the thought I thought I thought.", focus: "TH", level: "Medium" },
  { id: 23, text: "Three thick thistles, three thin thistles.", focus: "TH", level: "Easy" },
  { id: 24, text: "Whether the weather be fine, or whether the weather be not.", focus: "TH & W", level: "Medium" },
  { id: 25, text: "Father, mother, sister, brother, hand in hand with one another.", focus: "Voiced TH", level: "Easy" },
  { id: 26, text: "They thankfully think this thing is the best thing that they threw.", focus: "TH", level: "Medium" },
  { id: 27, text: "He threw three free throws.", focus: "TH & F", level: "Hard" },
  { id: 28, text: "Nothing is worth thousands of thankful thoughts.", focus: "TH", level: "Medium" },
  { id: 29, text: "These things finish sooner than you think.", focus: "TH & S", level: "Easy" },
  { id: 30, text: "Thirty-three thirsty, thundering thoroughbreds thumped Mr. Thurber on Thursday.", focus: "TH & R", level: "Hard" },

  // P, B, M (Bilabials & Plosives)
  { id: 31, text: "Peter Piper picked a peck of pickled peppers.", focus: "P", level: "Medium" },
  { id: 32, text: "Betty Botter bought some butter, but she said the butter’s bitter.", focus: "B & T", level: "Medium" },
  { id: 33, text: "A big black bug bit a big black bear, made the big black bear bleed blood.", focus: "B", level: "Hard" },
  { id: 34, text: "Rubber baby buggy bumpers.", focus: "B & R", level: "Medium" },
  { id: 35, text: "Pat put purple paint in the pool.", focus: "P", level: "Easy" },
  { id: 36, text: "Black background, brown background.", focus: "B", level: "Easy" },
  { id: 37, text: "Please pay promptly, Mr. Peters.", focus: "P & M", level: "Easy" },
  { id: 38, text: "Mommy made me mash my M&Ms.", focus: "M", level: "Easy" },
  { id: 39, text: "A proper copper coffee pot.", focus: "P & C", level: "Medium" },
  { id: 40, text: "Bobby Bipper bought a bat.", focus: "B", level: "Easy" },

  // V, W, F (Labiodentals)
  { id: 41, text: "Very well, very well, very well.", focus: "V & W", level: "Easy" },
  { id: 42, text: "Victor's victory over the vicious vampire was a valuable win.", focus: "V & W", level: "Medium" },
  { id: 43, text: "William always wears a very warm woolen vest in winter.", focus: "V & W", level: "Medium" },
  { id: 44, text: "Vinnie visited the village with twelve vast wagons.", focus: "V & W", level: "Hard" },
  { id: 45, text: "The view of the valley is very wonderful.", focus: "V & W", level: "Easy" },
  { id: 46, text: "Which witch is which?", focus: "W & CH", level: "Easy" },
  { id: 47, text: "Willie’s really weary.", focus: "W & R", level: "Medium" },
  { id: 48, text: "Five wives weave violins.", focus: "V & W", level: "Hard" },
  { id: 49, text: "Witty wives validate vivid whispers.", focus: "V & W", level: "Hard" },
  { id: 50, text: "Vexed vampires vow to walk without water.", focus: "V & W", level: "Hard" },

  // Advanced / Mixed Articulation
  { id: 51, text: "Pad kid poured curd pulled cod.", focus: "Plosives", level: "Hard" },
  { id: 52, text: "To begin to toboggan first buy a toboggan, but don't buy too big a toboggan.", focus: "B & T", level: "Hard" },
  { id: 53, text: "Any noise annoys an oyster, but a noisy noise annoys an oyster most.", focus: "N & S", level: "Medium" },
  { id: 54, text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", focus: "W & CH", level: "Medium" },
  { id: 55, text: "Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair.", focus: "Z & W", level: "Easy" }
];

export default function TongueTwisters() {
  const [filter, setFilter] = useState('All');
  const [focusTwister, setFocusTwister] = useState(null);

  const categories = ['All', 'S & SH', 'R & L', 'TH', 'P', 'B', 'V & W'];
  
  const filtered = filter === 'All' 
    ? TWISTERS 
    : TWISTERS.filter(t => t.focus.includes(filter));

  const getRandom = () => {
    const rand = TWISTERS[Math.floor(Math.random() * TWISTERS.length)];
    setFocusTwister(rand);
  };

  const getColor = (level) => {
    if (level === 'Easy') return 'var(--accent-emerald)';
    if (level === 'Medium') return 'var(--accent-amber)';
    return 'var(--accent-pink)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Precision-engineered phonetic exercises to refine your articulation and speech clarity.
        </p>
        <button className="btn btn-primary" onClick={getRandom}>
          <RefreshCw size={16} /> Random Drill
        </button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: 'var(--space-xs)' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`btn ${filter === cat ? 'btn-primary' : ''}`}
            onClick={() => setFilter(cat)}
            style={{ padding: '4px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
        {filtered.map(t => (
          <div 
            key={t.id} 
            className="card" 
            onClick={() => setFocusTwister(t)}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-md)' }}
          >
            <p style={{ fontSize: '1.05rem', lineHeight: 1.4, margin: '0 0 var(--space-md) 0' }}>"{t.text}"</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                {t.focus}
              </span>
              <span style={{ color: getColor(t.level), fontWeight: 600 }}>{t.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Focus Mode Lightbox */}
      {focusTwister && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(7, 9, 15, 0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)'
        }}>
          <button className="btn-icon" onClick={() => setFocusTwister(null)} style={{ position: 'absolute', top: 'var(--space-lg)', right: 'var(--space-lg)' }}>
            <X size={32} />
          </button>
          
          <div style={{ textAlign: 'center', maxWidth: '800px' }}>
            <Mic size={48} color={getColor(focusTwister.level)} style={{ marginBottom: 'var(--space-lg)', opacity: 0.8 }} />
            <h2 style={{ fontSize: '3rem', lineHeight: 1.3, fontWeight: 700, margin: '0 0 var(--space-lg) 0', color: 'var(--text-main)' }}>
              "{focusTwister.text}"
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', fontSize: '1.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target: <strong style={{ color: 'var(--text-main)' }}>{focusTwister.focus}</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Difficulty: <strong style={{ color: getColor(focusTwister.level) }}>{focusTwister.level}</strong></span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-xl)', fontSize: '1rem' }}>
              Take a deep breath. Focus on over-articulating the target consonants. Start slow, then increase speed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}