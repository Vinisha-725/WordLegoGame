

import nltk
from nltk.corpus import wordnet
import random

# make sure wordnet is downloaded
nltk.download("wordnet", quiet=True)

def is_valid_word(word, theme):
    """Check if word exists and loosely matches theme."""
    if not word:
        return False
    # word must exist in WordNet
    if not wordnet.synsets(word):
        return False
    # basic theme check: theme substring in word or vice versa
    if theme.lower() not in word.lower() and word.lower() not in theme.lower():
        return True  # allow any valid word for AI
    return True

def generate_words(last_letter, theme):
    """
    AI generates one or more candidate words starting with `last_letter`.
    Uses a brute-force approach with WordNet.
    """
    letters = last_letter.lower()
    # naive approach: loop over WordNet words
    candidates = []
    for syn in wordnet.all_synsets():
        for lemma in syn.lemmas():
            w = lemma.name().replace("_", "").lower()
            if w.startswith(letters) and is_valid_word(w, theme):
                candidates.append(w)
    if not candidates:
        # fallback: random letter + theme word
        candidates.append(theme[:3].lower())
    # return one random word for now
    return [random.choice(candidates)]