from nltk.corpus import wordnet as wn

def test(word, theme):
    synsets = wn.synsets(word)
    if not synsets:
        return False
    for syn in synsets:
        paths = syn.hypernym_paths()
        for path in paths:
            hyper_names = [s.name().split('.')[0] for s in path]
            if theme == 'animals' and any(n in ['animal', 'bird', 'fish', 'insect', 'reptile', 'amphibian'] for n in hyper_names):
                return True
            if theme == 'atlas' and any(n in ['location', 'region', 'country', 'city', 'body_of_water', 'landmass', 'geographical_area'] for n in hyper_names):
                return True
            if theme == 'things' and any(n in ['artifact', 'instrumentality', 'article', 'commodity'] for n in hyper_names):
                return True
    return False

print("tiger animal:", test('tiger', 'animals'))
print("russia animal:", test('russia', 'animals'))
print("russia atlas:", test('russia', 'atlas'))
print("chair things:", test('chair', 'things'))
print("apple things:", test('apple', 'things'))
