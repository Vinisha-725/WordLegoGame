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
