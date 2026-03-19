import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Home, RefreshCw, Hash, ChevronRight } from 'lucide-react';

function GameOverScreen({ gameState, gameData, onPlayAgain }) {
  const winner = gameState?.winner || "Draw";
  const chain = gameState?.word_chain || [];

  useEffect(() => {
    if (winner !== "Draw") {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [winner]);

  return (
    <div className="game-over-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem 1.5rem', textAlign: 'center', overflowY: 'auto' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        style={{ marginTop: '2rem' }}
      >
        <Trophy size={80} color="var(--accent)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))' }} />
      </motion.div>

      <motion.h1 
        className="gradient-text"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}
      >
        {winner} Wins!
      </motion.h1>
      
      {gameState?.reason && (
        <p style={{ fontSize: '1rem', color: 'var(--error)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {gameState.reason}
        </p>
      )}

      <p style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '2.5rem' }}>
        Vocabulary Champion!
      </p>

      <div className="chain-summary glass-panel scroll-hidden" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', textAlign: 'left', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
           <h3 style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.2em', opacity: 0.6 }}>Final Word Chain</h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6, fontSize: '0.7rem' }}>
             <Hash size={12} /> {chain.length} Words
           </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'baseline' }}>
          {chain.map((w, i) => (
            <React.Fragment key={i}>
              <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>{w}</span>
              {i < chain.length - 1 && <ChevronRight size={12} style={{ opacity: 0.3 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
        <motion.button 
          className="btn-primary"
          onClick={onPlayAgain}
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          <RefreshCw size={20} />
          Play Again
        </motion.button>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            background: 'transparent', border: '1px solid var(--card-border)', 
            color: 'white', padding: '1.25rem', borderRadius: '1rem', 
            fontWeight: 700, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', gap: '0.75rem', cursor: 'pointer',
            fontSize: '0.9rem', opacity: 0.6
          }}
        >
          <Home size={18} />
          Exit
        </button>
      </div>
    </div>
  );
}


export default GameOverScreen;
