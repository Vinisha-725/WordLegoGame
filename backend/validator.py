from ai.ai_generator import validate_word_move

def validate_word(theme: str, word: str, prev_word: str = None):
    """
    Validate word using AI for theme and letter checking
    """
    return validate_word_move(word, theme, prev_word)