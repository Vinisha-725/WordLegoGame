import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, CheckCircle, AlertCircle, Clock, Hash, LayoutGrid, Trophy } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function GameScreen({ gameState, gameData, onUpdate, onGameOver }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const turn = gameState?.turn ?? 0;
  const currentP = gameState?.players ? gameState.players[turn] : "Loading...";
  const chain = gameState?.word_chain ?? [];
  const theme = gameState?.theme ?? "Loading...";
  const nextChar = chain.length > 0 ? chain[chain.length - 1].slice(-1).toUpperCase() : "ANY";

  // Winners
  const winner = gameState?.winner;

  useEffect(() => {
    let interval;
    if (timer > 0 && !winner) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && !winner) {
      setFeedback({ message: "Time's up!", type: 'error' });
      // Trigger update to let backend know or handle local loss
      // For now we just show feedback. Usually backend handles it if we sync.
    }
    return () => clearInterval(interval);
  }, [timer, winner]);

  useEffect(() => {
    setTimer(30);
    setWord('');
    setFeedback(null);
    inputRef.current?.focus();
  }, [turn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || winner || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE}/submit_word?game_id=${gameData.gameId}&player=${encodeURIComponent(currentP)}&word=${encodeURIComponent(word)}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.valid) {
        setFeedback({ message: "Great move!", type: 'success' });
        await onUpdate(gameData.gameId);
        setWord('');
      } else {
        setFeedback({ message: data.reason, type: 'error' });
        await onUpdate(gameData.gameId); 
      }
    } catch (err) {
      setFeedback({ message: "Network error!", type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  return (
    <div className="game-screen-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Top Bar */}
      <div className="top-bar-mobile" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.6rem', opacity: 0.5, fontWeight: 700, letterSpacing: '0.1em' }}>THEME</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>{theme.toUpperCase()}</span>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}
          >
            {currentP}
          </motion.div>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>CURRENT TURN</div>
        </div>

        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '1.2rem', fontWeight: 900, color: timer < 10 ? 'var(--error)' : 'var(--accent)' }}>{timer}s</div>
           <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '2px', overflow: 'hidden' }}>
              <motion.div 
                style={{ height: '100%', background: timer < 10 ? 'var(--error)' : 'var(--success)' }}
                animate={{ width: `${(timer / 30) * 100}%` }}
              />
           </div>
        </div>
      </div>

      {/* Center: Scrollable Word Chain */}
      <div className="scroll-hidden" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '2rem' }}>
        {chain.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
            <LayoutGrid size={60} />
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>No words yet</p>
          </div>
        ) : (
          chain.map((w, i) => (
            <motion.div
              key={`${w}-${i}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                background: i === chain.length - 1 ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--card-bg)',
                padding: '0.75rem 1.25rem',
                borderRadius: i % 2 === 0 ? '1.5rem 1.5rem 1.5rem 0.25rem' : '1.5rem 1.5rem 0.25rem 1.5rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                maxWidth: '80%',
                boxShadow: i === chain.length - 1 ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                border: '1px solid var(--card-border)'
              }}
            >
              {w}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer: Hint & Input */}
      <div className="footer-input" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--card-border)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)' }}>
             <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 600 }}>STARTS WITH</span>
             <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{nextChar}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <input 
            ref={inputRef}
            className={`input-field ${feedback?.type === 'error' ? 'shake' : ''}`}
            placeholder="Type your word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={isSubmitting || winner}
            style={{ paddingRight: '4rem' }}
          />
          <button 
            type="submit" 
            disabled={!word || winner || isSubmitting}
            style={{ 
              position: 'absolute', right: '8px', top: '8px', bottom: '8px', 
              width: '45px', background: 'var(--primary)', border: 'none', 
              borderRadius: '0.75rem', color: 'white', display: 'flex', 
              alignItems: 'center', justifyContent: 'center' 
            }}
          >
            {isSubmitting ? '...' : <Send size={20} />}
          </button>
        </form>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ 
                marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem',
                color: feedback.type === 'success' ? 'var(--success)' : 'var(--error)', fontWeight: 700 
              }}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
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
                <li>✅ Follow theme (Semantic AI Check)</li>
                <li>🔤 Start with last letter of previous word</li>
                <li>🔗 Multi-word terms allowed (Max 3)</li>
                <li>🚫 No repeated words</li>
                <li>🚫 NO CUSS WORDS (Instant loss)</li>
                <li>⏱️ 30 seconds per turn</li>

              </ul>
              <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setShowRules(false)}>GOT IT</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Winner Popup */}
      <AnimatePresence>
        {winner && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel" 
              style={{ width: '90%', maxWidth: '450px', padding: '4rem 2rem', textAlign: 'center', border: '2px solid rgba(99, 102, 241, 0.5)' }}
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy size={100} color="var(--accent)" style={{ marginBottom: '2rem' }} />
              </motion.div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{winner}</h2>
              <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem' }}>WON!!</h1>
              {gameState?.reason && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--error)', fontWeight: 600 }}>Reason: {gameState.reason}</p>
                </div>
              )}
              <p style={{ opacity: 0.8, marginBottom: '3rem', fontSize: '1.1rem' }}>Great gameplay! Time to see the stats.</p>

              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.2rem' }}
                onClick={() => onGameOver()}
              >
                VIEW FINAL SCORE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </div>
  );
}

export default GameScreen;

