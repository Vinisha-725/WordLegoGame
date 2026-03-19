from embedding_validator import check_theme

def validate_word(theme: str, word: str):
    # AI theme check
    if not check_theme(word, theme):
        return {
            "valid": False,
            "reason": f"Word '{word}' is not related to theme '{theme}'"
        }

    return {
        "valid": True
    }