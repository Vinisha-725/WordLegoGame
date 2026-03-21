import sys
try:
    from fastapi import FastAPI
    from sentence_transformers import SentenceTransformer
    print("Imports success!")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Model loaded!")
except Exception as e:
    print(f"Error: {e}")
