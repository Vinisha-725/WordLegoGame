from transformers import pipeline

classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

def check_theme(word, theme):

    hypothesis = f"{word} is a {theme}"

    result = classifier(
        hypothesis,
        candidate_labels=["true", "false"]
    )

    score = result["scores"][0]

    return score > 0.75