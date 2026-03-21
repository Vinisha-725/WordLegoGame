import random
from nltk.corpus import wordnet
from ai.ai_generator import is_valid_word, is_theme_related, check_letter_chain

# Pre-computed word lists for better performance
COMMON_WORDS = {
    'a': ['apple', 'apricot', 'avocado'],
    'b': ['banana', 'blueberry', 'blackberry'],
    'c': ['cherry', 'coconut', 'cranberry'],
    'd': ['date', 'durian'],
    'e': ['elderberry'],
    'f': ['fig', 'fruit'],
    'g': ['grape', 'grapefruit', 'guava'],
    'h': ['honeydew'],
    'i': ['imbe'],
    'j': ['jackfruit'],
    'k': ['kiwi', 'kumquat'],
    'l': ['lemon', 'lime', 'lychee'],
    'm': ['mango', 'melon', 'mandarin'],
    'n': ['nectarine'],
    'o': ['orange', 'olive'],
    'p': ['papaya', 'passion', 'peach', 'pear', 'plum', 'pineapple'],
    'q': ['quince'],
    'r': ['raspberry', 'raisin'],
    's': ['strawberry', 'starfruit'],
    't': ['tangerine', 'tomato'],
    'u': ['ugli'],
    'v': ['vanilla'],
    'w': ['watermelon'],
    'x': ['xigua'],
    'y': ['yellow Passion'],
    'z': ['zucchini']
}

def get_possible_words(last_letter, theme, used_words):
    """Get possible words quickly using pre-computed lists"""
    last_letter = last_letter.lower()
    
    # For fruits theme, use pre-computed list
    if theme.lower() == 'fruits':
        words = COMMON_WORDS.get(last_letter, [])
        return [w for w in words if w not in used_words]
    
    # For other themes, use a smaller, faster approach
    possible_words = []
    
    # Small sample words for different themes
    theme_words = {
        'animals': {
            'a': ['ant', 'antelope', 'ape'],
            'b': ['bear', 'bat', 'bird'],
            'c': ['cat', 'cow', 'camel'],
            'd': ['dog', 'dolphin', 'duck'],
            'e': ['eagle', 'elephant'],
            'f': ['fox', 'frog', 'fish'],
            'g': ['goat', 'gorilla', 'giraffe'],
            'h': ['horse', 'hippo'],
            'i': ['iguana'],
            'j': ['jaguar'],
            'k': ['kangaroo', 'koala'],
            'l': ['lion', 'leopard', 'lizard'],
            'm': ['monkey', 'mouse', 'moose'],
            'n': ['newt'],
            'o': ['owl', 'ostrich'],
            'p': ['panda', 'parrot', 'penguin'],
            'q': ['quail'],
            'r': ['rabbit', 'rhino', 'raccoon'],
            's': ['snake', 'shark', 'sheep'],
            't': ['tiger', 'turtle', 'turkey'],
            'u': ['unicorn'],
            'v': ['vulture'],
            'w': ['wolf', 'whale'],
            'x': ['xerus'],
            'y': ['yak'],
            'z': ['zebra', 'zebrafish']
        },
        'atlas': {
            'a': ['america', 'africa', 'asia', 'atlantic'],
            'b': ['brazil', 'britain', 'berlin'],
            'c': ['china', 'canada', 'california'],
            'd': ['denmark', 'dubai', 'delhi'],
            'e': ['egypt', 'england', 'europe'],
            'f': ['france', 'florida', 'finland'],
            'g': ['germany', 'greece', 'greenland'],
            'h': ['hawaii', 'holland'],
            'i': ['india', 'italy', 'ireland'],
            'j': ['japan', 'jamaica'],
            'k': ['korea', 'kenya'],
            'l': ['london', 'los angeles'],
            'm': ['mexico', 'moscow', 'madrid'],
            'n': ['norway', 'nigeria', 'new york'],
            'o': ['oslo', 'ottawa'],
            'p': ['paris', 'poland', 'portugal'],
            'q': ['quebec'],
            'r': ['rome', 'russia', 'rio'],
            's': ['spain', 'sweden', 'sydney'],
            't': ['tokyo', 'texas', 'turkey'],
            'u': ['usa', 'uk', 'utah'],
            'v': ['venice', 'vietnam'],
            'w': ['washington', 'wisconsin'],
            'x': ['xian'],
            'y': ['york', 'yukon'],
            'z': ['zimbabwe', 'zurich']
        },
        'things': {
            'a': ['apple', 'airplane', 'automobile'],
            'b': ['bottle', 'book', 'box', 'ball'],
            'c': ['chair', 'computer', 'car', 'clock'],
            'd': ['desk', 'door', 'drone'],
            'e': ['eraser', 'engine'],
            'f': ['phone', 'fan', 'fork'],
            'g': ['glass', 'guitar'],
            'h': ['hammer', 'hat', 'house'],
            'i': ['iron', 'ice'],
            'j': ['jar', 'jeans'],
            'k': ['key', 'knife'],
            'l': ['lamp', 'laptop', 'lock'],
            'm': ['mirror', 'mouse', 'mug'],
            'n': ['notebook', 'needle'],
            'o': ['oven', 'orange'],
            'p': ['pen', 'plate', 'phone', 'paper'],
            'q': ['quartz'],
            'r': ['radio', 'ruler', 'remote'],
            's': ['spoon', 'scissors', 'shoe'],
            't': ['table', 'television', 'telephone'],
            'u': ['umbrella'],
            'v': ['vase', 'violin'],
            'w': ['watch', 'window'],
            'x': ['x-ray'],
            'y': ['yarn'],
            'z': ['zipper']
        }
    }
    
    words = theme_words.get(theme.lower(), {}).get(last_letter, [])
    return [w for w in words if w not in used_words]

def evaluate_word(word, game_state):
    """Quick evaluation for AI decision making"""
    score = 0.0
    last_letter = word[-1].lower()
    
    # Simple letter frequency scoring
    rare_letters = {'j', 'q', 'x', 'z', 'k', 'v', 'w', 'y'}
    if last_letter in rare_letters:
        score += 3  # Bonus for rare letters
    else:
        score += 1
    
    # Word length bonus
    if len(word) > 6:
        score += 2
    
    return score

def minimax(game_state, depth, alpha, beta, maximizing_player):
    """Fast minimax with limited depth"""
    
    # Terminal conditions
    if depth == 0 or game_state.get('game_over', False):
        return evaluate_position(game_state), None
    
    current_player = game_state['current_player']
    last_letter = game_state['last_letter']
    theme = game_state['theme']
    used_words = game_state['word_chain']
    
    possible_moves = get_possible_words(last_letter, theme, used_words)
    
    if not possible_moves:
        # No moves available - current player loses
        score = -1000 if maximizing_player else 1000
        return score, None
    
    best_move = None
    
    if maximizing_player:
        max_eval = float('-inf')
        for move in possible_moves:
            # Simulate move
            new_state = {
                'word_chain': used_words + [move],
                'last_letter': move[-1],
                'theme': theme,
                'current_player': 'human',
                'game_over': False
            }
            
            eval_score, _ = minimax(new_state, depth - 1, alpha, beta, False)
            
            if eval_score > max_eval:
                max_eval = eval_score
                best_move = move
            
            alpha = max(alpha, eval_score)
            if beta <= alpha:
                break  # Alpha-beta pruning
        
        return max_eval, best_move
    
    else:
        min_eval = float('inf')
        for move in possible_moves:
            # Simulate move
            new_state = {
                'word_chain': used_words + [move],
                'last_letter': move[-1],
                'theme': theme,
                'current_player': 'ai',
                'game_over': False
            }
            
            eval_score, _ = minimax(new_state, depth - 1, alpha, beta, True)
            
            if eval_score < min_eval:
                min_eval = eval_score
                best_move = move
            
            beta = min(beta, eval_score)
            if beta <= alpha:
                break  # Alpha-beta pruning
        
        return min_eval, best_move

def evaluate_position(game_state):
    """Quick position evaluation"""
    score = 0.0
    
    # If game is over, return extreme values
    if game_state.get('game_over', False):
        if game_state.get('winner') == 'ai':
            return 1000
        else:
            return -1000
    
    # Evaluate based on current position
    last_letter = game_state['last_letter']
    theme = game_state['theme']
    used_words = game_state['word_chain']
    
    # Number of available moves
    available_moves = len(get_possible_words(last_letter, theme, used_words))
    score += available_moves * 0.1
    
    # Current player advantage
    if game_state['current_player'] == 'ai':
        score += 1
    
    return score

def get_best_move(last_letter, theme, word_chain, difficulty='medium'):
    """Get AI's best move quickly"""
    
    # Set search depth based on difficulty
    depth_map = {'easy': 1, 'medium': 2, 'hard': 3}
    depth = depth_map.get(difficulty, 2)
    
    used_words = word_chain or []
    
    # Get possible moves
    possible_moves = get_possible_words(last_letter, theme, used_words)
    
    if not possible_moves:
        return None
    
    if difficulty == 'easy':
        # Easy mode: random valid word
        return random.choice(possible_moves)
    
    # Medium and Hard: use minimax with limited depth
    minimax_state = {
        'word_chain': used_words,
        'last_letter': last_letter,
        'theme': theme,
        'current_player': 'ai',
        'game_over': False
    }
    
    _, best_move = minimax(minimax_state, depth, float('-inf'), float('inf'), True)
    
    # Fallback to random if minimax fails
    if not best_move:
        best_move = random.choice(possible_moves)
    
    return best_move