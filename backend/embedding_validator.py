from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")


def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def check_theme(word, theme):

    # create embeddings
    theme_vector = model.encode(theme)
    word_vector = model.encode(word)

    similarity = cosine_similarity(theme_vector, word_vector)

    print("SIMILARITY:", similarity)

    # threshold
    if similarity > 0.35:
        return True
    return False