# WordLego

WordLego is a fast-paced, competitive word-chain game where every word you play must begin with the last letter of the previous word. To make things trickier, every word must belong to a specific chosen theme (like "Fruits" or "Atlas") and is actively vetted by a dedicated AI validator behind the scenes.

## 🎮 The Vibe
The frontend features a fully responsive, vibrant, comic-book-inspired aesthetic. We traded generic styling for thick pop-art borders, sharp drop shadows, punchy colors, and halftone background patterns.

## 🎯 Key Features
- **🤖 AI-Powered Validation:** We use Gemini 1.5 Flash alongside NLTK's WordNet. The system aggressively verifies if a word is real, chains properly, doesn't contain profanity, and most importantly, accurately matches the selected theme.
- **🧠 Minimax AI Opponent:** Play against an AI that uses an optimized Minimax algorithm with Alpha-Beta pruning. The AI knows how to leverage the dictionary to find strong branching words.
- **⏱️ Intense 30-Second Timer:** You only have 30 seconds per turn. Taking too long means instant forfeit.
- **🎲 Multiple Modes & Difficulty Levels:** Choose between Multiplayer (PvP) or playing Against AI with Easy, Medium, and Hard difficulty configs.

## 🛠️ Tech Stack
- **Frontend:** React + Vite, styled purely with custom, token-based CSS. We integrated Framer Motion for snappy animations and Canvas Confetti to celebrate victories.
- **Backend:** Python + FastAPI.
- **AI & Logic:** Gemini API (generative AI rules vetting), NLTK (WordNet for quick offline dictionary validation), and custom Minimax logic for AI opponent.

## 🚀 Running the Project Locally

### 1. Start the Backend
Make sure you have Python installed. You can set up a virtual environment and install the required dependencies:

```bash
cd backend
python -m venv venv

# Activate the venv:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Once dependencies are installed, start the FastAPI server:

```bash
uvicorn main:app --reload
```
The backend should now be running on `http://127.0.0.1:8000`.

### 2. Start the Frontend
In a separate terminal window, navigate to the frontend folder and run the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
The React frontend should now be running locally on your machine at `http://localhost:5173`.

## 📋 Gameplay Rules
1. Only **single words** are allowed. Sentences will be instantly rejected.
2. Words must conform semantically to the chosen theme.
3. Your word **must** start with the very last letter of the previous player's valid word.
4. No repeating words. If you use a word already in the chain, you lose.
5. If you exceed the 30-second timer, your turn is skipped and you lose.

## 🎨 Themes Available

### 🍎 Fruits
Botanical fruits and fruit-like vegetables. Includes common fruits (apple, banana, orange) plus exotic varieties (dragonfruit, lychee, rambutan) and multi-word fruits (ice apple, water apple).

### 🗺️ Animals  
Living creatures - mammals, birds, fish, reptiles, insects, etc. Strict validation excludes mythical creatures and animal products.

### 🗺️ Things
Human-made objects and common items. Includes furniture, electronics, tools, clothing, household items, vehicles, and manufactured goods.

### 🌍 Atlas
Geographical features and locations worldwide. Includes countries, cities, continents, rivers, mountains, landmarks, and natural features.

## 🤖 AI Difficulty Levels

### 🟢 Easy Mode
- **Shallow Minimax**: Depth 1 search (looks 1 move ahead)
- **Strategic but forgiving**: AI makes decent choices but not overwhelming
- **Perfect for**: Beginners learning the game

### 🟡 Medium Mode  
- **Balanced Search**: Depth 2 search (looks 2 moves ahead)
- **Considers opponent responses**: AI thinks about your next move
- **Good for**: Regular players who want a challenge

### 🔴 Hard Mode
- **Deep Search**: Depth 3 search (looks 3 moves ahead)  
- **Optimal Pruning**: Considers more move options (10 max vs 5)
- **Strategic Master**: AI plays nearly optimally
- **For**: Experienced players seeking real challenge

## 💡 AI Features

### 🧠 Smart Validation System
- **Gemini 1.5 Flash**: Advanced AI for theme validation
- **Caching System**: Reuses validation results to save API calls
- **Fallback Mechanism**: NLTK WordNet when API unavailable
- **Multi-word Support**: Handles phrases like "ice apple"
- **Performance**: ~300-1,200 tokens per game session

### 🎯 Minimax Algorithm
- **Alpha-Beta Pruning**: Optimizes search by cutting unpromising branches
- **Position Evaluation**: Scores based on letter rarity and game state
- **Move Limiting**: Performance-optimized with configurable limits
- **Theme Integration**: Only suggests theme-valid words

## 🎮 How to Play

1. **Choose Your Mode**: Pick between PvP or AI opponent
2. **Select Theme**: Choose from Fruits, Animals, Things, or Atlas
3. **Set Difficulty**: Pick Easy, Medium, or Hard (AI mode only)
4. **Start Playing**: First player chooses any valid word
5. **Chain Words**: Each response must start with the last letter
6. **Beat the Clock**: Respond within 30 seconds or lose your turn
7. **Win Condition**: Force your opponent to run out of valid words

## 🔧 Configuration & Customization

### 🎨 Theme Expansion
The AI validation system is designed for easy expansion. To add new themes:

1. **Create Theme Prompts**: Add specific validation prompts in `ai_generator.py`
2. **Define Word Categories**: Specify what types of words are valid
3. **Test Validation**: Ensure Gemini correctly categorizes new themes

### 🧠 AI Tuning
Adjust AI behavior by modifying minimax parameters:

```python
# In minimax.py
depth_map = {'easy': 1, 'medium': 2, 'hard': 3}
max_moves = {'easy': 3, 'medium': 5, 'hard': 10}
```

### 🎨 UI Customization
The comic-book theme is implemented with CSS variables. Modify colors and styles in `frontend/src/styles/`:

```css
:root {
  --primary-color: #FF6B6B;
  --secondary-color: #4ECDC4;
  --accent-color: #FFD93D;
}
```

## 🚀 Deployment

### 🐳 Docker Setup
For containerized deployment:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### ☁️ Vercel/Railway Deployment
The app is designed for easy deployment to modern platforms:

1. **Backend**: Deploy FastAPI to any cloud provider
2. **Frontend**: Deploy React static build to Vercel/Netlify
3. **Environment**: Set API base URL and Gemini API key
4. **Database**: Add Redis for production caching if needed

## 🤝 Contributing

Since this started as a fun hackathon-style build, feel free to fork it, mess around with the UI, or expand the AI validation logic to support new wild themes! Pull requests are always welcome.

### 🐛 Bug Reports
- **AI Validation**: Words incorrectly rejected/accepted for themes
- **Performance**: Slow AI responses or game lag
- **UI Issues**: Styling problems or animation glitches
- **Logic**: Game rule violations or scoring errors

### 💡 Feature Ideas
- **New Themes**: Sports, Movies, Science, History, Food
- **Power-ups**: Hints, skip turn, challenge modes
- **Multiplayer**: Online matchmaking, tournaments, leaderboards
- **Accessibility**: Color blind mode, larger text, keyboard navigation

## 📊 Performance Metrics

### ⚡ Current Benchmarks
- **AI Response Time**: 2-4 seconds (medium difficulty)
- **Theme Validation**: 0.1-0.3 seconds (cached), 1-2 seconds (API)
- **Memory Usage**: ~50MB (backend), ~25MB (frontend)
- **API Efficiency**: ~80% cache hit rate

### 🎯 Optimization Targets
- **AI Speed**: <2 seconds response time
- **Cache Hit Rate**: >90% for common words
- **Memory**: <30MB per service
- **Token Usage**: <10,000 tokens per 100 games

## 📜 License

Provided for educational and hackathon purposes. Enjoy the game!

---

**🚀 Ready to build, deploy, and expand! The combination of intelligent AI validation and strategic gameplay creates a unique educational gaming experience.**
