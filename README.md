# 🎮 WordLego

**AI-Powered Word Chain Game with Real-Time Validation**

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Think fast, chain words, and outsmart the AI. Every word must start with the last letter and match your theme — validated in real-time by AI.

## 🚀 Live Demo

```bash
# Quick start - get playing in 2 minutes
Backend: uvicorn main:app --reload
Frontend: npm run dev
```

**[Play Now →](http://localhost:5173)**

---

## ✨ What Makes WordLego Special

### 🤖 AI That Actually Understands
- **Gemini-powered validation** — knows the difference between "apple" (fruit) and "Apple" (company)
- **Smart caching** — validates in milliseconds after first check
- **Graceful fallback** — works offline with WordNet dictionary

### 🧠 Unbeatable AI Opponent
- **Minimax algorithm** with alpha-beta pruning
- **3 difficulty levels** — from casual to chess-grandmaster level
- **Never runs out of moves** — AI always has a response

### 🎨 Comic-Book Aesthetic
- **Pop-art design** with bold colors and shadows
- **Smooth animations** powered by Framer Motion
- **Responsive** — plays great on mobile and desktop

---

## 🎯 How to Play

1. **Pick a theme** — Fruits, Animals, Things, or Atlas
2. **Set difficulty** — Easy, Medium, or Hard (vs AI)
3. **Start the chain** — First word can be anything in theme
4. **Beat the clock** — 30 seconds per turn
5. **Chain letters** — Each word starts with last letter of previous
6. **Outlast opponent** — Force them to run out of valid words

### Example Game (Fruits Theme)
```
Player: Apple → ends with "e"
AI: Elderberry → ends with "y"  
Player: Yellowmelon → ends with "n"
AI: Nectarine → ends with "e"
...until someone can't continue!
```

---

## 🛠️ Tech Stack

| Frontend | Backend | AI/ML |
|----------|---------|-------|
| React 18 | FastAPI | Gemini API |
| Vite | Python 3.8+ | WordNet |
| Framer Motion | NLTK | Minimax Algorithm |
| Custom CSS | UVicorn | Alpha-Beta Pruning |

---

## 📦 Quick Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### API Key (Optional)
```bash
# Get free API key at https://aistudio.google.com/app/apikey
cp env.example .env
# Edit .env: GEMINI_API_KEY=your_key_here
```

---

## 🎨 Themes

| Theme | Examples | Validation |
|-------|----------|------------|
|  **Fruits** | Apple, Dragonfruit, Rambutan | Gemini + 80+ word list |
| 🦁 **Animals** | Zebra, Kangaroo, Platypus | WordNet hypernyms |
| 🏺 **Things** | Computer, Guitar, Telescope | Gemini + blacklist |
| 🌍 **Atlas** | Tokyo, Amazon, Everest | Geographical recognition |

---

## 🧠 AI Difficulty

| Mode | Intelligence | Response Time |
|------|-------------|---------------|
| 🟢 **Easy** | 1 move ahead | <1 second |
| 🟡 **Medium** | 2 moves ahead | 1-2 seconds |
| 🔴 **Hard** | 3 moves ahead + optimal pruning | 2-3 seconds |

---

## 📊 Performance

```
⚡ API Response:     200-400ms (85% cached)
🧠 AI Move Time:    1-3 seconds
💾 Memory Usage:    ~75MB total
💰 Token Cost:      ~80 tokens per game
```

---

## 🎯 Features

- ✅ **Real-time validation** — instant feedback
- ✅ **Multiplayer & AI modes** — play with friends or solo
- ✅ **4 unique themes** — with AI-powered semantic checking
- ✅ **Hint system** — AI suggests your best move
- ✅ **30-second timer** — intense, fast-paced gameplay
- ✅ **Never-ending AI** — 3-layer fallback ensures AI never loses
- ✅ **Smart caching** — reduces API costs by 85%

---

## 🔧 Customization

### Change AI Difficulty
```python
# backend/ai/minimax.py
depth_map = {'easy': 1, 'medium': 2, 'hard': 3}
```

### Add New Theme
```python
# backend/ai/ai_generator.py
new_theme_prompt = f"Is '{word}' a valid [your theme]?"
```

### Modify UI Colors
```css
/* frontend/src/styles/variables.css */
:root {
  --primary: #FF6B6B;
  --secondary: #4ECDC4;
}
```

---

## � Contributing

```bash
# Fork & clone
git clone https://github.com/your-username/WordLegoGame.git

# Create branch
git checkout -b feature/amazing-feature

# Make changes & commit
git commit -m "Add: amazing feature"

# Push & PR
git push origin feature/amazing-feature
```

---

## 📜 License

MIT License — free for personal and commercial use.

**Built with** React, FastAPI, Gemini AI, and lots of ☕

---

<p align="center">
  <strong>🎮 Ready to test your vocabulary? Start playing now!</strong>
</p>
