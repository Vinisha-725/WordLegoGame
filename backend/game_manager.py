import uuid
import time
from validator import validate_word
from game_rules import check_chain
from ai.minimax import get_best_move
from ai.ai_generator import generate_words

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

    # PROFANITY CHECK (Whole word match)
    cuss_words = ["fuck", "shit", "damn", "ass", "bitch", "hell", "piss", "bastard", "nigga"]
    # Check if any cuss word exists as a separate word in the input
    input_words = word.split()
    if any(cw in input_words for cw in cuss_words):
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = "Inappropriate language used!"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"] 
        }

    # SENTENCE CHECK (Limit to terms, not sentences)
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

    # CHAIN CHECK using game_rules.py
    last_word = game["word_chain"][-1] if game["word_chain"] else None
    if not check_chain(last_word, word):
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = f"Word must start with '{last_word[-1]}'"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # THEME VALIDATION
    result = validate_word(game["theme"], word)
    if not result["valid"]:
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = result["reason"]
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

    # ADD PLAYER WORD
    game["word_chain"].append(word)
    
    # 🤖 AI MOVE
    last_letter = word[-1]
    ai_word = get_best_move(last_letter, game["theme"])
    
    # ❌ If AI cannot find a word → player wins
    if not ai_word:
        game["winner"] = player
        game["last_move_time"] = time.time()
        return {
            "valid": True,
            "message": "AI has no moves. You win!",
            "word_chain": game["word_chain"],
            "winner": player
        }
    
    # ADD AI WORD
    game["word_chain"].append(ai_word)
    game["last_move_time"] = time.time()
    
    return {
        "valid": True,
        "word_chain": game["word_chain"],
        "ai_move": ai_word
    }