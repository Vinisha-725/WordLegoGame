from pydantic import BaseModel
from typing import List


class Game(BaseModel):

    game_id: str
    theme: str
    players: List[str]
    turn: int
    word_chain: List[str]
    winner: str | None = None