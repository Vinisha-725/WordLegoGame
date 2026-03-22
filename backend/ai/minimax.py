import random
from ai.ai_generator import is_valid_word, is_theme_related
import nltk
from nltk.corpus import wordnet

def get_possible_words(last_letter, theme, used_words):
    """Get possible words from full WordNet dictionary - Optimized"""
    last_letter = last_letter.lower()
    theme = theme.lower()
    
    # Use set for faster lookup
    used_set = set(used_words)
    possible_words = []
    
    # Get words from WordNet more efficiently
    for synset in wordnet.all_synsets():
        for lemma in synset.lemmas():
            word = lemma.name().replace('_', '').lower()
            
            # Basic filters
            if (word.startswith(last_letter) and 
                word not in used_set and 
                len(word) > 2 and 
                len(word) < 15 and
                word.isalpha() and
                is_valid_word(word)):
                
                if word not in possible_words:
                    possible_words.append(word)
                    
                    # Limit early to avoid performance issues
                    if len(possible_words) >= 50:
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