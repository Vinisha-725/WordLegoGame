import React, { useState } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import WinnerScreen from './screens/WinnerScreen';

function App() {
  const [screen, setScreen] = useState('home'); // 'home', 'game', 'over'
  const [players, setPlayers] = useState({ p1: 'Alice', p2: 'Bob' });
  const [theme, setTheme] = useState({ name: 'Animals', icon: '🦁' });
  const [winner, setWinner] = useState('');
  const [finalChain, setFinalChain] = useState([]);

  const handleStartGame = (p1, p2, selectedTheme) => {
    setPlayers({ p1: p1 || 'Player 1', p2: p2 || 'Player 2' });
    setTheme(selectedTheme);
    setScreen('game');
  };

  const handleGameOver = (winName, chain) => {
    setWinner(winName);
    setFinalChain(chain);
    setScreen('over');
  };

  const handlePlayAgain = () => {
    setScreen('game');
  };

  const handleGoHome = () => {
    setScreen('home');
  };

  return (
    <div className="app-container">
      {screen === 'home' && (
        <HomeScreen onStart={handleStartGame} />
      )}
      {screen === 'game' && (
        <GameScreen 
          players={players} 
          theme={theme} 
          onGameOver={handleGameOver} 
        />
      )}
      {screen === 'over' && (
        <WinnerScreen 
          winner={winner}
          finalChain={finalChain}
          onPlayAgain={handlePlayAgain}
          onHome={handleGoHome}
        />
      )}
    </div>
  );
}

export default App;
