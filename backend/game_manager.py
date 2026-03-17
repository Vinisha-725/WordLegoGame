import uuid
from validator import validate_word

games = {}


def create_game(player1, player2, theme):

    game_id = str(uuid.uuid4())

    games[game_id] = {
        "players": [player1, player2],
        "theme": theme,
        "turn": 0,
        "word_chain": [],
        "winner": None
    }

    return game_id


def submit_word(game_id, player, word):

    game = games.get(game_id)

    if not game:
        return {"error": "Game not found"}

    current_player = game["players"][game["turn"]]

    if player != current_player:
        return {"error": "Not your turn"}

    prev_word = game["word_chain"][-1] if game["word_chain"] else None

    result = validate_word(prev_word, word, game["theme"])

    if not result["valid"]:
        game["winner"] = game["players"][1 - game["turn"]]

        return {
            "valid": False,
            "reason": result.get("reason"),
            "winner": game["winner"]
    }

    game["word_chain"].append(word)

    game["turn"] = 1 - game["turn"]

    return {
        "valid": True,
        "word_chain": game["word_chain"],
        "next_player": game["players"][game["turn"]]
    }