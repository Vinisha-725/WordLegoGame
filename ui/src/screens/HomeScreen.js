import React, { useState } from 'react';
import './HomeScreen.css';
import ThemeCard from '../components/ThemeCard';

const THEMES = [
  { id: 'animals', name: 'Animals', icon: '🦁' },
  { id: 'fruits', name: 'Fruits', icon: '🍎' },
  { id: 'countries', name: 'Countries', icon: '🌍' },
  { id: 'technology', name: 'Technology', icon: '💻' }
];

function HomeScreen({ onStart }) {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  return (
    <div className="screen home-screen">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1">A</div>
        <div className="shape shape-2">B</div>
        <div className="shape shape-3">C</div>
      </div>

      <div className="home-header">
        <h1 className="game-title">
          <span className="text-secondary">WORD</span>{' '}
          <span className="text-accent">LEGO</span>
        </h1>
        <p className="game-subtitle">Build the longest word chain</p>
      </div>

      <div className="home-card">
        <div className="input-group">
          <label>Player 1 Name</label>
          <input 
            type="text" 
            placeholder="Alice" 
            value={p1} 
            onChange={(e) => setP1(e.target.value)} 
          />
        </div>
        
        <div className="input-group">
          <label>Player 2 Name</label>
          <input 
            type="text" 
            placeholder="Bob" 
            value={p2} 
            onChange={(e) => setP2(e.target.value)} 
          />
        </div>

        <div className="theme-section">
          <h3>Select Theme</h3>
          <div className="theme-grid">
            {THEMES.map(theme => (
              <ThemeCard 
                key={theme.id}
                theme={theme}
                selected={selectedTheme.id === theme.id}
                onClick={() => setSelectedTheme(theme)}
              />
            ))}
          </div>
        </div>

        <button 
          className="btn-start"
          onClick={() => onStart(p1 || 'Player 1', p2 || 'Player 2', selectedTheme)}
        >
          START GAME
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
