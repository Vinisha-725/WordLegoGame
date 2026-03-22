import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Globe, Dog, Film, PlayCircle, Bot, Users, Sparkles } from 'lucide-react';

const themes = [
  { id: 'Fruits', name: 'Fruits', icon: <Apple />, emoji: '🍎', color: '#eaca53' },
  { id: 'Atlas', name: 'Atlas', icon: <Globe />, emoji: '🌍', color: '#8db5a6' },
  { id: 'Animals', name: 'Animals', icon: <Dog />, emoji: '🐘', color: '#e97a5a' },
  { id: 'Things', name: 'Things', icon: <Film />, emoji: '📦', color: '#8bbd8b' },
];

const gameModes = [
  { id: 'multiplayer', name: 'vs Human', icon: <Users />, emoji: '👥', color: '#8db5a6' },
  { id: 'ai', name: 'vs AI', icon: <Bot />, emoji: '🤖', color: '#e97a5a' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', emoji: '🌱', color: '#8bbd8b' },
  { id: 'medium', name: 'Medium', emoji: '🎯', color: '#eaca53' },
  { id: 'hard', name: 'Hard', emoji: '🔥', color: '#e07a5f' },
];

function SetupScreen({ onStart }) {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [gameMode, setGameMode] = useState('multiplayer');
  const [difficulty, setDifficulty] = useState('medium');

  const handleStart = () => {
    if (p1 && selectedTheme && gameMode) {
      const player2Name = gameMode === 'ai' ? 'AI' : p2;
      if (gameMode === 'multiplayer' && !p2) return;
      
      onStart(p1, player2Name, selectedTheme, gameMode, difficulty);
    }
  };

  const isFormValid = p1 && selectedTheme && (gameMode === 'ai' ? true : p2);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1.5rem',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      color: 'var(--foreground)',
      fontFamily: 'var(--font-main)'
    }} className="scroll-hidden">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', marginBottom: '2rem', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '4rem',
          fontFamily: 'var(--font-heading)',
          margin: '0',
          textShadow: '3px 3px 0 #ffffff',
          letterSpacing: '2px'
        }}>
          WordLego
        </h1>
        <p style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '-0.5rem', opacity: 0.8 }}>
          a cozy word game ✏️
        </p>
      </motion.div>

      {/* Main Content Centered */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        
        {/* Player Inputs */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>Player 1:</label>
            <input className="input-field" placeholder="your name..." value={p1} onChange={(e) => setP1(e.target.value)} />
          </div>
          
          {gameMode === 'multiplayer' ? (
            <div>
              <label style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem', paddingLeft: '0.5rem' }}>Player 2:</label>
              <input className="input-field" placeholder="friend's name..." value={p2} onChange={(e) => setP2(e.target.value)} />
            </div>
          ) : (
            <div style={{ background: '#fff', border: '2px dashed var(--card-border)', borderRadius: '20px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Bot size={28} />
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>Playing vs AI</span>
            </div>
          )}
        </motion.div>

        {/* Game Mode Selection */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ width: '100%' }}>
          <h3 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Mode</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {gameModes.map((mode) => (
              <motion.div key={mode.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameMode(mode.id)}
                style={{
                  flex: 1, padding: '1rem', cursor: 'pointer', borderRadius: '20px',
                  background: gameMode === mode.id ? 'var(--card-bg)' : '#fdfbf3',
                  border: gameMode === mode.id ? `3px solid var(--card-border)` : '2px dashed #ccc',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: gameMode === mode.id ? '3px 3px 0 var(--card-border)' : 'none'
                }}>
                <div style={{ fontSize: '2rem' }}>{mode.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{mode.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Difficulty */}
        {gameMode === 'ai' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Difficulty</h3>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {difficulties.map((diff) => (
                <motion.div key={diff.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDifficulty(diff.id)}
                  style={{
                    flex: 1, padding: '0.5rem', cursor: 'pointer', borderRadius: '15px',
                    background: '#fff', border: difficulty === diff.id ? `3px solid var(--card-border)` : '2px dashed #ccc',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    boxShadow: difficulty === diff.id ? '2px 2px 0 var(--card-border)' : 'none'
                  }}>
                  <div style={{ fontSize: '1.5rem' }}>{diff.emoji}</div>
                  <div style={{ fontWeight: 'bold' }}>{diff.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Theme Selection */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ width: '100%' }}>
          <h3 style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Theme / Pack</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {themes.map((theme) => (
              <motion.div key={theme.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTheme(theme.id)}
                style={{
                  padding: '1rem', cursor: 'pointer', borderRadius: '20px',
                  background: '#fff', border: selectedTheme === theme.id ? `3px solid var(--card-border)` : '2px dashed #ccc',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: selectedTheme === theme.id ? '3px 3px 0 var(--card-border)' : 'none'
                }}>
                <div style={{ fontSize: '1.8rem' }}>{theme.emoji}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{theme.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Start Button */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '3rem', width: '100%', maxWidth: '300px' }}>
        <button className="btn-primary" disabled={!isFormValid} onClick={handleStart} style={{ width: '100%', padding: '1.2rem' }}>
          PLAY <PlayCircle size={20} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
        </button>
      </motion.div>
    </div>
  );
}

export default SetupScreen;
