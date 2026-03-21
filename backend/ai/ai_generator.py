import google.generativeai as genai

genai.configure(api_key="AIzaSyABWNWTqAcYRZzTCimsOjtDagb0JFBYDEA")

model = genai.GenerativeModel("gemini-1.5-flash")  # NOT gemini-pro

def generate_words(letter, theme):
    prompt = f"""
    Give 5 single words related to '{theme}' starting with letter '{letter}'.
    Only return comma-separated words. No explanation.
    """

    response = model.generate_content(prompt)

    words = response.text.strip().lower().split(",")
    return [w.strip() for w in words if w.strip()]