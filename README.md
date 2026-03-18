# 🎮 WordLego AI

**WordLego AI** is an interactive 2-player word chain game powered by AI-based theme validation. Players take turns entering words that follow a theme while maintaining a valid word chain — combining fun gameplay with intelligent validation.

---

## 🚀 Features

* 🎯 Theme-based word validation (AI-powered)
* 🔗 Word chain gameplay (last letter → next word)
* ⏱️ 30-second turn timer
* 👥 2-player competitive mode
* ❌ Automatic invalid move detection
* 🧠 Semantic checking using AI (not just hardcoded lists)
* 🎨 Modern, responsive UI

---

## 🧩 How to Play

1. Enter Player 1 and Player 2 names
2. Select a theme (e.g., Fruits, Countries, Animals, Movies)
3. Start the game
4. Players take turns entering words

---

## 📜 Game Rules

* ✅ Word must belong to the selected theme
* 🔤 Word must start with the **last letter** of the previous word
* 🚫 No repeated words
* 🚫 Only **single words** allowed (no sentences)
* ⏱️ Each player has **30 seconds per turn**
* ❌ Invalid move → opponent wins immediately

---

## 🧠 AI Logic

The game uses an AI-based semantic validation approach:

* Converts words and themes into embeddings
* Compares similarity to check relevance
* Ensures smarter validation than static word lists

---

## 🏗️ Project Structure

```
word-lego-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── game_manager.py
│   ├── validator.py
│   ├── embedding_validator.py
│   └── requirements.txt
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Vinisha-725/WordLegoGame.git
cd WordLegoGame
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

* Runs on: `http://localhost:3000`

---

## 🖥️ Backend Setup

### Step 1: Navigate to backend

```bash
cd backend
```

### Step 2: Create virtual environment

```bash
python -m venv venv
```

### Step 3: Activate environment

**Windows (PowerShell):**

```bash
.\venv\Scripts\activate
```

**Windows (CMD):**

```bash
venv\Scripts\activate
```

---

### Step 4: Install dependencies

```bash
pip install -r requirements.txt
```

---

### Step 5: Run server

```bash
uvicorn main:app --reload
```

* Runs on: `http://127.0.0.1:8000`
* API Docs: `http://127.0.0.1:8000/docs`

---

## 🔌 API Endpoints

### Create Game

```
POST /create_game
```

### Submit Word

```
POST /submit_word
```

### Get Game State

```
GET /game_state
```

---

## 🔗 Connecting Frontend to Backend

Make sure your frontend service file points to:

```javascript
const API = "http://127.0.0.1:8000";
```

---

## 🎯 Tech Stack

**Frontend:**

* React
* CSS (custom styling)

**Backend:**

* FastAPI
* Python

**AI:**

* Sentence Transformers (embeddings)
* Cosine similarity for semantic validation

---

## 🏆 Future Improvements

* 🌐 Multiplayer (online rooms)
* 🤖 AI opponent mode
* 📊 Leaderboards
* 🎚️ Difficulty levels
* 🎤 Voice input

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is for educational and hackathon purposes.

---

## 💡 Inspiration

Built to combine **gaming + AI + real-time interaction** into a fun and competitive experience.

---

🔥 *Play smart. Think fast. Don’t break the chain.*
