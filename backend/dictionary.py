import nltk
from nltk.corpus import wordnet

# Download dictionary if not present
try:
    wordnet.ensure_loaded()
except:
    nltk.download("wordnet", quiet=True)

# THEME DICTIONARIES (Extracted from minimax.py and expanded)
THEME_DICTIONARIES = {
    'fruits': {
        'apple', 'apricot', 'avocado', 'banana', 'blueberry', 'blackberry',
        'cherry', 'coconut', 'cranberry', 'date', 'durian', 'elderberry',
        'fig', 'fruit', 'grape', 'grapefruit', 'guava', 'honeydew', 'imbe',
        'jackfruit', 'kiwi', 'kumquat', 'lemon', 'lime', 'lychee', 'mango',
        'melon', 'mandarin', 'nectarine', 'orange', 'olive', 'papaya',
        'passion', 'peach', 'pear', 'plum', 'pineapple', 'quince',
        'raspberry', 'raisin', 'strawberry', 'starfruit', 'tangerine',
        'tomato', 'ugli', 'vanilla', 'watermelon', 'xigua', 'yellow passion',
        'zucchini'
    },
    'animals': {
        'ant', 'antelope', 'ape', 'bear', 'bat', 'bird', 'cat', 'cow', 'camel',
        'dog', 'dolphin', 'duck', 'eagle', 'elephant', 'fox', 'frog', 'fish',
        'goat', 'gorilla', 'giraffe', 'horse', 'hippo', 'iguana', 'jaguar',
        'kangaroo', 'koala', 'lion', 'leopard', 'lizard', 'monkey', 'mouse',
        'moose', 'newt', 'owl', 'ostrich', 'panda', 'parrot', 'penguin',
        'quail', 'rabbit', 'rhino', 'raccoon', 'snake', 'shark', 'sheep',
        'tiger', 'turtle', 'turkey', 'unicorn', 'vulture', 'wolf', 'whale',
        'xerus', 'yak', 'zebra', 'zebrafish'
    },
    'atlas': {
        'america', 'africa', 'asia', 'atlantic', 'brazil', 'britain', 'berlin',
        'china', 'canada', 'california', 'denmark', 'dubai', 'delhi',
        'egypt', 'england', 'europe', 'france', 'florida', 'finland',
        'germany', 'greece', 'greenland', 'hawaii', 'holland', 'india',
        'italy', 'ireland', 'japan', 'jamaica', 'korea', 'kenya', 'london',
        'los angeles', 'mexico', 'moscow', 'madrid', 'norway', 'nigeria',
        'new york', 'oslo', 'ottawa', 'paris', 'poland', 'portugal',
        'quebec', 'rome', 'russia', 'rio', 'spain', 'sweden', 'sydney',
        'tokyo', 'texas', 'turkey', 'usa', 'uk', 'utah', 'venice', 'vietnam',
        'washington', 'wisconsin', 'xian', 'york', 'yukon', 'zimbabwe',
        'zurich'
    },
    'things': {
        'apple', 'airplane', 'automobile', 'bottle', 'book', 'box', 'ball',
        'chair', 'computer', 'car', 'clock', 'desk', 'door', 'drone',
        'eraser', 'engine', 'phone', 'fan', 'fork', 'glass', 'guitar',
        'hammer', 'hat', 'house', 'iron', 'ice', 'jar', 'jeans', 'key',
        'knife', 'lamp', 'laptop', 'lock', 'mirror', 'mouse', 'mug',
        'notebook', 'needle', 'oven', 'orange', 'pen', 'plate', 'paper',
        'quartz', 'radio', 'ruler', 'remote', 'spoon', 'scissors', 'shoe',
        'table', 'television', 'telephone', 'umbrella', 'vase', 'violin',
        'watch', 'window', 'x-ray', 'yarn', 'zipper'
    }
}

def is_valid_word(word):
    """Checks if the word exists in WordNet"""
    if not word:
        return False
    try:
        return len(wordnet.synsets(word)) > 0
    except:
        return True

def is_in_theme_list(word, theme):
    """
    Check if word is in our hardcoded theme list for immediate validation
    """
    word = word.lower().strip()
    theme = theme.lower().strip()
    if theme in THEME_DICTIONARIES:
        return word in THEME_DICTIONARIES[theme]
    return False