import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Globe, Dog, Film, PlayCircle } from 'lucide-react';

const themes = [
  { id: 'Fruits', name: 'Fruits', icon: <Apple />, emoji: '🍎' },
  { id: 'Countries', name: 'Countries', icon: <Globe />, emoji: '🌍' },
  { id: 'Animals', name: 'Animals', icon: <Dog />, emoji: '🐘' },
  { id: 'Movies', name: 'Movies', icon: <Film />, emoji: '🎬' },
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
    <div className="setup-container glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
      <motion.h1 
        className="gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem' }}
      >
        WordLego AI
      </motion.h1>
      <p style={{ opacity: 0.8, fontSize: '1.2rem', marginBottom: '3rem' }}>
        Build the longest word chain. Don’t break the rules.
      </p>

      <div className="inputs-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="input-group" style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Player 1 Name</label>
          <input 
            className="input-field"
            placeholder="Enter name..."
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          />
        </div>
        <div className="input-group" style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Player 2 Name</label>
          <input 
            className="input-field"
            placeholder="Enter name..."
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
        </div>
      </div>

      <h3 style={{ textAlign: 'left', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.5rem' }}>Select Theme</h3>
      <div className="theme-grid">
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTheme(theme.id)}
            className={`theme-card glass-panel ${selectedTheme === theme.id ? 'selected' : ''}`}
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: selectedTheme === theme.id ? '2px solid var(--primary)' : '1px solid var(--card-border)',
              boxShadow: selectedTheme === theme.id ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{ fontSize: '2.5rem' }}>{theme.emoji}</div>
            <div style={{ fontWeight: 600 }}>{theme.name}</div>
          </motion.div>
        ))}
      </div>

      <motion.button 
        className="btn-primary"
        disabled={!p1 || !p2 || !selectedTheme}
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ marginTop: '3rem', width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '3rem auto 0' }}
      >
        <PlayCircle size={24} />
        Start Game
      </motion.button>
    </div>
  );
}

export default SetupScreen;
