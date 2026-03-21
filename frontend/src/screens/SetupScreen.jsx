import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, Globe, Dog, Film, PlayCircle, Bot, Users, Sparkles, Gamepad2 } from 'lucide-react';

const themes = [
  { id: 'Fruits', name: 'Fruits', icon: <Apple />, emoji: '🍎', color: '#ef4444' },
  { id: 'Atlas', name: 'Atlas', icon: <Globe />, emoji: '🌍', color: '#3b82f6' },
  { id: 'Animals', name: 'Animals', icon: <Dog />, emoji: '🐘', color: '#f59e0b' },
  { id: 'Things', name: 'Things', icon: <Film />, emoji: '📦', color: '#8b5cf6' },
];

const gameModes = [
  { id: 'multiplayer', name: 'vs Human', icon: <Users />, emoji: '👥', color: '#10b981' },
  { id: 'ai', name: 'vs AI', icon: <Bot />, emoji: '🤖', color: '#6366f1' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', emoji: '😊', color: '#10b981' },
  { id: 'medium', name: 'Medium', emoji: '🎯', color: '#f59e0b' },
  { id: 'hard', name: 'Hard', emoji: '🔥', color: '#ef4444' },
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
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      position: 'relative',
      overflow: 'auto',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite'
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ marginBottom: '1rem' }}
        >
          <Gamepad2 size={48} color="#6366f1" />
        </motion.div>
        <motion.h1 
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
          }}
        >
          WordLego AI
        </motion.h1>
        <motion.p 
          style={{ 
            opacity: 0.8, 
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            color: '#94a3b8'
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Strategic Word Building with Advanced AI
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Player Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}
        >
          <div style={{ position: 'relative' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 600, 
              fontSize: '0.8rem', 
              color: '#a5b4fc',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Player 1
            </label>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <input 
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Enter your name..."
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </motion.div>
          </div>

          {gameMode === 'multiplayer' ? (
            <div style={{ position: 'relative' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 600, 
                fontSize: '0.8rem', 
                color: '#a5b4fc',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Player 2
              </label>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <input 
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '2px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter opponent name..."
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </motion.div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Bot size={20} color="#6366f1" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>AI Opponent</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Powered by Minimax</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Game Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ 
            marginBottom: '1rem', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} color="#fbbf24" />
            Game Mode
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {gameModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameMode(mode.id)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: gameMode === mode.id 
                    ? `linear-gradient(135deg, ${mode.color}20, ${mode.color}10)` 
                    : 'rgba(15, 23, 42, 0.8)',
                  border: gameMode === mode.id 
                    ? `2px solid ${mode.color}` 
                    : '2px solid rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {gameMode === mode.id && (
                  <motion.div
                    layoutId="selectedMode"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${mode.color}10, ${mode.color}05)`,
                      borderRadius: '10px'
                    }}
                  />
                )}
                <div style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>{mode.emoji}</div>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '0.9rem', 
                  color: 'white',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {mode.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Difficulty */}
        {gameMode === 'ai' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 style={{ 
              marginBottom: '1rem', 
              fontWeight: 700, 
              fontSize: '1.1rem',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bot size={18} color="#6366f1" />
              AI Difficulty
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {difficulties.map((diff) => (
                <motion.div
                  key={diff.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(diff.id)}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    background: difficulty === diff.id 
                      ? `linear-gradient(135deg, ${diff.color}20, ${diff.color}10)` 
                      : 'rgba(15, 23, 42, 0.8)',
                    border: difficulty === diff.id 
                      ? `2px solid ${diff.color}` 
                      : '2px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{diff.emoji}</div>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    {diff.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ 
            marginBottom: '1rem', 
            fontWeight: 700, 
            fontSize: '1.1rem',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} color="#fbbf24" />
            Choose Theme
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTheme(theme.id)}
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: selectedTheme === theme.id 
                    ? `linear-gradient(135deg, ${theme.color}20, ${theme.color}10)` 
                    : 'rgba(15, 23, 42, 0.8)',
                  border: selectedTheme === theme.id 
                    ? `2px solid ${theme.color}` 
                    : '2px solid rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedTheme === theme.id && (
                  <motion.div
                    layoutId="selectedTheme"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${theme.color}10, ${theme.color}05)`,
                      borderRadius: '10px'
                    }}
                  />
                )}
                <div style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>{theme.emoji}</div>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '0.9rem', 
                  color: 'white',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {theme.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ position: 'relative', zIndex: 1, marginTop: '1rem' }}
      >
        <motion.button 
          className="btn-primary"
          disabled={!isFormValid}
          onClick={handleStart}
          style={{ 
            width: '100%', 
            maxWidth: '300px',
            margin: '0 auto',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '12px',
            background: isFormValid 
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
              : 'rgba(100, 116, 139, 0.3)',
            border: 'none',
            color: 'white',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: isFormValid 
              ? '0 10px 30px rgba(99, 102, 241, 0.3)' 
              : 'none',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={isFormValid ? { scale: 1.05, y: -2 } : {}}
          whileTap={isFormValid ? { scale: 0.95 } : {}}
        >
          <PlayCircle size={20} />
          {gameMode === 'ai' ? 'Start vs AI' : 'Start Game'}
        </motion.button>
      </motion.div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @media (max-width: 768px) {
          .setup-container {
            padding: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SetupScreen;
