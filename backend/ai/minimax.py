import random
from ai.ai_generator import is_valid_word, is_theme_related, FRUITS_LIST, THINGS_LIST
import nltk
from nltk.corpus import wordnet

def get_possible_words(last_letter, theme, used_words):
    """Get possible words - GUARANTEED to find something"""
    last_letter = last_letter.lower()
    theme = theme.lower()
    
    # Use set for faster lookup - normalize by removing spaces
    used_set = set(word.replace(' ', '') for word in used_words)
    possible_words = []
    
    # Special fast path for fruits theme
    if theme == 'fruits':
        for fruit in FRUITS_LIST:
            fruit_no_spaces = fruit.replace(' ', '')
            if (fruit_no_spaces.startswith(last_letter) and 
                fruit_no_spaces not in used_set and 
                len(fruit_no_spaces) > 2 and 
                len(fruit_no_spaces) < 15 and
                fruit_no_spaces.isalpha()):
                possible_words.append(fruit)  # Return original with spaces
                if len(possible_words) >= 5:
                    return possible_words
        return possible_words
    
    # EMERGENCY FALLBACK: Use hardcoded things list for things theme
    if theme == 'things':
        for thing in THINGS_LIST:
            thing_no_spaces = thing.replace(' ', '')
            if (thing_no_spaces.startswith(last_letter) and 
                thing_no_spaces not in used_set and 
                len(thing_no_spaces) > 2 and 
                len(thing_no_spaces) < 15 and
                thing_no_spaces.isalpha()):
                possible_words.append(thing)  # Return original with spaces
                if len(possible_words) >= 5:
                    return possible_words
        if possible_words:
            return possible_words
    
    # For other themes, scan words starting with the right letter
    api_calls_made = 0
    words_checked = 0
    max_api_calls = 3 # Heavily constrain API calls to avoid waiting
    
    # We iterate over words in wordnet that start with "last_letter"
    for word in wordnet.words():
        word = word.lower()
        if not word.startswith(last_letter):
            continue
            
        if (word in used_set or 
            len(word) <= 2 or 
            len(word) >= 15 or
            not word.isalpha()):
            continue
            
        words_checked += 1
        
        # Fast purely local check first (if not valid, skip)
        synsets = wordnet.synsets(word)
        if not synsets:
            continue
            
        # Optional: fast pre-filter using WordNet before API 
        is_candidate = False
        for syn in synsets:
            paths = syn.hypernym_paths()
            for path in paths:
                hyper_names = [s.name().split('.')[0] for s in path]
                if theme == 'animals' and any(n in ['animal', 'bird', 'fish', 'insect', 'reptile', 'amphibian'] for n in hyper_names):
                    is_candidate = True; break
                if theme == 'atlas' and any(n in ['location', 'region', 'country', 'city', 'body_of_water', 'landmass', 'geographical_area'] for n in hyper_names):
                    is_candidate = True; break
                if theme == 'things' and any(n in ['artifact', 'instrumentality', 'article', 'commodity', 'object'] for n in hyper_names):
                    is_candidate = True; break
                if theme not in ['animals', 'atlas', 'things']:
                    is_candidate = True; break # Other themes are passed to AI
            if is_candidate: break
        
        if not is_candidate:
            # Terminate search if we check too many failed words to prevent hanging
            if words_checked > 200:
                break
            continue
            
        # Now we know it's a strong candidate, verify with the formal function (which caches and uses Gemini)
        if is_theme_related(word, theme):
            if word not in possible_words:
                possible_words.append(word)
                if len(possible_words) >= 4:
                    return possible_words
        
        api_calls_made += 1
        if api_calls_made >= max_api_calls and len(possible_words) > 0:
            return possible_words
    
    # ULTIMATE FALLBACK: Generate something that works
    if not possible_words:
        # Use theme name + letter as fallback
        fallback_word = theme[:2] + last_letter
        possible_words.append(fallback_word)
            
    return possible_words

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

def minimax(game_state, depth, alpha, beta, maximizing_player, difficulty='medium'):
    """Fast minimax with limited depth and move count"""
    
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
    
    # Limit moves to consider for performance - DIFFICULTY BASED
    if difficulty == 'hard':
        max_moves = 10 if maximizing_player else 8  # More moves for hard mode
    else:
        max_moves = 5 if maximizing_player else 3  # Standard limits
    
    if len(possible_moves) > max_moves:
        possible_moves = possible_moves[:max_moves]
    
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
            
            eval_score, _ = minimax(new_state, depth - 1, alpha, beta, False, difficulty)
            
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
            
            eval_score, _ = minimax(new_state, depth - 1, alpha, beta, True, difficulty)
            
            if eval_score < min_eval:
                min_eval = eval_score
                best_move = move
            
            beta = min(beta, eval_score)
            if beta <= alpha:
                break  # Alpha-beta pruning
        
        return min_eval, best_move

def evaluate_position(game_state):
    """Quick position evaluation - OPTIMIZED"""
    score = 0.0
    
    # If game is over, return extreme values
    if game_state.get('game_over', False):
        if game_state.get('winner') == 'ai':
            return 1000
        else:
            return -1000
    
    # Simple evaluation without expensive calls
    last_letter = game_state['last_letter']
    used_words = game_state['word_chain']
    
    # Simple scoring based on position
    if game_state['current_player'] == 'ai':
        score += 2  # AI advantage
    
    # Small penalty for longer chains (harder to find words)
    score -= len(used_words) * 0.1
    
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
        # Easy mode: shallow minimax (depth=1) instead of random
        minimax_state = {
            'word_chain': used_words,
            'last_letter': last_letter,
            'theme': theme,
            'current_player': 'ai',
            'game_over': False
        }
        _, best_move = minimax(minimax_state, 1, float('-inf'), float('inf'), True, difficulty)
        
        # Fallback to random if minimax fails
        if not best_move:
            best_move = random.choice(possible_moves)
        
        return best_move
    
    # Medium and Hard: use minimax with limited depth
    minimax_state = {
        'word_chain': used_words,
        'last_letter': last_letter,
        'theme': theme,
        'current_player': 'ai',
        'game_over': False
    }
    
    _, best_move = minimax(minimax_state, depth, float('-inf'), float('inf'), True, difficulty)
    
    # Fallback to random if minimax fails
    if not best_move:
        best_move = random.choice(possible_moves)
    
    return best_move