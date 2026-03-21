import uuid
import time
from validator import validate_word

games = {}

def create_game(player1, player2, theme):
    game_id = str(uuid.uuid4())
    games[game_id] = {
        "players": [player1, player2],
        "theme": theme.lower(),
        "turn": 0,
        "word_chain": [],
        "winner": None,
        "reason": None,
        "last_move_time": time.time()
    }
    return game_id


def submit_word(game_id, player, word):
    game = games.get(game_id)

    if not game:
        return {"valid": False, "reason": "Game not found"}

    if game["winner"]:
        return {"valid": False, "reason": f"Game already over. {game['winner']} won."}

    word = word.strip().lower()
    current_time = time.time()
    current_player = game["players"][game["turn"]]

    # TURN CHECK
    if player != current_player:
        return {"valid": False, "reason": "Not your turn"}

    # TIMER CHECK (30 seconds limit)
    time_taken = current_time - game["last_move_time"]
    if time_taken > 31: # allowing 1s buffer for network latencies
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = f"Time's up! took too long ({int(time_taken)}s)"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # SENTENCE CHECK (Limit to terms, not sentences)
    input_words = word.split()
    if len(input_words) > 3:
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = "Full sentences are not allowed (Max 3 words)"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # REPEAT CHECK
    if word in game["word_chain"]:
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = f"'{word}' has already been used"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # AI VALIDATION (checks word validity, theme, letter chain, swear words)
    last_word = game["word_chain"][-1] if game["word_chain"] else None
    is_valid, reason = validate_word(game["theme"], word, last_word)
    
    if not is_valid:
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = reason
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # ADD WORD AND UPDATE TURN
    game["word_chain"].append(word)
    game["turn"] = 1 - game["turn"]
    game["last_move_time"] = time.time()
    
    return {
        "valid": True,
        "word_chain": game["word_chain"],
        "next_player": game["players"][game["turn"]]
    }