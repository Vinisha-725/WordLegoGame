from game_rules import check_chain
from ai_validator import check_theme


def validate_word(prev_word, new_word, theme):

    # chain rule
    if prev_word:
        if not check_chain(prev_word, new_word):
            return {
                "valid": False,
                "reason": "Word must start with last letter of previous word"
            }

    # AI theme check
    if not check_theme(new_word, theme):
        return {
            "valid": False,
            "reason": "Word not related to theme"
        }

    return {
        "valid": True
    }