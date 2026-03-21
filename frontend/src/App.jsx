import React, { useState, useEffect } from 'react';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import { AnimatePresence, motion } from 'framer-motion';

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

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SetupScreen onStart={startGame} />
          </motion.div>
        )}

        {screen === 'playing' && gameState && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameScreen 
              gameState={gameState} 
              gameData={gameData}
              onUpdate={fetchGameState}
              onGameOver={() => setScreen('game_over')}
            />
          </motion.div>
        )}

        {screen === 'game_over' && (
          <motion.div
            key="game_over"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameOverScreen 
              gameState={gameState} 
              gameData={gameData}
              onPlayAgain={playAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="error-toast glass-panel">
          {error}
          <button onClick={() => setError(null)}>✖</button>
        </div>
      )}
    </div>
  );
}

export default App;
