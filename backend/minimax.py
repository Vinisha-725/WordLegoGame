from ai_generator import generate_words

MAX_DEPTH = 2  # keep small (API calls are expensive)

def minimax(last_letter, theme, depth, maximizing):

    possible_words = generate_words(last_letter, theme)

    if not possible_words:
        return -1 if maximizing else 1

    if depth == 0:
        return 0

    if maximizing:
        best = -float("inf")
        for word in possible_words:
            score = minimax(word[-1], theme, depth - 1, False)
            best = max(best, score)
        return best

    else:
        best = float("inf")
        for word in possible_words:
            score = minimax(word[-1], theme, depth - 1, True)
            best = min(best, score)
        return best


def get_best_move(last_letter, theme):
    best_score = -float("inf")
    best_word = None

    for word in generate_words(last_letter, theme):
        score = minimax(word[-1], theme, MAX_DEPTH, False)

        if score > best_score:
            best_score = score
            best_word = word

    return best_word