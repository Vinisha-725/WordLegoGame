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
    <div className="game-over-container glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
      >
        <Trophy size={100} color="var(--accent)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))' }} />
      </motion.div>

      <motion.h1 
        className="gradient-text"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1rem' }}
      >
        {winner} Wins!
      </motion.h1>
      
      <p style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '3rem' }}>
        A brilliant display of vocabulary!
      </p>

      <div className="chain-summary glass-panel" style={{ padding: '2rem', marginBottom: '4rem', background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
           <h3 style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.2em', opacity: 0.6 }}>Final Word Chain</h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
             <Hash size={14} /> {chain.length} Total Words
           </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {chain.map((w, i) => (
            <React.Fragment key={i}>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{w}</span>
              {i < chain.length - 1 && <ChevronRight size={14} style={{ opacity: 0.3 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="actions" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <motion.button 
          className="btn-primary"
          onClick={onPlayAgain}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 3rem' }}
        >
          <RefreshCw size={20} />
          Play Again
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          style={{ 
            background: 'transparent', 
            border: '2px solid var(--card-border)', 
            color: 'white', 
            padding: '1.25rem 3rem', 
            borderRadius: '1rem', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <Home size={20} />
          Exit
        </motion.button>
      </div>
    </div>
  );
}

export default GameOverScreen;
