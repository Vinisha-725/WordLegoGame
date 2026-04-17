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
    'wire', 'plug', 'socket', 'switch', 'bulb', 'flashlight', 'lantern', 'candle', 'match', 'lighter', 'word'
}

# Hardcoded blacklist for inappropriate words only
THINGS_BLACKLIST = {
    'kampuchean', 'yankee', 'nigger', 'nigga', 'fuck', 'shit', 'cunt', 'bitch',
    'whore', 'slut', 'bastard', 'asshole', 'dickhead', 'piss', 'crap', 'damn'
}

# Hardcoded atlas list - comprehensive geography
ATLAS_LIST = {
    # COUNTRIES (A-Z)
    'afghanistan', 'albania', 'algeria', 'andorra', 'angola', 'antigua', 'argentina', 'armenia',
    'australia', 'austria', 'azerbaijan', 'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus',
    'belgium', 'belize', 'benin', 'bhutan', 'bolivia', 'bosnia', 'botswana', 'brazil',
    'brunei', 'bulgaria', 'burundi', 'cambodia', 'cameroon', 'canada', 'capeverde', 'chad',
    'chile', 'china', 'colombia', 'comoros', 'congo', 'croatia', 'cuba', 'cyprus',
    'czech', 'denmark', 'djibouti', 'dominica', 'ecuador', 'egypt', 'elsalvador', 'eritrea',
    'estonia', 'eswatini', 'ethiopia', 'fiji', 'finland', 'france', 'gabon', 'gambia',
    'georgia', 'germany', 'ghana', 'greece', 'grenada', 'guatemala', 'guinea', 'guyana',
    'haiti', 'honduras', 'hungary', 'iceland', 'india', 'indonesia', 'iran', 'iraq',
    'ireland', 'israel', 'italy', 'jamaica', 'japan', 'jordan', 'kazakhstan', 'kenya',
    'kiribati', 'kosovo', 'kuwait', 'kyrgyzstan', 'laos', 'latvia', 'lebanon', 'lesotho',
    'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg', 'madagascar', 'malawi', 'malaysia',
    'maldives', 'mali', 'malta', 'mauritania', 'mauritius', 'mexico', 'micronesia', 'moldova',
    'monaco', 'mongolia', 'montenegro', 'morocco', 'mozambique', 'myanmar', 'namibia', 'nauru',
    'nepal', 'netherlands', 'nicaragua', 'niger', 'nigeria', 'northmacedonia', 'norway', 'oman',
    'pakistan', 'palau', 'palestine', 'panama', 'paraguay', 'peru', 'philippines', 'poland',
    'portugal', 'qatar', 'romania', 'russia', 'rwanda', 'samoa', 'senegal', 'serbia',
    'seychelles', 'singapore', 'slovakia', 'slovenia', 'somalia', 'spain', 'srilanka', 'sudan',
    'suriname', 'sweden', 'switzerland', 'syria', 'taiwan', 'tajikistan', 'tanzania', 'thailand',
    'togo', 'tonga', 'tunisia', 'turkey', 'turkmenistan', 'tuvalu', 'uganda', 'ukraine',
    'uae', 'uk', 'usa', 'uruguay', 'uzbekistan', 'vanuatu', 'vatican', 'venezuela',
    'vietnam', 'yemen', 'zambia', 'zimbabwe',
    # CITIES
    'tokyo', 'delhi', 'shanghai', 'dhaka', 'saopaulo', 'mexicocity', 'cairo', 'beijing',
    'mumbai', 'osaka', 'karachi', 'chongqing', 'kinshasa', 'lagos', 'istanbul', 'buenosaires',
    'kolkata', 'manila', 'tianjin', 'guangzhou', 'rio', 'lahore', 'bangalore', 'shenzhen',
    'moscow', 'chennai', 'bogota', 'jakarta', 'lima', 'paris', 'bangkok', 'hyderabad',
    'london', 'ahmedabad', 'newyork', 'tehran', 'kuala', 'santiago', 'singapore', 'riyadh',
    'baghdad', 'ankara', 'berlin', 'madrid', 'jaipur', 'amman', 'nairobi', 'pune',
    'sydney', 'chicago', 'dubai', 'melbourne', 'rome', 'barcelona', 'montreal', 'toronto',
    'vancouver', 'miami', 'sanfrancisco', 'losangeles', 'seattle', 'boston', 'dallas', 'houston',
    'atlanta', 'phoenix', 'philadelphia', 'detroit', 'denver', 'portland', 'lasvegas', 'austin',
    'nashville', 'neworleans', 'cleveland', 'minneapolis', 'tampa', 'pittsburgh', 'cincinnati', 'kansas',
    'baltimore', 'milwaukee', 'charlotte', 'raleigh', 'omaha', 'tucson', 'fresno', 'mesa',
    'sacramento', 'longbeach', 'oakland', 'tulsa', 'wichita', 'arlington', 'bakersfield', 'anaheim',
    'honolulu', 'riverside', 'lexington', 'stockton', 'corpus', 'irvine', 'orlando', 'irving',
    'newark', 'lincoln', 'toledo', 'chandler', 'fortwayne', 'lubbock', 'madison', 'gilbert',
    'reno', 'buffalo', 'chesapeake', 'aurora', 'scottsdale', 'glendale', 'greensboro', 'winston',
    'fremont', 'boise', 'richmond', 'batonrouge', 'desmoines', 'spokane', 'sanbernardino', 'modesto',
    'birmingham', 'rochester', 'oxnard', 'fremont', 'irvine', 'moreno', 'glendale', 'huntington',
    'augusta', 'amarillo', 'little', 'akron', 'shreveport', 'mobile', 'grandrapids', 'saltlake',
    'huntsville', 'tallahassee', 'grandprairie', 'knoxville', 'worcester', 'newport', 'providence', 'fortlauderdale',
    'chattanooga', 'tempe', 'brownsville', 'jackson', 'providence', 'overland', 'vancouver', 'sioux',
    'peoria', 'springfield', 'lancaster', 'eugene', 'salem', 'elizabeth', 'pasadena', 'palmdale',
    'mcallen', 'topeka', 'thornton', 'miramar', 'odessa', 'carlsbad', 'mesquite', 'hayward',
    'sunnyvale', 'fullerton', 'orange', 'roseville', 'denton', 'surprise', 'murfreesboro', 'mcKinney',
    'midland', 'manchester', 'olathe', 'carrollton', 'rockford', 'gainesville', 'bellevue', 'visalia',
    'concord', 'charleston', 'clarksville', 'vallejo', 'thousandoaks', 'raleigh', 'fairfield', 'berkeley',
    'richardson', 'arvada', 'annarbor', 'rochester', 'cambridge', 'antioch', 'temecula', 'college',
    'billings', 'gresham', 'highpoint', 'greenbay', 'murrieta', 'inglewood', 'odessa', 'league',
    'brokenarrow', 'westvalley', 'miami', 'boulder', 'provo', 'westminster', 'northcharleston', 'norwalk',
    'fairfield', 'berkeley', 'manchester', 'santa', 'fargo', 'billings', 'elgin', 'waterbury',
    'costamesa', 'miami', 'daly', 'westcovina', 'richardson', 'pompano', 'gresham', 'lewisville',
    'lakewood', 'burbank', 'everett', 'inglewood', 'southbend', 'edison', 'kenosha', 'woodbridge',
    # US STATES
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware',
    'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas',
    'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi',
    'missouri', 'montana', 'nebraska', 'nevada', 'newhampshire', 'newjersey', 'newmexico', 'newyork',
    'northcarolina', 'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhodeisland', 'southcarolina',
    'southdakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'westvirginia',
    'wisconsin', 'wyoming',
    # CONTINENTS
    'africa', 'antarctica', 'asia', 'australia', 'europe', 'northamerica', 'southamerica',
    # OCEANS & SEAS
    'pacific', 'atlantic', 'indian', 'arctic', 'antarctic', 'caribbean', 'mediterranean', 'baltic',
    'blacksea', 'redsea', 'arabiansea', 'southchina', 'coral', 'tasman', 'adriatic', 'aegean',
    'tyrrhenian', 'ionian', 'ligurian', 'alboran', 'bering', 'okhotsk', 'japansea', 'yellow',
    'eastchina', 'philippine', 'sulu', 'celebes', 'javasea', 'flores', 'bandasea', 'arafura',
    'timor', 'molucca', 'halmahera', 'ceram', 'barents', 'kara', 'laptev', 'east',
    'beaufort', 'chukchi', 'white', 'barents', 'norwegian', 'greenland', 'labrador', 'hudson',
    'baffin', 'davies', 'amundsen', 'ross', 'weddell', 'scotia', 'bellingshausen', 'lazarev',
    'mawson', 'davis', ' Cooperation', ' Cooperation', ' Cooperation', ' Cooperation',
    # MAJOR RIVERS
    'amazon', 'nile', 'yangtze', 'mississippi', 'yenisei', 'yellow', 'ob', 'congo',
    'amur', 'lena', 'mekong', 'mackenzie', 'niger', 'brahmaputra', 'volga', 'indus',
    'tunguska', 'zambezi', 'orinoco', 'danube', 'salween', 'yenisei', 'amur', 'lena',
    'irrawaddy', 'godavari', 'missouri', 'parana', 'murray', 'tigris', 'rhine', 'ganges',
    'sao', 'puru', 'madeira', 'arawak', 'grande', 'colorado', 'ohio', 'tennessee',
    'columbia', 'snake', 'platte', 'arkansas', 'red', 'minnesota', 'wabash', 'green',
    'potomac', 'susquehanna', 'delaware', 'hudson', 'connecticut', 'merrimack', 'kennebec', 'penobscot',
    # MAJOR LAKES
    'superior', 'victoria', 'huron', 'michigan', 'tangan', 'baikal', 'greatbear', 'malawi',
    'erie', 'winnipeg', 'ontario', 'ladoga', 'vostok', 'onega', 'titicaca', 'nicaragua',
    'athabasca', 'reindeer', 'turkana', 'albert', 'victoria', 'tanganyika', 'kivu', 'edward',
    'mweru', 'bangweulu', 'koko', 'balkhash', 'issyk', 'qinghai', 'dongting', 'poyang',
    'tai', 'hulun', 'xingkai', 'biwa', 'ladoga', 'onega', 'peipus', 'vattern',
    # MOUNTAINS
    'everest', 'k2', 'kangchenjunga', 'lhotse', 'makalu', 'chooyu', 'dhaulagiri', 'manaslu',
    'nanga', 'annapurna', 'gasherbrum', 'broad', 'shishapangma', 'aconcagua', 'denali', 'kilimanjaro',
    'elbrus', 'vinson', 'puncak', 'montblanc', 'matterhorn', 'eiger', 'jungfrau', 'zugspitze',
    'olympus', 'fuji', 'rainier', 'whitney', 'elbert', 'harney', 'mckinley', 'foraker',
    'hunter', 'bona', 'saint', 'bering', 'fairweather', 'hubbard', 'alaska', 'wrangell',
    'hassan', 'marcy', 'washington', 'franconia', 'lafayette', 'lincoln', 'moosilauke', 'cannon',
    # DESERTS
    'sahara', 'arabian', 'gobi', 'kalahari', 'mojave', 'sonoran', 'chihuahuan', 'greatvictoria',
    'patagonian', 'greatsandy', 'karakum', 'thar', 'namib', 'atacama', 'danakil', 'rub',
    'syrian', 'negev', 'colorado', 'yuma', 'registan', 'dashtekavir', 'dashtelut', 'an',
    # ISLANDS
    'greenland', 'newguinea', 'borneo', 'madagascar', 'baffin', 'sumatra', 'honshu', 'luzon',
    'greatbritain', 'victoria', 'ellesmere', 'ceylon', 'newfoundland', 'cuba', 'iceland', 'mindanao',
    'ireland', 'hokkaido', 'sakhalin', 'hispaniola', 'banks', 'srilanka', 'tasmnia', 'devon',
    'alexander', 'southampton', 'melville', 'axel', 'norfolk', 'tahiti', 'fiji', 'malta',
    'cyprus', 'sardinia', 'sicily', 'crete', 'majorca', 'minorca', 'ibiza', 'corfu',
    'rhodes', 'lesbos', 'euboea', 'malta', 'manhattan', 'longisland', 'staten', 'rhodeisland',
    # REGIONS
    'caribbean', 'scandinavia', 'balkans', 'caucasus', 'anatolia', 'levant', 'mesopotamia', 'maghreb',
    'sub-sahara', 'patagonia', 'pampas', 'amazonia', 'andean', 'centralasia', 'siberia', 'manchuria',
    'indochina', 'malay', 'deccan', 'gujarat', 'punjab', 'bengal', 'kashmir', 'balochistan',
    'sindh', 'myanmar', 'thai', 'lao', 'khmer', 'viet', 'malay', 'borneo',
    'sumatra', 'java', 'sulawesi', 'timor', 'moluccas', 'papua', 'micronesia', 'melanesia',
    'polynesia', 'hawaii', 'tahiti', 'samoa', 'tonga', 'fiji', 'guam', 'palau',
    'guadeloupe', 'martinique', 'reunion', 'mauritius', 'seychelles', 'comoros', 'canary', 'azores',
    'madeira', 'balearic', 'sardinia', 'corsica', 'elba', 'sicily', 'malta', 'crete',
    'rhodes', 'cyprus', 'hokkaido', 'honshu', 'kyushu', 'shikoku', 'okinawa', 'amami'
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
        
    # Fast check for atlas theme using hardcoded list
    if theme == "atlas":
        if word in ATLAS_LIST or word_no_spaces in ATLAS_LIST:
            theme_cache[cache_key] = True
            return True
        # If not in list, fall through to AI validation
        
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