import spacy

def get_locations(texts):
    """
    Extracts GPE (Geopolitical Entity) and LOC (Non-GPE locations) from texts.
    Returns a list of lists of location strings matching input texts order.
    """
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Model 'en_core_web_sm' not found. Downloading...")
        from spacy.cli import download
        download("en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")

    # Disable components not needed for NER to speed up
    # but keep tagger/parser if needed for accurate NER context? 
    # Usually NER needs tok2vec, tagger might help. 
    # For speed, we can disable parser, lemmatizer.
    # But en_core_web_sm is small, so it's fine.
    
    display_progress = len(texts) > 100
    if display_progress:
        print(f"Extracting locations from {len(texts)} texts...")

    docs = nlp.pipe(texts, batch_size=50)
    results = []
    
    for doc in docs:
        locs = set()
        for ent in doc.ents:
            if ent.label_ in ["GPE", "LOC"]:
                locs.add(ent.text)
        results.append(list(locs))
        
    return results

if __name__ == "__main__":
    sample = ["I travelled from London to New York.", "This drug is available in Canada."]
    print(get_locations(sample))