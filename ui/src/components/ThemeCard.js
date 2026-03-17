import React from 'react';
import './ThemeCard.css';

function ThemeCard({ theme, selected, onClick }) {
  return (
    <div 
      className={`theme-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="theme-icon">{theme.icon}</div>
      <div className="theme-name">{theme.name}</div>
    </div>
  );
}

export default ThemeCard;
