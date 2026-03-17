import nltk
from nltk.corpus import wordnet

# download dictionary if not present
nltk.download("wordnet")

def is_valid_word(word):
    """
    Checks if the word exists in WordNet
    """

    if not word:
        return False

    synsets = wordnet.synsets(word)

    return len(synsets) > 0