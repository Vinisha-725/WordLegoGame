import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Clock, ArrowLeft, Trophy, Bot, Lightbulb, Delete } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function GameScreen({ gameState, gameData, onUpdate, onGameOver }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const turn = gameState?.turn ?? 0;
  const currentP = gameState?.players ? gameState.players[turn] : "Loading...";
  const chain = gameState?.word_chain ?? [];
  const theme = gameState?.theme ?? "Loading...";
  const nextChar = chain.length > 0 ? chain[chain.length - 1].slice(-1).toUpperCase() : "ANY";
  const gameMode = gameData?.gameMode || 'multiplayer';
  const winner = gameState?.winner;

  useEffect(() => {
    let interval;
    if (timer > 0 && !winner && !aiThinking) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && !winner && !aiThinking) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [timer, winner, aiThinking]);

  useEffect(() => {
    // Reset timer when game state updates (after AI moves)
    if (gameState && !winner) {
      setTimer(30);
      setWord('');
      setFeedback(null);
      
      if (currentP === 'AI') {
        setAiThinking(true);
      } else {
        setAiThinking(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [turn, gameState]); // Reset on turn change AND game state updates

  // Reset timer when AI finishes thinking and it's human's turn
  useEffect(() => {
    if (currentP !== 'AI' && !aiThinking && !winner) {
      setTimer(30); // Ensure human gets full 30 seconds
    }
  }, [currentP, aiThinking, winner]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chain]);

  useEffect(() => {
    if (gameState && chain.length > 0) {
      const lastWord = chain[chain.length - 1];
      const isLastWordFromAI = gameMode === 'ai' && turn === 0;
      
      if (isLastWordFromAI && currentP !== 'AI') {
        setFeedback({ message: `AI played: ${lastWord}`, type: 'info' });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  }, [chain, turn, currentP, gameMode]);

  const handleTimeout = async () => {
    if (isSubmitting || winner) return;
    
    setFeedback({ message: "Time's up!", type: 'error' });
    setIsSubmitting(true);
    setTimer(30); // Reset timer after timeout

    try {
      const requestBody = {
        game_id: gameData.gameId,
        player: currentP,
        word: "TIMEOUT"
      };

      const response = await fetch(`${API_BASE}/submit_word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      await response.json();
      await onUpdate(gameData.gameId);
    } catch (err) {
      setFeedback({ message: "Network error during timeout!", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || winner || isSubmitting || currentP === 'AI') return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const requestBody = {
        game_id: gameData.gameId,
        player: currentP,
        word: word
      };

      const response = await fetch(`${API_BASE}/submit_word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      
      if (data.valid) {
        setFeedback({ message: data.message || "Great move!", type: 'success' });
        await onUpdate(gameData.gameId);
        setWord('');
        setTimer(30); // Reset timer for next turn
      } else {
        setFeedback({ message: data.reason, type: 'error' });
        await onUpdate(gameData.gameId); 
        setTimer(30); // Reset timer even after invalid move
      }
    } catch (err) {
      setFeedback({ message: "Network error!", type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleHint = async () => {
    if (isSubmitting || winner || currentP === 'AI') return;
    setFeedback({ message: "Thinking of a hint...", type: 'info' });
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/get_hint?game_id=${gameData.gameId}`);
      if (!response.ok) throw new Error("Hint failed");
      const data = await response.json();
      if (data.hint) {
        setWord(data.hint);
        setFeedback({ message: `Try ${data.hint.toUpperCase()}!`, type: 'success' });
      } else {
        setFeedback({ message: data.error || "No hint found", type: 'error' });
      }
    } catch (err) {
      setFeedback({ message: "Could not get a hint.", type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const isPlayerTurn = currentP !== 'AI';
  const isAIMode = gameMode === 'ai';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'transparent', fontFamily: 'var(--font-main)' }}>
      
      {/* Top Bar: Space between */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', zIndex: 10 }}>
        <button onClick={() => window.location.reload()} style={{ background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', boxShadow: '4px 4px 0 var(--card-border)' }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: 'var(--foreground)', textShadow: '2px 2px 0 var(--primary)' }}>
            {isAIMode ? (currentP === 'AI' ? '🤖 AI THINKING' : '💥 YOUR TURN') : `💥 ${currentP ? currentP.toUpperCase() : ''}'S TURN`}
          </div>
          <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: 'var(--foreground)', textTransform: 'capitalize' }}>
            Theme: {gameData?.theme || 'Any'}
          </div>
        </div>
        <div style={{ background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 'bold', fontSize: '1.4rem', boxShadow: '4px 4px 0 var(--card-border)', fontFamily: 'var(--font-heading)' }}>
          Total <span style={{ fontFamily: 'var(--font-main)', marginLeft: '5px' }}>{chain.length}</span>
        </div>
      </div>

      {/* Timer: Centered */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0', zIndex: 10 }}>
        <div style={{ background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', padding: '0.4rem 1.5rem', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 'bold', boxShadow: '4px 4px 0 var(--card-border)', display: 'flex', alignItems: 'center', gap: '8px', color: timer < 10 ? 'var(--error)' : 'var(--foreground)' }}>
          {aiThinking ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Bot size={20} /></motion.div> : <Clock size={20} />}
          {aiThinking ? '🤔' : `${timer}s`}
        </div>
      </div>

      {/* Word Tiles Section: Center Aligned */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', scrollBehavior: 'smooth', zIndex: 1 }}>
        {chain.length === 0 ? (
          <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Start the game!</h2>
            <p style={{ fontSize: '1.2rem' }}>Type a connected word to begin ✏️</p>
          </div>
        ) : (
          chain.map((w, i) => {
            const isAIWord = isAIMode && i % 2 === 1;
            return (
              <React.Fragment key={`${w}-${i}`}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: '#fff',
                    border: '4px solid var(--card-border)',
                    borderRadius: '8px',
                    padding: '0.5rem 1.5rem',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    boxShadow: '6px 6px 0 var(--card-border)',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                  {isAIWord && <Bot size={24} color="var(--secondary)" />}
                  {w}
                </motion.div>
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} style={{ height: '2rem' }} />
      </div>

      {/* Input Section (Letter Grid Area) */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 10, background: 'linear-gradient(to top, var(--background) 80%, transparent)' }}>
        
        {/* Next Letter Indication */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 'bold' }}>
          Starts with: 
          <span style={{ 
            background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', 
            width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--secondary)', boxShadow: '4px 4px 0 var(--card-border)', paddingBottom: '3px'
          }}>
            {nextChar}
          </span>
        </motion.div>

        {isPlayerTurn && !winner ? (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '350px', position: 'relative' }}>
            <input 
              ref={inputRef}
              placeholder="YOUR WORD..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              disabled={isSubmitting || winner}
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '2rem',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                padding: '1rem 3rem 1rem 1rem',
                background: '#fff',
                border: '4px solid var(--card-border)',
                borderRadius: '8px',
                boxShadow: '4px 4px 0 var(--card-border)',
                fontFamily: 'var(--font-main)',
                fontWeight: 'bold',
                color: 'var(--foreground)'
              }}
            />
          </form>
        ) : (
          <div style={{
            width: '100%', maxWidth: '350px', textAlign: 'center', padding: '1rem',
            background: '#fff', border: '4px dashed var(--card-border)', borderRadius: '8px', opacity: 0.8
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: 0 }}>Waiting...</h3>
          </div>
        )}

        {/* Feedback display */}
        <div style={{ height: '24px', fontWeight: 'bold', fontSize: '1.2rem', color: feedback?.type === 'error' ? 'var(--error)' : 'var(--success)' }}>
          {feedback?.message || ''}
        </div>

        {/* Bottom Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', alignItems: 'center', width: '100%', padding: '0.5rem 0 1.5rem 0' }}>
          <motion.button onClick={handleHint} disabled={isSubmitting || winner || currentP === 'AI'} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isSubmitting || winner || currentP === 'AI') ? 'not-allowed' : 'pointer', boxShadow: '4px 4px 0 var(--card-border)', opacity: (isSubmitting || winner || currentP === 'AI') ? 0.5 : 1 }}>
            <Lightbulb size={24} />
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={!word || winner || isSubmitting}
            style={{ 
              background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', 
              padding: '1rem 3rem', cursor: 'pointer', boxShadow: '6px 6px 0 var(--card-border)',
              opacity: (!word || winner || isSubmitting) ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            {isSubmitting ? <Clock size={28} /> : <Send size={28} color="var(--foreground)" />}
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setWord(word.slice(0, -1))} style={{ background: '#fff', border: '4px solid var(--card-border)', borderRadius: '8px', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '4px 4px 0 var(--card-border)' }}>
            <Delete size={24} />
          </motion.button>
        </div>
      </div>

      {/* Winner Popup */}
      <AnimatePresence>
        {winner && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(244, 247, 246, 0.9)', backdropFilter: 'blur(5px)' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              style={{ width: '90%', maxWidth: '400px', padding: '2rem', textAlign: 'center', border: '6px solid var(--card-border)', borderRadius: '12px', background: '#ffffff', boxShadow: '12px 12px 0 var(--card-border)' }}>
              <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                <Trophy size={80} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              </motion.div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                {winner}
              </h2>
              <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--secondary)', fontFamily: 'var(--font-main)' }}>
                WON!!
              </h1>
              {gameState?.reason && (
                <div style={{ background: '#fff', border: '4px dashed var(--error)', padding: '1rem', borderRadius: '8px', margin: '0 0 1.5rem 0', color: 'var(--error)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                  {gameState.reason}
                </div>
              )}
              <motion.button className="btn-primary" style={{ width: '100%', fontSize: '1.4rem' }} onClick={() => onGameOver()} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                SEE SCORE
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GameScreen;
