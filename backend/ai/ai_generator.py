import google.generativeai as genai
import nltk
from nltk.corpus import wordnet
import random
import time

# Initialize AI
genai.configure(api_key="AIzaSyABWNWTqAcYRZzTCimsOjtDagb0JFBYDEA")
model = genai.GenerativeModel("gemini-1.5-flash")

# Download wordnet if needed
nltk.download("wordnet", quiet=True)

# Cache for theme validation to reduce API calls
theme_cache = {}

def is_valid_word(word):
    """Check if word exists in WordNet"""
    if not word:
        return False
    try:
        return len(wordnet.synsets(word)) > 0
    except:
        return True

def is_theme_related(word, theme):
    """Use AI to check if word is related to theme, with caching"""
    word = word.lower().strip()
    theme = theme.lower().strip()
    
    # Create cache key
    cache_key = f"{word}_{theme}"
    
    # Check cache first
    if cache_key in theme_cache:
        return theme_cache[cache_key]
        
    try:
        # For Atlas theme, accept any geographical features
        if theme == "atlas":
            prompt = f"""
            Is word "{word}" a geographical feature, location, or place on Earth?
            This includes: countries, cities, towns, continents, rivers, lakes, oceans, 
            mountains, forests, deserts, dams, islands, regions, etc.
            Be lenient - accept if it could reasonably be geographical.
            Answer with only YES or NO. No explanation.
            """
        elif theme == "things":
            prompt = f"""
            QUICK YES/NO: Is "{word}" something humans manufactured OR a common object?
            Be lenient - accept if it's a common household item, tool, or manufactured good.
            YES = table, chair, bottle, phone, computer, car, book, pen, clock, lamp
            NO = elephant, india, dog, paris, apple (use fruits theme), tree, human
            Answer with only YES or NO.
            """
        else:
            prompt = f"""
            Is word "{word}" related to theme "{theme}"? 
            Be lenient - accept if there's any reasonable connection.
            Answer with only YES or NO. No explanation.
            """
        
        response = model.generate_content(prompt)
        result = response.text.strip().upper() == "YES"
        
        # Cache the result
        theme_cache[cache_key] = result
        return result
    except:
        # Fallback: be lenient if AI fails
        theme_cache[cache_key] = True
        return True

def check_letter_chain(prev_word, new_word):
    """Check if new_word starts with last letter of prev_word"""
    if not prev_word:
        return True
    return prev_word[-1].lower() == new_word[0].lower()

def contains_swear_words(word):
    """Fast check for swear words using list and AI as secondary"""
    word = word.lower().strip()
    
    # Fast local list check
    bad_words = {"fuck", "shit", "damn", "ass", "bitch", "hell", "piss", "bastard", "nigga", "crap", "dick", "pussy"}
    if any(bw in word for bw in bad_words):
        return True
        
    try:
        # Only use AI for subtle profanity or if the word is long
        if len(word) > 4:
            prompt = f"""
            Does the word "{word}" contain any swear words, profanity, or offensive language?
            Answer with only YES or NO. No explanation.
            """
            response = model.generate_content(prompt)
            result = response.text.strip().upper()
            return result == "YES"
        return False
    except:
        return False

def validate_word_move(word, theme, prev_word):
    """
    Comprehensive validation for a word move - Optimized
    Returns (is_valid, reason)
    """
    word = word.strip().lower()
    
    # 1. Check for swear words (Fastest)
    if contains_swear_words(word):
        return False, "Inappropriate language used!"
        
    # 2. Check letter chaining (Fast)
    if prev_word and not check_letter_chain(prev_word, word):
        return False, f"Word must start with '{prev_word[-1].upper()}'"
    
    # 3. Check if it's a real word (Uses WordNet)
    if not is_valid_word(word):
        return False, f"'{word.upper()}' is not a valid word"
    
    # 4. Check theme relevance (Fastest if in list, Slowest if Gemini)
    if not is_theme_related(word, theme):
        return False, f"'{word.upper()}' is not related to theme '{theme.upper()}'"
    
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