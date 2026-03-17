import React, { useEffect, useRef } from 'react';
import './WordChain.css';

function WordChain({ words }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to right when new word is added
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [words]);

  return (
    <div className="word-chain-container" ref={scrollRef}>
      <div className="word-chain">
        {words.length === 0 ? (
          <div className="empty-chain">Start the chain!</div>
        ) : (
          words.map((word, index) => (
            <React.Fragment key={index}>
              <div className="word-block animate-pop">
                {word.toUpperCase()}
              </div>
              {index < words.length - 1 && (
                <div className="chain-link animate-fade">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

export default WordChain;
