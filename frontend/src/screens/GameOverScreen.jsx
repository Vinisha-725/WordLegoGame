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
      overflow: 'hidden',
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
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
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
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Trophy Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          style={{ marginBottom: '2rem' }}
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
              size={120} 
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
            fontSize: '4rem', 
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
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          {isAIWinner && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1rem 2rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Sparkles size={24} color="#6366f1" />
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#6366f1' }}>
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
                gap: '12px',
                padding: '1rem 2rem',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Target size={24} color="#fbbf24" />
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>
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
              padding: '1rem 2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              color: '#ef4444',
              fontWeight: 600,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} color="#ef4444" />
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '800px',
            marginBottom: '3rem'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Hash size={32} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#6366f1' }}>
              {chain.length}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Words Built
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Target size={32} color="#8b5cf6" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#8b5cf6' }}>
              {gameData.theme}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Theme
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles size={32} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24' }}>
              {gameMode === 'ai' ? 'vs AI' : 'vs Human'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
            maxWidth: '800px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '20px',
            padding: '2rem',
            backdropFilter: 'blur(20px)',
            marginBottom: '3rem'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
            paddingBottom: '1rem'
          }}>
            <h3 style={{ 
              textTransform: 'uppercase', 
              fontSize: '1rem', 
              letterSpacing: '0.1em', 
              opacity: 0.8,
              color: '#e2e8f0',
              fontWeight: 600
            }}>
              Final Word Chain
            </h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              opacity: 0.7,
              color: '#6366f1',
              fontWeight: 600
            }}>
              <Hash size={16} /> 
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
                  transition={{ delay: i * 0.1 }}
                  style={{ 
                    fontWeight: 600, 
                    color: '#6366f1', 
                    fontSize: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {w}
                </motion.span>
                {i < chain.length - 1 && (
                  <ChevronRight size={16} style={{ opacity: 0.3 }} />
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
            gap: '1rem',
            width: '100%',
            maxWidth: '400px'
          }}
        >
          <motion.button 
            onClick={onPlayAgain}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <RefreshCw size={24} />
            Play Again
          </motion.button>
          
          <motion.button 
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: 'transparent',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '16px',
              color: '#6366f1',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Home size={20} />
            Exit to Menu
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default GameOverScreen;
