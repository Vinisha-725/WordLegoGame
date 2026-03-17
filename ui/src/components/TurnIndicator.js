import React from 'react';
import './TurnIndicator.css';

function TurnIndicator({ activePlayerName }) {
  return (
    <div className="turn-indicator">
      <div className="turn-avatar">
        {activePlayerName ? activePlayerName.charAt(0).toUpperCase() : '?'}
      </div>
      <div className="turn-info">
        <span className="turn-label">Current Turn</span>
        <span className="turn-name">{activePlayerName}</span>
      </div>
      <div className="turn-pulse"></div>
    </div>
  );
}

export default TurnIndicator;
