import random
from ai.ai_generator import is_valid_word, is_theme_related, FRUITS_LIST
import nltk
from nltk.corpus import wordnet

def get_possible_words(last_letter, theme, used_words):
    """Get possible words - ULTRA FAST with hardcoded fruit list"""
    last_letter = last_letter.lower()
    theme = theme.lower()
    
    # Use set for faster lookup
    used_set = set(used_words)
    possible_words = []
    
    # Special fast path for fruits theme
    if theme == 'fruits':
        for fruit in FRUITS_LIST:
            if (fruit.startswith(last_letter) and 
                fruit not in used_set and 
                len(fruit) > 2 and 
                len(fruit) < 15 and
                fruit.isalpha()):
                possible_words.append(fruit)
                if len(possible_words) >= 5:
                    return possible_words
        return possible_words
    
    # For other themes, use limited WordNet search
    words_checked = 0
    max_checks = 1000  # Drastically reduced for speed
    
    for synset in wordnet.all_synsets():
        for lemma in synset.lemmas():
            words_checked += 1
            
            # Very early termination
            if words_checked > max_checks:
                return possible_words
            
            word = lemma.name().replace('_', '').lower()
            
            # Quick filters first
            if (not word.startswith(last_letter) or 
                word in used_set or 
                len(word) <= 2 or 
                len(word) >= 15 or
                not word.isalpha()):
                continue
                
            # Only check validity for promising candidates
            if not is_valid_word(word):
                continue
                
            # Theme check
            if not is_theme_related(word, theme):
                continue
                
            if word not in possible_words:
                possible_words.append(word)
                
                # Return very early for speed
                if len(possible_words) >= 5:  # Reduced to 5 for speed
                    return possible_words
    
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

def minimax(game_state, depth, alpha, beta, maximizing_player):
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
    
    # Limit moves to consider for performance
    max_moves = 5 if maximizing_player else 3  # Reduced for speed
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