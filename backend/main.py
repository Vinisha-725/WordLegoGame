from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from game_manager import create_game, submit_word, get_hint_word, games

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GameRequest(BaseModel):
    player1: str
    player2: str
    theme: str
    game_mode: str = "multiplayer"  # "ai" or "multiplayer"
    difficulty: str = "medium"  # "easy", "medium", "hard"

class WordRequest(BaseModel):
    game_id: str
    player: str
    word: str

@app.get("/")
async def home():
    return {"message": "Word Lego Game Server Running"}


@app.post("/create_game")
async def new_game(request: GameRequest):
    game_id = create_game(
        request.player1, 
        request.player2, 
        request.theme,
        request.game_mode,
        request.difficulty
    )
    return {
        "game_id": game_id,
        "message": "Game created",
        "game_mode": request.game_mode,
        "difficulty": request.difficulty
    }

@app.post("/submit_word")
async def play_word(request: WordRequest):
    result = submit_word(request.game_id, request.player, request.word)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.get("/game_state")
async def get_state(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@app.get("/get_hint")
async def process_hint(game_id: str):
    result = get_hint_word(game_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result