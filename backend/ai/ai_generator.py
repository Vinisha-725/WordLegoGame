import google.generativeai as genai
import nltk
from nltk.corpus import wordnet
import random

# Initialize AI
genai.configure(api_key="AIzaSyABWNWTqAcYRZzTCimsOjtDagb0JFBYDEA")
model = genai.GenerativeModel("gemini-1.5-flash")

# Download wordnet if needed
nltk.download("wordnet", quiet=True)

import dictionary

def is_valid_word(word):
    """Check if word exists in WordNet"""
    return dictionary.is_valid_word(word)

def is_theme_related(word, theme):
    """Use AI to check if word is related to theme, with dictionary fallback"""
    word = word.lower().strip()
    theme = theme.lower().strip()
    
    # Check dictionary first for speed
    if dictionary.is_in_theme_list(word, theme):
        return True
        
    try:
        # For Atlas theme, accept any geographical features
        if theme == "atlas":
            prompt = f"""
            Is the word "{word}" a geographical feature, location, or place on Earth?
            This includes: countries, cities, towns, continents, rivers, lakes, oceans, 
            mountains, forests, deserts, dams, islands, regions, etc.
            Answer with only YES or NO. No explanation.
            """
        elif theme == "things":
            prompt = f"""
            QUICK YES/NO: Is "{word}" something humans manufactured in a factory?
            YES = table, chair, bottle, phone, computer, car, book, pen, clock, lamp
            NO = elephant, india, dog, paris, apple, tree, human, mountain
            Answer with only YES or NO.
            """
        else:
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