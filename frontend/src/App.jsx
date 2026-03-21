import React, { useState, useEffect } from 'react';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import RuleBookScreen from './screens/RuleBookScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, X, Bot } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [screen, setScreen] = useState('setup');
  const [gameData, setGameData] = useState({
    player1: '',
    player2: '',
    theme: '',
    gameMode: 'multiplayer',
    difficulty: 'medium',
    gameId: null,
  });
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [showRuleBook, setShowRuleBook] = useState(false);

  const startGame = async (p1, p2, theme, gameMode = 'multiplayer', difficulty = 'medium') => {
    try {
      setGameData({
        player1: p1,
        player2: p2,
        theme: theme,
        gameMode: gameMode,
        difficulty: difficulty,
      });

      const requestBody = {
        player1: p1,
        player2: p2,
        theme: theme,
        game_mode: gameMode,
        difficulty: difficulty
      };

      const response = await fetch(`${API_BASE}/create_game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      if (data.game_id) {
        setGameData(prev => ({ ...prev, gameId: data.game_id }));
        setScreen('playing');
        fetchGameState(data.game_id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend server.");
    }
  };

  const fetchGameState = async (id) => {
    try {
      const resp = await fetch(`${API_BASE}/game_state?game_id=${id}`);
      const data = await resp.json();
      setGameState(data);
    } catch (err) {
      console.error(err);
    }
  };

  const playAgain = () => {
    setScreen('setup');
    setGameState(null);
    setGameData({
      player1: '',
      player2: '',
      theme: '',
      gameMode: 'multiplayer',
      difficulty: 'medium',
      gameId: null,
    });
  };

  useEffect(() => {
    let interval;
    if (screen === 'playing' && gameData.gameId && !gameState?.winner) {
      interval = setInterval(() => {
        fetchGameState(gameData.gameId);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [screen, gameData.gameId, gameState?.winner]);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 1.05 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
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

      {/* Rule Book Button */}
      <motion.button
        onClick={() => setShowRuleBook(true)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '10px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        whileHover={{ scale: 1.1, background: 'rgba(99, 102, 241, 0.25)' }}
        whileTap={{ scale: 0.95 }}
      >
        <Book size={20} color="#6366f1" />
      </motion.button>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {screen === 'setup' && (
            <SetupScreen onStart={startGame} />
          )}

          {screen === 'playing' && gameState && (
            <GameScreen 
              gameState={gameState} 
              gameData={gameData}
              onUpdate={fetchGameState}
              onGameOver={() => setScreen('game_over')}
            />
          )}

          {screen === 'game_over' && (
            <GameOverScreen 
              gameState={gameState} 
              gameData={gameData}
              onPlayAgain={playAgain}
            />
          )}
        </div>
      </div>

      {/* Rule Book Modal */}
      <AnimatePresence>
        {showRuleBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setShowRuleBook(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              style={{
                width: '90%',
                maxWidth: '800px',
                height: '80%',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '20px',
                padding: '40px',
                position: 'relative',
                overflow: 'auto',
                backdropFilter: 'blur(20px)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowRuleBook(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.1, background: 'rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} color="#ef4444" />
              </motion.button>

              <RuleBookScreen />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(239, 68, 68, 0.9)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'white',
              fontWeight: 600,
              zIndex: 3000,
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
