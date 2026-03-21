import google.generativeai as genai
import nltk
from nltk.corpus import wordnet
import random

# Initialize AI
genai.configure(api_key="AIzaSyABWNWTqAcYRZzTCimsOjtDagb0JFBYDEA")
model = genai.GenerativeModel("gemini-1.5-flash")

# Download wordnet if needed
nltk.download("wordnet", quiet=True)

def is_valid_word(word):
    """Check if word exists in WordNet"""
    if not word:
        return False
    return len(wordnet.synsets(word)) > 0

def is_theme_related(word, theme):
    """Use AI to check if word is related to theme"""
    try:
        if theme.lower() == "atlas":
            # For Atlas theme, accept any geographical features
            prompt = f"""
            Is the word "{word}" a geographical feature, location, or place on Earth?
            This includes: countries, cities, towns, continents, rivers, lakes, oceans, 
            mountains, forests, deserts, dams, islands, regions, etc.
            Answer with only YES or NO. No explanation.
            """
        else:
            # For other themes, use regular theme checking
            prompt = f"""
            Is the word "{word}" related to the theme "{theme}"? 
            Answer with only YES or NO. No explanation.
            """
        
        response = model.generate_content(prompt)
        result = response.text.strip().upper()
        return result == "YES"
    except:
        # Fallback: be lenient if AI fails
        return True

def check_letter_chain(prev_word, new_word):
    """Check if new_word starts with last letter of prev_word"""
    if not prev_word:
        return True  # First word is always valid
    
    prev_last = prev_word[-1].lower()
    new_first = new_word[0].lower()
    
    return prev_last == new_first

def contains_swear_words(word):
    """Check for swear words using AI"""
    try:
        prompt = f"""
        Does the word "{word}" contain any swear words, profanity, or offensive language?
        Answer with only YES or NO. No explanation.
        """
        response = model.generate_content(prompt)
        result = response.text.strip().upper()
        return result == "YES"
    except:
        # Fallback to basic check
        swear_words = ["fuck", "shit", "damn", "ass", "bitch", "hell", "piss", "bastard", "nigga"]
        return any(swear in word.lower() for swear in swear_words)

def validate_word_move(word, theme, prev_word):
    """
    Comprehensive AI validation for a word move
    Returns (is_valid, reason)
    """
    word = word.strip().lower()
    
    # Check if it's a real word
    if not is_valid_word(word):
        return False, f"'{word}' is not a valid word"
    
    # Check letter chaining
    if not check_letter_chain(prev_word, word):
        if prev_word:
            return False, f"Word must start with '{prev_word[-1]}'"
        else:
            return False, "Invalid first word"
    
    # Check theme relevance
    if not is_theme_related(word, theme):
        return False, f"'{word}' is not related to theme '{theme}'"
    
    # Check for swear words
    if contains_swear_words(word):
        return False, "Inappropriate language used!"
    
    return True, "Valid move"

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
            if w.startswith(letters) and is_valid_word(w):
                candidates.append(w)
    if not candidates:
        # fallback: random letter + theme word
        candidates.append(theme[:3].lower())
    # return one random word for now
    return [random.choice(candidates)]