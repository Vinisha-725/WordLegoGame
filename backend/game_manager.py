import uuid
import time
from validator import validate_word
from ai.minimax import get_best_move

games = {}

def create_game(player1, player2, theme, game_mode="multiplayer", difficulty="medium"):
    game_id = str(uuid.uuid4())
    games[game_id] = {
        "players": [player1, player2],
        "theme": theme.lower(),
        "turn": 0,
        "word_chain": [],
        "winner": None,
        "reason": None,
        "last_move_time": time.time(),
        "game_mode": game_mode,  # "ai" or "multiplayer"
        "difficulty": difficulty,  # "easy", "medium", "hard"
        "ai_thinking": False  # Flag to prevent multiple AI calls
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

    # TIMEOUT CHECK (Special case for frontend timeout)
    if word == "timeout":
        game["winner"] = game["players"][1 - game["turn"]]
        game["reason"] = f"Time's up! {current_player} ran out of time"
        return {
            "valid": False,
            "reason": game["reason"],
            "winner": game["winner"]
        }

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
    
    # AI MODE: If next player is AI, make AI move
    if (game["game_mode"] == "ai" and 
        game["players"][game["turn"]] == "AI" and 
        not game["winner"] and
        not game["ai_thinking"]):
        
        game["ai_thinking"] = True  # Prevent multiple AI calls
        
        try:
            # Get AI move
            last_letter = game["word_chain"][-1][-1] if game["word_chain"] else None
            ai_word = get_best_move(
                last_letter, 
                game["theme"], 
                game["word_chain"], 
                game["difficulty"]
            )
            
            if ai_word:
                # Add AI word
                game["word_chain"].append(ai_word)
                game["turn"] = 1 - game["turn"]  # Back to human player
                game["last_move_time"] = time.time()
                
                result = {
                    "valid": True,
                    "word_chain": game["word_chain"],
                    "next_player": game["players"][game["turn"]],
                    "ai_move": ai_word,
                    "message": f"AI played: {ai_word}"
                }
            else:
                # AI can't find a word, human wins
                game["winner"] = game["players"][1 - game["turn"]]  # Human player
                game["reason"] = "AI has no valid moves. You win!"
                result = {
                    "valid": True,
                    "word_chain": game["word_chain"],
                    "winner": game["winner"],
                    "reason": game["reason"],
                    "message": "AI has no valid moves. You win!"
                }
            return result
        finally:
            game["ai_thinking"] = False
    
    # MULTIPLAYER MODE or HUMAN turn
    return {
        "valid": True,
        "word_chain": game["word_chain"],
        "next_player": game["players"][game["turn"]]
    }

def get_hint_word(game_id):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}
        
    last_letter = game["word_chain"][-1][-1] if game["word_chain"] else None
    hint = get_best_move(last_letter, game["theme"], game["word_chain"], "easy")
    if hint:
        return {"hint": hint.upper()}
    return {"error": "No valid words found right now"}