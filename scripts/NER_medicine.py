# import spacy
# import scispacy
# from scispacy.linking import EntityLinker
# import time


# def get_medicine_name(corpus):
#     # 1. Load the medical NER model
#     # 'en_ner_bc5cdr_md' is trained on Chemicals and Diseases
#     # a=time.time()
#     nlp = spacy.load("en_ner_bc5cdr_md", exclude=["tagger", "parser", "attribute_ruler", "lemmatizer"])
#     # print("loading dataset: ", time.time()-a)


#     # 2. Add the Entity Linker to the pipeline
#     # This is the "cross-referencing" step. Linkers available: umls, rxnorm, mesh, etc.
#     # Limit max_entities to 1 for speed
#     # a=time.time()
#     nlp.add_pipe("scispacy_linker", config={
#         "resolve_abbreviations": True, 
#         "linker_name": "rxnorm",
#         "max_entities_per_mention": 1  # <--- LINKER CONFIG CHANGE
#     })
#     # print("loading linker: ", time.time()-a)


#     # 3. Process the text
#     # a = time.time()
#     docs = list(nlp.pipe(large_dataset, batch_size=500, n_process=-1))
#     # print("running nlp: ", time.time()-a)
#     # for LARGE datasets
#     # docs = list(nlp.pipe(large_dataset, batch_size=500, n_process=-1))

#     # 4. Extract and Link Entities
#     # a = time.time()
#     linker = nlp.get_pipe("scispacy_linker")
#     # print("linking: ", time.time() - a)

#     # print(f"{'Entity':<15} | {'Label':<10} | {'Canonical Name':<20} | {'Concept ID'}")
#     # print("-" * 70)

#     for ent in doc.ents:
#         # Get the best matching concept from the database
#         best_concept = ent..kb_ents[0] if ent..kb_ents else None
        
#         if best_concept:
#             concept_id, score = best_concept
#             concept = linker.kb.cui_to_entity[concept_id]
            
#             # print(f"{ent.text:<15} | {ent.label_:<10} | {concept.canonical_name:<20} | {concept_id}")
#             return ent.canonical_name
#         else:
#             return None
        

# get_medicine_name("bro i need methamphetamnes does anybody have DOLO")

import spacy
import scispacy
from scispacy.linking import EntityLinker

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

if __name__ == "_main_":
    sample = ["I took aspirin for my headache.", "No meds here."]
    print(get_medicines_with_provenance(sample))
