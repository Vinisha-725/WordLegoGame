import React, { useEffect, useState } from 'react';
import './Timer.css';

function Timer({ secondsLeft, maxSeconds = 30 }) {
  const percentage = (secondsLeft / maxSeconds) * 100;
  
  // Color logic
  let colorClass = 'timer-good';
  if (secondsLeft <= 10) colorClass = 'timer-warning';
  if (secondsLeft <= 5) colorClass = 'timer-danger';

  return (
    <div className={`timer-container ${colorClass}`}>
      <svg className="timer-svg" viewBox="0 0 100 100">
        <circle 
          className="timer-track" 
          cx="50" cy="50" r="45" 
        />
        <circle 
          className="timer-progress" 
          cx="50" cy="50" r="45" 
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * percentage) / 100}
        />
      </svg>
      <div className="timer-text">
        {secondsLeft}
      </div>
    </div>
  );
}

export default Timer;
