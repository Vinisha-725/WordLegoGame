import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, CheckCircle, AlertCircle, Clock, Hash, LayoutGrid, Trophy, Bot, Sparkles, Zap, Target } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function GameScreen({ gameState, gameData, onUpdate, onGameOver }) {
  const [word, setWord] = useState('');
  const [timer, setTimer] = useState(30);
  const [feedback, setFeedback] = useState(null);
  const [showRules, setShowRules] = useState(false);
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
    } else if (timer === 0 && !winner) {
      setFeedback({ message: "Time's up!", type: 'error' });
    }
    return () => clearInterval(interval);
  }, [timer, winner, aiThinking]);

  useEffect(() => {
    setTimer(30);
    setWord('');
    setFeedback(null);
    if (currentP === 'AI') {
      setAiThinking(true);
    } else {
      setAiThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [turn, currentP]);

  // Autoscroll to bottom
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      
      if (data.valid) {
        setFeedback({ message: data.message || "Great move!", type: 'success' });
        await onUpdate(gameData.gameId);
        setWord('');
      } else {
        setFeedback({ message: data.reason, type: 'error' });
        await onUpdate(gameData.gameId); 
      }
    } catch (err) {
      setFeedback({ message: "Network error!", type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const isPlayerTurn = currentP !== 'AI';
  const isAIMode = gameMode === 'ai';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.2 + 0.05})`,
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 6 + 6,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: 'clamp(0.75rem, 2vw, 1.5rem)',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Theme */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Sparkles size={14} color="#fbbf24" />
            <span style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', opacity: 0.7, fontWeight: 700, letterSpacing: '0.05em' }}>THEME</span>
          </div>
          <motion.span 
            style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: '#6366f1' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {theme.toUpperCase()}
          </motion.span>
        </div>
        
        {/* Current Player */}
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ 
              fontWeight: 800, 
              fontSize: 'clamp(1rem, 3vw, 1.4rem)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center'
            }}
          >
            {currentP === 'AI' && <Bot size={20} color="#6366f1" />}
            {currentP}
          </motion.div>
          <div style={{ 
            fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', 
            opacity: 0.7,
            marginTop: '2px'
          }}>
            {isAIMode ? (currentP === 'AI' ? 'AI THINKING' : 'YOUR TURN') : 'CURRENT TURN'}
          </div>
        </div>

        {/* Timer */}
        <div style={{ textAlign: 'right' }}>
          <motion.div 
            style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
              fontWeight: 900, 
              color: timer < 10 ? '#ef4444' : (aiThinking ? '#6366f1' : '#10b981'),
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            animate={{ scale: timer < 10 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: timer < 10 ? Infinity : 0, duration: 0.5 }}
          >
            {aiThinking ? <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            ><Bot size={18} /></motion.div> : <Clock size={18} />}
            {aiThinking ? '🤔' : `${timer}s`}
          </motion.div>
          <div style={{ 
            width: 'clamp(60px, 15vw, 80px)', 
            height: 'clamp(4px, 1vw, 6px)', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '3px', 
            marginTop: '4px', 
            overflow: 'hidden' 
          }}>
            <motion.div 
              style={{ 
                height: '100%', 
                background: timer < 10 ? '#ef4444' : (aiThinking ? '#6366f1' : '#10b981'),
                borderRadius: '3px'
              }}
              animate={{ width: aiThinking ? '100%' : `${(timer / 30) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Word Chain */}
    <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 'clamp(1rem, 3vw, 2rem)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'clamp(0.5rem, 2vw, 1rem)',
          zIndex: 1,
          position: 'relative',
          scrollBehavior: 'smooth'
        }}
      >
        {chain.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              opacity: 0.3
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Target size={60} color="#6366f1" />
            </motion.div>
            <p style={{ marginTop: '1.5rem', fontWeight: 600, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>Start the chain!</p>
            {isAIMode && <p style={{ marginTop: '0.5rem', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>You go first</p>}
          </motion.div>
        ) : (
          chain.map((w, i) => {
            const isAIWord = isAIMode && i % 2 === 1;
            return (
              <motion.div
                key={`${w}-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 20,
                  delay: i * 0.05
                }}
                style={{
                  alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                  background: i === chain.length - 1 
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                    : (isAIWord ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
                  padding: 'clamp(0.5rem, 2vw, 1rem)',
                  borderRadius: i % 2 === 0 ? '1.5rem 1.5rem 1.5rem 0.25rem' : '1.5rem 1.5rem 0.25rem 1.5rem',
                  fontWeight: 600,
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  maxWidth: 'clamp(200px, 70vw, 70%)',
                  boxShadow: i === chain.length - 1 
                    ? '0 8px 25px rgba(99, 102, 241, 0.4)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  border: i === chain.length - 1 
                    ? '1px solid rgba(99, 102, 241, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {isAIWord && <Bot size={16} color="#6366f1" />}
                {w}
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} style={{ height: '2px' }} />
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          padding: 'clamp(1rem, 3vw, 2rem)',
          background: 'rgba(15, 23, 42, 0.95)', 
          borderTop: '1px solid rgba(99, 102, 241, 0.2)', 
          backdropFilter: 'blur(20px)',
          zIndex: 10,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Next Letter Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: 'clamp(0.5rem, 2vw, 1rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} color="#fbbf24" />
              <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: 0.8, fontWeight: 600 }}>STARTS WITH</span>
            </div>
            <motion.span 
              className="gradient-text"
              style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {nextChar}
            </motion.span>
          </motion.div>
        </div>

        {/* Input Form */}
        {isPlayerTurn && !winner && (
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              style={{ position: 'relative' }}
            >
              <input 
                ref={inputRef}
                style={{
                  width: '100%',
                  padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(3rem, 8vw, 4rem)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Type your word..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                disabled={isSubmitting || winner}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <motion.button 
                type="submit" 
                disabled={!word || winner || isSubmitting}
                style={{ 
                  position: 'absolute', 
                  right: '8px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  width: 'clamp(40px, 10vw, 50px)', 
                  height: 'clamp(40px, 10vw, 50px)', 
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                  border: 'none', 
                  borderRadius: '10px', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Clock size={18} />
                  </motion.div>
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </motion.div>
          </form>
        )}

        {/* AI Thinking */}
        {aiThinking && !winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 'clamp(1rem, 3vw, 2rem)' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ display: 'inline-block', marginBottom: '1rem' }}
            >
              <Bot size={35} color="#6366f1" />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ opacity: 0.8, fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}
            >
              AI is thinking...
            </motion.p>
          </motion.div>
        )}

        {/* Feedback Container with Fixed Height to Prevent Jumps */}
        <div style={{ height: 'clamp(40px, 8vw, 60px)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div 
                key={feedback.message}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{ 
                  width: '100%',
                  textAlign: 'center', 
                  fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                  fontWeight: 600,
                  padding: 'clamp(0.4rem, 1.5vw, 0.75rem)',
                  borderRadius: '10px',
                  background: feedback.type === 'success' 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : (feedback.type === 'info' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                  border: feedback.type === 'success' 
                    ? '1px solid rgba(16, 185, 129, 0.2)' 
                    : (feedback.type === 'info' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'),
                  color: feedback.type === 'success' 
                    ? '#10b981' 
                    : (feedback.type === 'info' ? '#818cf8' : '#ef4444'),
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {feedback.type === 'success' && <CheckCircle size={14} />}
                {feedback.type === 'error' && <AlertCircle size={14} />}
                {feedback.type === 'info' && <Bot size={14} />}
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)'
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ 
                width: '90%', 
                maxWidth: '500px', 
                padding: '2rem', 
                position: 'relative',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)'
              }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white' }}>Game Rules</h2>
              <ul style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem', 
                listStyle: 'none', 
                padding: 0,
                color: '#e2e8f0',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                lineHeight: 1.6
              }}>
                <li>✅ Follow theme (Semantic AI Check)</li>
                <li>🔤 Start with last letter of previous word</li>
                <li>🔗 Multi-word terms allowed (Max 3)</li>
                <li>🚫 No repeated words</li>
                <li>🚫 NO CUSS WORDS (Instant loss)</li>
                <li>⏱️ 30 seconds per turn</li>
                {isAIMode && <li>🤖 AI uses Minimax algorithm with Alpha-Beta pruning</li>}
              </ul>
              <motion.button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                }} 
                onClick={() => setShowRules(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                GOT IT
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Winner Popup */}
      <AnimatePresence>
        {winner && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(15, 23, 42, 0.96)', 
            backdropFilter: 'blur(12px)' 
          }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              style={{ 
                width: '90%', 
                maxWidth: '400px', 
                padding: 'clamp(2rem, 5vw, 4rem)', 
                textAlign: 'center', 
                border: '2px solid rgba(99, 102, 241, 0.5)',
                borderRadius: '20px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Trophy size={80} color="#fbbf24" style={{ marginBottom: '1.5rem' }} />
              </motion.div>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontWeight: 900, 
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {winner}
              </h2>
              <h1 style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
                fontWeight: 900, 
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                WON!!
              </h1>
              {gameState?.reason && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)', 
                  padding: '0.75rem', 
                  borderRadius: '10px', 
                  marginBottom: '1.5rem',
                  color: '#ef4444',
                  fontWeight: 600,
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                }}>
                  Reason: {gameState.reason}
                </div>
              )}
              <p style={{ 
                opacity: 0.8, 
                marginBottom: '2rem', 
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                color: '#e2e8f0'
              }}>
                Great gameplay! Time to see the stats.
              </p>

              <motion.button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                }}
                onClick={() => onGameOver()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW FINAL SCORE
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Rules Action */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2.5rem' }}>
        <motion.button 
          whileHover={{ scale: 1.1, background: 'rgba(99, 102, 241, 0.2)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowRules(true)}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px', 
            background: 'rgba(15, 23, 42, 0.8)', 
            border: '2px solid rgba(99, 102, 241, 0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            color: '#6366f1',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <HelpCircle size={28} />
        </motion.button>
      </div>
    </div>
  );
}

export default GameScreen;

