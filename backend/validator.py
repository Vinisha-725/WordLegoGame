from dictionary import is_valid_word

def validate_word(theme: str, word: str):

    if not is_valid_word(word):
        return {
            "valid": False,
            "reason": f"'{word}' is not a valid word"
        }

    return {
        "valid": True
    }