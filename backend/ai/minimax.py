import random
from nltk.corpus import wordnet
from ai.ai_generator import is_valid_word, is_theme_related, check_letter_chain

def get_possible_words(last_letter, theme, used_words):
    """Get all possible valid words starting with last_letter"""
    possible_words = []
    
    # Search through WordNet for words starting with the required letter
    for syn in wordnet.all_synsets():
        for lemma in syn.lemmas():
            word = lemma.name().replace("_", "").lower()
            
            # Check if word meets all criteria
            if (word.startswith(last_letter.lower()) and 
                word not in used_words and 
                len(word) > 2 and  # Avoid very short words
                is_valid_word(word) and 
                is_theme_related(word, theme) and
                check_letter_chain(None, word)):  # Just check letter start
                
                possible_words.append(word)
    
    # Limit to reasonable number for performance
    return possible_words[:50] if possible_words else []

def evaluate_word(word, game_state):
    """Evaluate the strategic value of a word"""
    score = 0.0
    last_letter = word[-1].lower()
    
    # Factor 1: Position value (rare last letters are valuable)
    letter_frequency = {
        'e': 12.7, 't': 9.1, 'a': 8.2, 'o': 7.5, 'i': 7.0, 'n': 6.7,
        's': 6.3, 'h': 6.1, 'r': 6.0, 'd': 4.3, 'l': 4.0, 'c': 2.8,
        'u': 2.8, 'm': 2.4, 'w': 2.4, 'f': 2.2, 'g': 2.0, 'y': 2.0,
        'p': 1.9, 'b': 1.5, 'v': 1.0, 'k': 0.8, 'j': 0.2, 'x': 0.2,
        'q': 0.1, 'z': 0.1
    }
    
    # Lower frequency = higher score (strategic advantage)
    score += (10 - letter_frequency.get(last_letter, 5)) * 2
    
    # Factor 2: Word length (moderate bonus for longer words)
    score += min(len(word) * 0.5, 3)
    
    # Factor 3: Available next moves (penalty if too many options for opponent)
    next_moves = get_possible_words(last_letter, game_state['theme'], game_state['word_chain'] + [word])
    if len(next_moves) > 20:
        score -= 2  # Too many options for opponent
    elif len(next_moves) < 5:
        score += 3  # Limit opponent options
    
    # Factor 4: Word uniqueness (bonus for uncommon words)
    if len(word) > 6:
        score += 1
    
    return score

def minimax(game_state, depth, alpha, beta, maximizing_player):
    """Minimax algorithm with alpha-beta pruning"""
    
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
                'current_player': 'human',  # Switch player
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
                'current_player': 'ai',  # Switch player
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
    """Evaluate the current game position"""
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
    """Get AI's best move based on difficulty"""
    
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
    
    # Medium and Hard: use minimax
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