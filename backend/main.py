from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from game_manager import create_game, submit_word, games

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "Word Lego Game Server Running"}


@app.post("/create_game")
async def new_game(player1: str, player2: str, theme: str):
    game_id = create_game(player1, player2, theme)
    return {
        "game_id": game_id,
        "message": "Game created"
    }

@app.post("/submit_word")
async def play_word(game_id: str, player: str, word: str):
    result = submit_word(game_id, player, word)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.get("/game_state")
async def get_state(game_id: str):
    game = games.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game