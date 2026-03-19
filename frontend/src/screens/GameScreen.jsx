import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, CheckCircle, AlertCircle, Clock, Hash, LayoutGrid } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function GameScreen({ gameState, gameData, onUpdate }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const inputRef = useRef(null);

  const turn = gameState?.turn ?? 0;
  const currentP = gameState?.players ? gameState.players[turn] : "Loading...";
  const chain = gameState?.word_chain ?? [];
  const theme = gameState?.theme ?? "Loading...";
  const nextChar = chain.length > 0 ? chain[chain.length - 1].slice(-1).toUpperCase() : "ANY";

  useEffect(() => {
    let interval;
    if (timer > 0 && !gameState?.winner) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && !gameState?.winner) {
      // Game over logic manually handled by backend if we sync. 
      // For now we'll show feedback
      setFeedback({ message: "Time's up!", type: 'error' });
    }
    return () => clearInterval(interval);
  }, [timer, gameState?.winner]);

  // Reset timer on turn switch
  useEffect(() => {
    setTimer(30);
    setWord('');
    setFeedback(null);
    inputRef.current?.focus();
  }, [turn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || gameState?.winner) return;

    try {
      const response = await fetch(`${API_BASE}/submit_word?game_id=${gameData.gameId}&player=${encodeURIComponent(currentP)}&word=${encodeURIComponent(word)}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.valid) {
        setFeedback({ message: "Great move!", type: 'success' });
        onUpdate(gameData.gameId);
        setWord('');
      } else {
        setFeedback({ message: data.reason, type: 'error' });
        onUpdate(gameData.gameId); // For winner update
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Network error!", type: 'error' });
    }
  };

  return (
    <div className="game-screen-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '80vh' }}>
      
      {/* Top Bar */}
      <div className="top-bar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem' }}>
        <div className="theme-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <LayoutGrid size={20} color="var(--primary)" />
          {theme}
        </div>
        
        <div className="turn-indicator" style={{ textAlign: 'center' }}>
          <motion.div 
            animate={{ scale: [1, 1.05, 1], shadow: "0 0 10px rgba(99, 102, 241, 0.4)" }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ padding: '0.5rem 2rem', borderRadius: '2rem', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}
          >
            {currentP}'s Turn
          </motion.div>
        </div>

        <div className="timer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={20} color={timer < 10 ? "var(--error)" : "var(--accent)"} />
          <div style={{ fontSize: '1.5rem', fontWeight: 800, width: '40px', color: timer < 10 ? "var(--error)" : "var(--accent)" }}>{timer}s</div>
          <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: timer < 10 ? "var(--error)" : "var(--success)" }} 
              initial={{ width: '100%' }}
              animate={{ width: `${(timer / 30) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
        </div>
      </div>

      {/* Center: Word Chain */}
      <div className="chain-display glass-panel" style={{ flex: 1, padding: '2rem', minHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
           <h4 style={{ opacity: 0.6, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em' }}>Word Chain</h4>
           <div style={{ opacity: 0.6, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Hash size={12} /> {chain.length} Words
           </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {chain.map((w, i) => (
            <motion.div
              key={`${w}-${i}`}
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="word-pill"
              style={{
                background: i === chain.length - 1 ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                padding: '0.5rem 1.25rem',
                borderRadius: '1rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: i === chain.length - 1 ? '1.2rem' : '1rem'
              }}
            >
              {w}
            </motion.div>
          ))}
          {chain.length === 0 && (
            <div style={{ margin: 'auto', opacity: 0.3, fontSize: '1.2rem', textAlign: 'center' }}>No words yet. Break the ice!</div>
          )}
        </div>
      </div>

      {/* Info Panel & Input */}
      <div className="input-section glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
          <div className="hint-card glass-panel" style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', textAlign: 'center', minWidth: '180px' }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Next word starts with</div>
            <div className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{nextChar}</div>
          </div>

          <div style={{ flex: 1 }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
              <input 
                ref={inputRef}
                className={`input-field ${feedback?.type === 'error' ? 'shake' : ''}`}
                style={{ fontSize: '1.5rem', padding: '1.2rem 2rem', paddingRight: '120px' }}
                placeholder="Enter word..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                autoComplete="off"
              />
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!word || gameState?.winner}
                style={{ position: 'absolute', right: '8px', top: '8px', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontSize: '1rem' }}
              >
                SUBMIT
              </button>
            </form>
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    marginTop: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: feedback.type === 'success' ? 'var(--success)' : 'var(--error)',
                    fontWeight: 600
                  }}
                >
                  {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {feedback.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Rules Action */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowRules(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
        >
          <HelpCircle size={32} />
        </motion.button>
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel" 
              style={{ width: '90%', maxWidth: '500px', padding: '3rem', position: 'relative' }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Game Rules</h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                <li>✅ Must follow the selected theme</li>
                <li>🔤 Must start with last letter of previous word</li>
                <li>🚫 No repeated words</li>
                <li>🚫 Only single words allowed</li>
                <li>⏱️ 30 seconds per turn</li>
              </ul>
              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '2rem' }}
                onClick={() => setShowRules(false)}
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GameScreen;
