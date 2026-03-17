import uuid
from validator import validate_word

games = {}

def create_game(player1, player2, theme):

    game_id = str(uuid.uuid4())

    games[game_id] = {
        "players": [player1, player2],
        "theme": theme.lower(),
        "turn": 0,
        "word_chain": [],
        "winner": None
    }

    return game_id


def submit_word(game_id, player, word):

    game = games.get(game_id)

    if not game:
        return {"valid": False, "reason": "Game not found"}

    word = word.strip().lower()

    current_player = game["players"][game["turn"]]

    # TURN CHECK
    if player != current_player:
        return {"valid": False, "reason": "Not your turn"}

    # SENTENCE CHECK
    if " " in word:
        game["winner"] = game["players"][1 - game["turn"]]
        return {
            "valid": False,
            "reason": "Only single words allowed",
            "winner": game["winner"]
        }

    # REPEAT CHECK
    if word in game["word_chain"]:
        game["winner"] = game["players"][1 - game["turn"]]
        return {
            "valid": False,
            "reason": "Word already used",
            "winner": game["winner"]
        }

    # START LETTER CHECK
    if game["word_chain"]:
        last_word = game["word_chain"][-1]

        if word[0] != last_word[-1]:
            game["winner"] = game["players"][1 - game["turn"]]
            return {
                "valid": False,
                "reason": f"Word must start with '{last_word[-1]}'",
                "winner": game["winner"]
            }

    # THEME VALIDATION
    result = validate_word(game["theme"], word)

    if not result["valid"]:
        game["winner"] = game["players"][1 - game["turn"]]
        return {
            "valid": False,
            "reason": result["reason"],
            "winner": game["winner"]
        }

    # ADD WORD
    game["word_chain"].append(word)

    # SWITCH TURN
    game["turn"] = 1 - game["turn"]

    return {
        "valid": True,
        "word_chain": game["word_chain"],
        "next_player": game["players"][game["turn"]]
    }