import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Home, RefreshCw, Hash, ChevronRight, Sparkles, Target, Zap } from 'lucide-react';

function GameOverScreen({ gameState, gameData, onPlayAgain }) {
  const winner = gameState?.winner || "Draw";
  const chain = gameState?.word_chain || [];
  const gameMode = gameData?.gameMode || 'multiplayer';

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

  const isAIWinner = winner === 'AI' && gameMode === 'ai';
  const isHumanWinner = winner !== 'AI' && winner !== 'Draw';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '2rem 1.5rem',
      backgroundColor: 'transparent',
      fontFamily: 'var(--font-main)',
      color: 'var(--foreground)'
    }} className="scroll-hidden">

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          style={{ marginBottom: '1rem' }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0], 
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Trophy size={80} color="var(--primary-hover)" />
          </motion.div>
        </motion.div>

        {/* Winner Title */}
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 10 }}
          className="gradient-text"
          style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: 900, 
            marginBottom: '1rem',
            textAlign: 'center',
            textShadow: '3px 3px 0px #ffffff'
          }}
        >
          {winner === 'Draw' ? 'DRAW!' : `${winner} WINS!`}
        </motion.h1>

        {/* Winner Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2rem', width: '100%' }}
        >
          {isAIWinner && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '0.75rem 1.5rem', background: '#ffffff',
                border: '4px dashed var(--card-border)', borderRadius: '8px',
                boxShadow: '6px 6px 0 var(--card-border)'
              }}
            >
              <Sparkles size={24} color="var(--secondary)" />
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                AI Victory! Minimax Rules
              </span>
            </motion.div>
          )}
          
          {isHumanWinner && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '0.75rem 1.5rem', background: '#ffffff',
                border: '4px dashed var(--card-border)', borderRadius: '8px',
                boxShadow: '6px 6px 0 var(--card-border)'
              }}
            >
              <Target size={24} color="var(--primary-hover)" />
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                Human Victory! Awesome!
              </span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Game Reason */}
        {gameState?.reason && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: '#ffffff',
              border: '4px dashed var(--error)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              color: 'var(--error)',
              fontWeight: 'bold',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              boxShadow: '6px 6px 0 var(--error)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={22} />
              {gameState.reason}
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            width: '100%',
            marginBottom: '2rem'
          }}
        >
          <motion.div whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: 'var(--accent)', border: '4px solid var(--card-border)', borderRadius: '8px',
              padding: '1.5rem 0.5rem', textAlign: 'center', boxShadow: '6px 6px 0 var(--card-border)'
            }}
          >
            <Hash size={28} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textShadow: '2px 2px 0 #fff' }}>
              {chain.length}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Words</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: '#ffffff', border: '4px solid var(--card-border)', borderRadius: '8px',
              padding: '1.5rem 0.5rem', textAlign: 'center', boxShadow: '6px 6px 0 var(--card-border)'
            }}
          >
            <Target size={28} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', textShadow: '2px 2px 0 var(--primary)' }}>
              {gameData.theme || 'Any'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Theme</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: 'var(--primary)', border: '4px solid var(--card-border)', borderRadius: '8px',
              padding: '1.5rem 0.5rem', textAlign: 'center', boxShadow: '6px 6px 0 var(--card-border)'
            }}
          >
            <Sparkles size={28} style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', textShadow: '2px 2px 0 #fff' }}>
              {gameMode === 'ai' ? 'VS AI' : 'VS P2'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Mode</div>
          </motion.div>
        </motion.div>

        {/* Word Chain */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            width: '100%',
            background: '#ffffff',
            border: '4px solid var(--card-border)',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '6px 6px 0 var(--card-border)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '4px dashed var(--card-border)', paddingBottom: '1rem' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
              Final Chain
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              <Hash size={18} /> {chain.length} Words
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
            {chain.length === 0 ? (
              <span style={{ fontWeight: 'bold', opacity: 0.5, fontSize: '1.2rem' }}>No words played.</span>
            ) : (
              chain.map((w, i) => (
                <React.Fragment key={i}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ 
                      fontWeight: 'bold', fontSize: '1.4rem', padding: '0.5rem 1rem', fontFamily: 'var(--font-heading)',
                      background: 'var(--background)', borderRadius: '8px', border: '4px solid var(--card-border)',
                      boxShadow: '4px 4px 0 var(--card-border)', textTransform: 'uppercase'
                    }}
                  >
                    {w}
                  </motion.span>
                  {i < chain.length - 1 && (
                    <ChevronRight size={24} style={{ opacity: 0.8 }} />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '350px' }}
        >
          <motion.button 
            onClick={onPlayAgain}
            className="btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <RefreshCw size={24} /> PLAY AGAIN
          </motion.button>
          
          <motion.button 
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '1rem', background: '#fff',
              border: '4px dashed var(--card-border)', borderRadius: '8px',
              color: 'var(--foreground)', fontWeight: 'bold', fontSize: '1.4rem', fontFamily: 'var(--font-heading)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.3s ease', boxShadow: '6px 6px 0 var(--card-border)'
            }}
          >
            <Home size={20} /> EXIT
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default GameOverScreen;
