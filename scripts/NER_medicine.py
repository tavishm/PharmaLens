import spacy
import scispacy
from scispacy.linking import EntityLinker
import time

def get_medicines_with_provenance(texts):
    """
    Extracts Medicines (CHEMICAL entity type) and links them to RxNorm.
    Returns a list of lists of dicts:
    [
        [{"text": "crocin", "canonical": "Acetaminophen", "cui": "161"}], 
        ...
    ]
    matching input texts.
    """
    print("Loading Medicine NER model (en_core_sci_sm)...")
    try:
        # Switch to a more general scientific model which might pick up more entities
        # then filter by linking to RxNorm.
        nlp = spacy.load("en_core_sci_sm")
    except OSError:
        print("Model 'en_core_sci_sm' not found. trying 'en_ner_bc5cdr_md' as backup.")
        try:
             nlp = spacy.load("en_ner_bc5cdr_md", exclude=["tagger", "parser", "attribute_ruler", "lemmatizer"])
        except:
             print("No suitable spacy model found.")
             return [[] for _ in texts]

    if "scispacy_linker" not in nlp.pipe_names:
        # Link to RxNorm (drugs)
        nlp.add_pipe("scispacy_linker", config={
            "resolve_abbreviations": True, 
            "linker_name": "rxnorm",
            "max_entities_per_mention": 1
        })

    linker = nlp.get_pipe("scispacy_linker")
    
    print(f"Extracting medicines from {len(texts)} texts...")
    docs = nlp.pipe(texts, batch_size=50)
    
    results = []
    for doc in docs:
        meds = []
        for ent in doc.ents:
            # For en_core_sci_sm, labels are 'ENTITY'. We rely on the Linker to count it as medicine.
            # Convert to RxNorm (CUI) to see if it exists in the drug database.
            
            if ent._.kb_ents:
                cui, score = ent._.kb_ents[0]
                concept = linker.kb.cui_to_entity[cui]
                
                # Filter: Ideally we check semantic types T116, T121, T109, T195, T200, T126, T127, T109??
                # RxNorm usually contains drugs. If it links, it's likely a drug/chemical.
                
                meds.append({
                    "text": ent.text,
                    "canonical_name": concept.canonical_name,
                    "concept_id": cui
                })
        results.append(meds)
        
    return results

if __name__ == "__main__":
    sample = ["I took aspirin for my headache.", "No meds here."]
    print(get_medicines_with_provenance(sample))