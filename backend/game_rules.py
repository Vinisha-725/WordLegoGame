def check_chain(prev_word, new_word):

    if not prev_word:
        return True

    prev_last = prev_word[-1].lower()
    new_first = new_word[0].lower()

    return prev_last == new_first