import requests
import json

url = "http://127.0.0.1:8000/create_game"
payload = {
    "player1": "P1",
    "player2": "AI",
    "theme": "animals",
    "game_mode": "ai",
    "difficulty": "hard"
}
headers = {'Content-Type': 'application/json'}

try:
    print("Creating game...")
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Create Game Response: {response.json()}")
    game_id = response.json()["game_id"]

    url_submit = "http://127.0.0.1:8000/submit_word"
    payload_submit = {
        "game_id": game_id,
        "player": "P1",
        "word": "apple"
    }
    print(f"Submitting word 'apple' (Hard difficulty)...")
    response = requests.post(url_submit, data=json.dumps(payload_submit), headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")

except Exception as e:
    print(f"Error: {e}")
