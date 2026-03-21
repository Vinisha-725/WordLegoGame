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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3vw, 2rem)',
        position: 'relative',
        zIndex: 1,
        minHeight: '100%',
        width: '100%'
      }}>
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0], 
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <Trophy 
              size={80} 
              color="#fbbf24" 
              style={{ 
                filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.6))',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }} 
            />
          </motion.div>
        </motion.div>

        {/* Winner Title */}
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 10 }}
          style={{ 
            fontSize: 'clamp(2rem, 6vw, 4rem)', 
            fontWeight: 900, 
            marginBottom: '1rem',
            background: isAIWinner 
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
              : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
            textAlign: 'center'
          }}
        >
          {winner === 'Draw' ? 'DRAW!' : `${winner} WINS!`}
        </motion.h1>

        {/* Winner Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
        >
          {isAIWinner && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Sparkles size={20} color="#6366f1" />
              <span style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 600, color: '#6366f1' }}>
                AI Victory! Minimax Algorithm Wins
              </span>
            </motion.div>
          )}
          
          {isHumanWinner && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Target size={20} color="#fbbf24" />
              <span style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 600, color: '#fbbf24' }}>
                Human Victory! Strategic Mastermind
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
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              color: '#ef4444',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} color="#ef4444" />
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            width: '100%',
            maxWidth: '600px',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Hash size={28} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#6366f1' }}>
              {chain.length}
            </div>
            <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Words Built
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Target size={28} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#8b5cf6' }}>
              {gameData.theme}
            </div>
            <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Theme
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '12px',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles size={28} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#fbbf24' }}>
              {gameMode === 'ai' ? 'vs AI' : 'vs Human'}
            </div>
            <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mode
            </div>
          </motion.div>
        </motion.div>

        {/* Word Chain */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            width: '100%',
            maxWidth: '600px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 2rem)',
            backdropFilter: 'blur(20px)',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            paddingBottom: '1rem'
          }}>
            <h3 style={{ 
              textTransform: 'uppercase', 
              fontSize: 'clamp(0.8rem, 2vw, 1rem)', 
              letterSpacing: '0.05em', 
              opacity: 0.8,
              color: '#e2e8f0',
              fontWeight: 600
            }}>
              Final Word Chain
            </h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              opacity: 0.7,
              color: '#6366f1',
              fontWeight: 600,
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)'
            }}>
              <Hash size={14} /> 
              {chain.length} Words
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {chain.map((w, i) => (
              <React.Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    fontWeight: 600, 
                    color: '#6366f1', 
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {w}
                </motion.span>
                {i < chain.length - 1 && (
                  <ChevronRight size={14} style={{ opacity: 0.3 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem',
            width: '100%',
            maxWidth: '350px'
          }}
        >
          <motion.button 
            onClick={onPlayAgain}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: 'clamp(0.75rem, 2vw, 1.5rem)',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: 700,
              fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <RefreshCw size={20} />
            Play Again
          </motion.button>
          
          <motion.button 
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 'clamp(0.6rem, 2vw, 1.25rem)',
              background: 'transparent',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              color: '#6366f1',
              fontWeight: 600,
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Home size={18} />
            Exit to Menu
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default GameOverScreen;
