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
        {
          name: "Multiplayer",
          description: "Classic 2-player mode where humans compete against each other",
          icon: <Users size={20} />
        },
        {
          name: "vs AI",
          description: "Single-player mode against an AI opponent with minimax algorithm",
          icon: <Bot size={20} />
        }
      ]
    },
    {
      icon: <Bot size={24} />,
      title: "AI Difficulty Levels",
      difficulties: [
        {
          level: "Easy",
          description: "AI makes random valid moves - perfect for beginners",
          color: "#10b981"
        },
        {
          level: "Medium", 
          description: "AI uses 2-move lookahead with basic strategy",
          color: "#f59e0b"
        },
        {
          level: "Hard",
          description: "AI uses 3-move lookahead with optimal minimax algorithm",
          color: "#ef4444"
        }
      ]
    },
    {
      icon: <Trophy size={24} />,
      title: "Winning Conditions",
      wins: [
        "⏰ Opponent runs out of time",
        "❌ Opponent submits invalid word",
        "🚫 Opponent uses inappropriate language",
        "🔄 Opponent repeats a word",
        "📝 Opponent uses full sentences",
        "🤖 AI has no valid moves (vs AI mode)"
      ]
    },
    {
      icon: <Zap size={24} />,
      title: "AI Technology",
      content: "The AI opponent uses advanced algorithms including Minimax with Alpha-Beta pruning, letter frequency analysis, and strategic position evaluation to provide challenging gameplay."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ 
      color: 'white',
      height: '100%',
      overflow: 'auto'
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>
          <motion.h1 
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            WordLego Rule Book
          </motion.h1>
          <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>
            Master the art of strategic word building
          </p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ 
              scale: 1.02,
              background: 'rgba(99, 102, 241, 0.15)',
              borderColor: 'rgba(99, 102, 241, 0.3)'
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {section.icon}
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0,
                color: '#a5b4fc'
              }}>
                {section.title}
              </h2>
            </div>

            {section.content && (
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: 1.6,
                opacity: 0.9,
                margin: 0
              }}>
                {section.content}
              </p>
            )}

            {section.rules && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.rules.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '0.95rem'
                    }}
                  >
                    {rule}
                  </motion.div>
                ))}
              </div>
            )}

            {section.modes && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {section.modes.map((mode, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>{mode.icon}</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                      {mode.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
                      {mode.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {section.difficulties && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.difficulties.map((diff, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 10 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${diff.color}`
                    }}
                  >
                    <div style={{
                      background: diff.color,
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'white'
                    }}>
                      {diff.level}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      {diff.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {section.wins && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                {section.wins.map((win, i) => (
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
