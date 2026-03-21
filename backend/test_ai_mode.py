import requests
import json
import time

API_BASE = "http://127.0.0.1:8000"

def test_ai_game():
    payload = {
        "player1": "Human",
        "player2": "AI",
        "theme": "animals",
        "game_mode": "ai",
        "difficulty": "medium"
    }
    
    
    print("Creating AI game...")
    resp = requests.post(f"{API_BASE}/create_game", json=payload)
    if resp.status_code != 200:
        print(f"FAILED TO CREATE GAME: {resp.text}")
        return
        
    game_id = resp.json()["game_id"]
    print(f"Game Created: {game_id}")
    
    # Human move
    print("Submitting human move 'apple'...")
    resp = requests.post(f"{API_BASE}/submit_word", json={
        "game_id": game_id,
        "player": "Human",
        "word": "apple"
    })
    
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
    
    # Check if AI move is in the response or state
    time.sleep(1)
    print("Checking game state...")
    resp = requests.get(f"{API_BASE}/game_state?game_id={game_id}")
    state = resp.json()
    print(f"Word Chain: {state['word_chain']}")
    print(f"Turn: {state['turn']}")
    print(f"Next Player: {state['players'][state['turn']]}")

if __name__ == "__main__":
    test_ai_game()
