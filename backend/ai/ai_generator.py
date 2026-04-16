import google.generativeai as genai
import nltk
from nltk.corpus import wordnet
import random
import time
import os

# Initialize AI with new package and environment variable
try:
    api_key = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
    if api_key and api_key != "YOUR_API_KEY_HERE":
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")  # Working model
    else:
        model = None
    print("✅ Gemini AI initialized successfully")
except Exception as e:
    print(f"⚠️ Gemini AI not available: {e}")
    print("🔄 Using WordNet fallback only")
    model = None

# Download wordnet if needed
nltk.download("wordnet", quiet=True)

# Cache for theme validation to reduce API calls
theme_cache = {}

# Hardcoded fruit list for fast validation
FRUITS_LIST = {
    'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'watermelon', 
    'pineapple', 'mango', 'kiwi', 'lemon', 'peach', 'plum', 'cherry', 'raspberry',
    'blackberry', 'coconut', 'papaya', 'pomegranate', 'guava', 'passionfruit', 'dragonfruit',
    'lychee', 'durian', 'avocado', 'tomato', 'olive', 'fig', 'date', 'apricot', 'nectarine',
    'cantaloupe', 'honeydew', 'grapefruit', 'lime', 'tangerine', 'mandarin', 'clementine',
    'persimmon', 'starfruit', 'jackfruit', 'breadfruit', 'acai', 'goji', 'cranberry',
    'boysenberry', 'elderberry', 'mulberry', 'currant', 'gooseberry', 'kiwano', 'rambutan',
    'mangosteen', 'plantain', 'pear', 'quince', 'ice apple', 'iceapple', 'water apple',
    'rose apple', 'cashew apple', 'sugar apple', 'custard apple', 'star apple', 'buddha hand',
    'finger lime', 'blood orange', 'navel orange', 'cara cara', 'satsuma', 'pomelo', 'ugli fruit',
    'tangelo', 'kumquat', 'citron', 'jambul', 'jamun', 'ber', 'chiku', 'sapodilla', 'sapota',
    'longan', 'lanzones', 'langsat', 'santol', 'soursop', 'guyabano', 'graviola', 'cherimoya',
    'papaw', 'pawpaw', 'prickly pear', 'cactus fruit', 'dragon egg', 'eggfruit', 'canistel',
    'abiu', 'cupuacu', 'jaboticaba', 'camucamu', 'mamey', 'sapote', 'genip', 'hala fruit',
    'breadnut', 'buri palm', 'betelnut', 'areca nut', 'coconut water', 'coconut milk'
}

# Hardcoded things list for fast validation
THINGS_LIST = {
    'table', 'chair', 'bottle', 'phone', 'computer', 'car', 'book', 'pen', 'clock', 'lamp',
    'desk', 'bed', 'door', 'window', 'mirror', 'television', 'radio', 'camera', 'keyboard', 'mouse',
    'laptop', 'tablet', 'watch', 'glasses', 'shoes', 'shirt', 'pants', 'hat', 'bag', 'wallet',
    'keys', 'lock', 'hammer', 'screwdriver', 'drill', 'saw', 'knife', 'fork', 'spoon', 'plate',
    'cup', 'glass', 'mug', 'bowl', 'pot', 'pan', 'oven', 'refrigerator', 'microwave', 'toaster',
    'blender', 'mixer', 'vacuum', 'broom', 'mop', 'bucket', 'soap', 'towel', 'paper', 'pencil',
    'eraser', 'ruler', 'scissors', 'tape', 'glue', 'stapler', 'calculator', 'calendar', 'notebook',
    'folder', 'envelope', 'stamp', 'umbrella', 'coat', 'scarf', 'gloves', 'belt', 'socks', 'shoe',
    'boot', 'sneaker', 'sandals', 'helmet', 'backpack', 'suitcase', 'luggage', 'purse', 'wallet',
    'ring', 'necklace', 'bracelet', 'earring', 'watch', 'clock', 'alarm', 'timer', 'remote',
    'controller', 'joystick', 'speaker', 'headphones', 'microphone', 'charger', 'battery', 'cable',
    'wire', 'plug', 'socket', 'switch', 'bulb', 'flashlight', 'lantern', 'candle', 'match', 'lighter'
}

# Hardcoded blacklist for inappropriate words only
THINGS_BLACKLIST = {
    'kampuchean', 'yankee', 'nigger', 'nigga', 'fuck', 'shit', 'cunt', 'bitch',
    'whore', 'slut', 'bastard', 'asshole', 'dickhead', 'piss', 'crap', 'damn'
}

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
    
    # Handle multi-word phrases by removing spaces for checking
    word_no_spaces = word.replace(' ', '')
    
    # Create cache key
    cache_key = f"{word}_{theme}"
    
    # Check cache first
    if cache_key in theme_cache:
        return theme_cache[cache_key]
    
    # Fast check for fruits using hardcoded list
    if theme == "fruits":
        # Check both with and without spaces
        result = word in FRUITS_LIST or word_no_spaces in FRUITS_LIST
        theme_cache[cache_key] = result
        return result
        
    # Fast blacklist check for things theme
    if theme == "things" and word in THINGS_BLACKLIST:
        theme_cache[cache_key] = False
        return False
        
    try:
        # Only use AI if model is available
        if model is None:
            raise Exception("AI model not available")
            
        # For Atlas theme, accept any geographical features
        if theme == "atlas":
            prompt = f"""
            Is word "{word}" a geographical feature, location, or place on Earth?
            This includes: countries, cities, towns, continents, rivers, lakes, oceans, 
            mountains, forests, deserts, dams, islands, regions, etc.
            Be lenient - accept if it could reasonably be geographical.
            Answer with only YES or NO. No explanation.
            """
        elif theme == "animals":
            prompt = f"""
            Is "{word}" an animal, bird, fish, reptile, amphibian, or insect?
            This includes: mammals, birds, fish, reptiles, amphibians, insects, arachnids, etc.
            Be strict - only accept actual animals. NO mythical creatures, NO animal products.
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
        result_text = response.text.strip().upper()
        result = "YES" in result_text
        
        # Cache the result
        theme_cache[cache_key] = result
        return result
    except Exception as e:
        print(f"Theme check AI Error: {e}")
        # Fallback: Use NLTK WordNet
        try:
            from nltk.corpus import wordnet as wn
            synsets = wn.synsets(word_no_spaces)  # Use no-space version for WordNet
            if not synsets:
                theme_cache[cache_key] = False
                return False
            for syn in synsets:
                paths = syn.hypernym_paths()
                for path in paths:
                    hyper_names = [s.name().split('.')[0] for s in path]
                    if theme == 'animals' and any(n in ['animal', 'bird', 'fish', 'insect', 'reptile', 'amphibian'] for n in hyper_names):
                        theme_cache[cache_key] = True
                        return True
                    if theme == 'atlas' and any(n in ['location', 'region', 'country', 'city', 'body_of_water', 'landmass', 'geographical_area'] for n in hyper_names):
                        theme_cache[cache_key] = True
                        return True
                    if theme == 'things' and any(n in ['artifact', 'instrumentality', 'article', 'commodity', 'object', 'device', 'tool', 'equipment', 'furniture', 'vehicle', 'appliance', 'utensil', 'container', 'instrument', 'implement'] for n in hyper_names):
                        # Additional check: reject abstract concepts
                        abstract_terms = ['state', 'condition', 'quality', 'attribute', 'relation', 'concept', 'idea', 'thought', 'feeling', 'emotion', 'time', 'space', 'quantity', 'measure', 'group', 'class', 'type', 'category']
                        if not any(abstract in syn.definition().lower() for abstract in abstract_terms):
                            theme_cache[cache_key] = True
                            return True
            theme_cache[cache_key] = False
            return False
        except:
            theme_cache[cache_key] = False
            return False

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