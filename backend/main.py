from fastapi import FastAPI
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
def home():
    return {"message": "Word Lego Game Server Running"}


@app.post("/create_game")
def new_game(player1: str, player2: str, theme: str):

    game_id = create_game(player1, player2, theme)

    return {
        "game_id": game_id,
        "message": "Game created"
    }

@app.post("/submit_word")
def play_word(game_id: str, player: str, word: str):

@app.post("/submit_word")
def play_word(game_id: str, player: str, word: str):

    return submit_word(game_id, player, word)


@app.get("/game_state")
def get_state(game_id: str):

    return games.get(game_id)