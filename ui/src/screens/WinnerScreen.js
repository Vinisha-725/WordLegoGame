import React from 'react';
import './WinnerScreen.css';

function WinnerScreen({ winner, finalChain, onPlayAgain, onHome }) {
  return (
    <div className="screen winner-screen">
      {/* Floating background shapes from home */}
      <div className="floating-shapes">
        <div className="shape shape-1" style={{ animationDelay: '-2s' }}>W</div>
        <div className="shape shape-2" style={{ fontSize: '120px', animationDelay: '-8s' }}>👑</div>
      </div>

      <div className="winner-card">
        <h1 className="game-over-title">
          <span className="text-error">GAME</span>{' '}
          <span className="text-text-main">OVER</span>
        </h1>

        <div className="winner-announcement">
          <span className="trophy-icon">🏆</span>
          <span className="winner-text">Winner: <span className="text-secondary">{winner}</span></span>
        </div>

        <div className="final-chain-container">
          <h3 className="chain-title">Final Word Chain</h3>
          <div className="final-chain-list">
            {finalChain.length === 0 ? (
              <div className="no-words">No words were played</div>
            ) : (
              finalChain.map((word, index) => (
                <div key={index} className="final-chain-item">
                  <span className="item-number">{index + 1}</span>
                  <span className="item-word">{word.toUpperCase()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="winner-actions">
          <button className="btn-play-again" onClick={onPlayAgain}>
            PLAY AGAIN
          </button>
          <button className="btn-back-home" onClick={onHome}>
            BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerScreen;
