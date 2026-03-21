import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Globe, Dog, Film, PlayCircle } from 'lucide-react';

const themes = [
  { id: 'Fruits', name: 'Fruits', icon: <Apple />, emoji: '🍎' },
  { id: 'Atlas', name: 'Atlas', icon: <Globe />, emoji: '🌍' },
  { id: 'Animals', name: 'Animals', icon: <Dog />, emoji: '🐘' },
  { id: 'Things', name: 'Things', icon: <Film />, emoji: '📦' },
];

function SetupScreen({ onStart }) {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleStart = () => {
    if (p1 && p2 && selectedTheme) {
      onStart(p1, p2, selectedTheme);
    }
  };

  return (
    <div className="setup-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem 1.5rem', overflowY: 'auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h1 
          className="gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}
        >
          WordLego AI
        </motion.h1>
        <p style={{ opacity: 0.6, fontSize: '1rem' }}>
          Build the longest chain. Follow the theme.
        </p>
      </header>

      <div className="form-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>PLAYER 1</label>
          <input 
            className="input-field"
            placeholder="Enter name..."
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>PLAYER 2</label>
          <input 
            className="input-field"
            placeholder="Enter name..."
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
        </div>
      </div>

      <div className="theme-section">
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.2rem' }}>CHOOSE THEME</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(theme.id)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selectedTheme === theme.id ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                background: selectedTheme === theme.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{ fontSize: '2rem' }}>{theme.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{theme.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <motion.button 
          className="btn-primary"
          disabled={!p1 || !p2 || !selectedTheme}
          onClick={handleStart}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          <PlayCircle size={24} />
          Start Game
        </motion.button>
      </div>
    </div>
  );
}


export default SetupScreen;
