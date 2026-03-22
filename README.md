# WordLego

WordLego is a fast-paced, competitive word-chain game where every word you play must begin with the last letter of the previous word. To make things trickier, every word must belong to a specific chosen theme (like "Fruits" or "Atlas") and is actively vetted by a dedicated AI validator behind the scenes.

You can play against a friend locally or take on the custom-built Minimax AI.

## The Vibe
The frontend features a fully responsive, vibrant, comic-book-inspired aesthetic. We traded generic styling for thick pop-art borders, sharp drop shadows, punchy colors, and halftone background patterns. 

## Key Features
- **AI-Powered Validation:** We use Gemini 1.5 Flash alongside NLTK's WordNet. The system aggressively verifies if a word is real, chains properly, doesn't contain profanity, and most importantly, accurately matches the selected theme.
- **Minimax AI Opponent:** Play against an AI that uses an optimized Minimax algorithm with Alpha-Beta pruning. The AI knows how to leverage the dictionary to find strong branching words.
- **Intense 30-Second Timer:** You only have 30 seconds per turn. Taking too long means instant forfeit.
- **Multiple Modes & Difficulty Level:** Choose between Multiplayer (PvP) or playing Against the AI with Easy, Medium, and Hard difficulty configs.

## Tech Stack
- **Frontend:** React + Vite, styled purely with custom, token-based CSS. We integrated Framer Motion for snappy animations and Canvas Confetti to celebrate victories.
- **Backend:** Python + FastAPI.
- **AI & Logic:** Gemini API (generative AI rules vetting), NLTK (WordNet for quick offline dictionary validation), and custom Minimax logic for the AI opponent.

## Running the Project Locally

To run the game, you'll need to boot up both the frontend React app and the Python backend server. 

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

## Gameplay Rules
1. Only **single words** are allowed. Sentences will be instantly rejected.
2. Words must conform semantically to the chosen theme.
3. Your word **must** start with the very last letter of the previous player's valid word.
4. No repeating words. If you use a word already in the chain, you lose.
5. If you exceed the 30-second timer, your turn is skipped and you lose the game.

## Contributing
Since this started as a fun hackathon-style build, feel free to fork it, mess around with the UI, or expand the AI validation logic to support new wild themes! Pull requests are always welcome.

## License
Provided for educational and hackathon purposes. Enjoy the game!
