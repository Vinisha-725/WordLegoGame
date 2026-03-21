import time
from ai.ai_generator import validate_word_move

print("Testing Gemini API validation latency...")
start = time.time()
is_valid, reason = validate_word_move("apple", "fruits", None)
end = time.time()
print(f"Validation took: {end - start:.2f}s")
print(f"Result: {is_valid}, {reason}")

start = time.time()
is_valid, reason = validate_word_move("banana", "fruits", "apple")
end = time.time()
print(f"Validation 2 took: {end - start:.2f}s")
print(f"Result: {is_valid}, {reason}")
