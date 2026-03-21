import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Users, Bot, Target, Clock, Shield, Zap } from 'lucide-react';

function RuleBookScreen() {
  const sections = [
    {
      icon: <BookOpen size={24} />,
      title: "Game Overview",
      content: "WordLego is a strategic word-building game where players create chains of words following specific themes and letter patterns. The game combines linguistic skills with tactical thinking."
    },
    {
      icon: <Target size={24} />,
      title: "Objective",
      content: "Build the longest possible chain of valid words while following the game rules. Outlast your opponent by making valid moves and forcing them into errors."
    },
    {
      icon: <Shield size={24} />,
      title: "Core Rules",
      rules: [
        "🎯 Theme Compliance: All words must match the selected theme",
        "🔤 Letter Chaining: Each word must start with the last letter of the previous word",
        "📚 Valid Words Only: Words must exist in the English dictionary",
        "🚫 No Repeats: Words cannot be used more than once per game",
        "📝 Word Limit: Maximum 3 words per turn (no full sentences)",
        "🚫 Profanity: Any inappropriate language results in instant loss"
      ]
    },
    {
      icon: <Clock size={24} />,
      title: "Turn System",
      content: "Each player has 30 seconds to submit their word. If time expires, the player loses the game. The timer resets after each valid move."
    },
    {
      icon: <Users size={24} />,
      title: "Game Modes",
      modes: [
        "👥 Multiplayer: Play against another human player",
        "🤖 AI Mode: Challenge an AI opponent with minimax algorithm"
      ]
    },
    {
      icon: <Bot size={24} />,
      title: "AI Difficulty Levels",
      difficulties: [
        "😊 Easy: Random valid words, 1-ply search",
        "🎯 Medium: 2-ply minimax with alpha-beta pruning",
        "🔥 Hard: 3-ply minimax with advanced evaluation"
      ]
    },
    {
      icon: <Trophy size={24} />,
      title: "Winning Conditions",
      wins: [
        "🏆 Opponent runs out of time",
        "🏆 Opponent submits invalid word",
        "🏆 Opponent repeats a word",
        "🏆 Opponent uses prohibited language",
        "🏆 AI has no valid moves (in AI mode)"
      ]
    },
    {
      icon: <Zap size={24} />,
      title: "AI Technology",
      content: "The AI uses the Minimax algorithm with Alpha-Beta pruning for optimal decision-making. It evaluates words based on theme relevance, letter positioning, and strategic value. The AI difficulty affects search depth and evaluation sophistication."
    }
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      position: 'relative',
      padding: 'clamp(1rem, 3vw, 2rem)',
      maxWidth: '100vw'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {[...Array(12)].map((_, i) => (
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
              y: [0, -40, 0],
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 3rem)', position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ marginBottom: '1rem' }}
        >
          <BookOpen size={48} color="#6366f1" />
        </motion.div>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 900,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
        }}>
          WordLego Rule Book
        </h1>
        <p style={{ 
          opacity: 0.8, 
          fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
          color: '#94a3b8'
        }}>
          Master the art of strategic word building
        </p>
      </motion.div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(1rem, 3vw, 2rem)',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px',
              padding: 'clamp(1rem, 3vw, 2rem)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              scale: 1.02, 
              borderColor: 'rgba(99, 102, 241, 0.4)',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.2)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '0.5rem',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {section.icon}
              </div>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                fontWeight: 700,
                color: '#e2e8f0',
                margin: 0,
                flex: 1,
                lineHeight: 1.2
              }}>
                {section.title}
              </h2>
            </div>

            {section.content && (
              <p style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                color: '#94a3b8',
                lineHeight: 1.6,
                margin: 0,
                paddingLeft: '3rem'
              }}>
                {section.content}
              </p>
            )}

            {section.rules && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingLeft: '3rem'
              }}>
                {section.rules.map((rule, i) => (
                  <div key={i} style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ flexShrink: 0 }}>{rule.split(':')[0]}:</span>
                    <span style={{ opacity: 0.9 }}>{rule.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            )}

            {section.modes && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingLeft: '3rem'
              }}>
                {section.modes.map((mode, i) => (
                  <div key={i} style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ flexShrink: 0 }}>{mode.split(':')[0]}:</span>
                    <span style={{ opacity: 0.9 }}>{mode.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            )}

            {section.difficulties && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingLeft: '3rem'
              }}>
                {section.difficulties.map((diff, i) => (
                  <div key={i} style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ flexShrink: 0 }}>{diff.split(':')[0]}:</span>
                    <span style={{ opacity: 0.9 }}>{diff.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            )}

            {section.wins && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingLeft: '3rem'
              }}>
                {section.wins.map((win, i) => (
                  <div key={i} style={{
                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ flexShrink: 0 }}>{win.split(':')[0]}:</span>
                    <span style={{ opacity: 0.9 }}>{win.split(':')[1]}</span>
                  </div>
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {win}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <p style={{ margin: 0, fontSize: '1rem', opacity: 0.8 }}>
            🎮 Good luck and have fun building your word chains!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RuleBookScreen;
