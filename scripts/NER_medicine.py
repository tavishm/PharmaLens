import spacy
import scispacy
from scispacy.linking import EntityLinker
import time

# 1. Load the medical NER model
# 'en_ner_bc5cdr_md' is trained on Chemicals and Diseases
a=time.time()
nlp = spacy.load("en_ner_bc5cdr_md", exclude=["tagger", "parser", "attribute_ruler", "lemmatizer"])
print("loading dataset: ", time.time()-a)


# 2. Add the Entity Linker to the pipeline
# This is the "cross-referencing" step. Linkers available: umls, rxnorm, mesh, etc.
# Limit max_entities to 1 for speed
a=time.time()
nlp.add_pipe("scispacy_linker", config={
    "resolve_abbreviations": True, 
    "linker_name": "rxnorm",
    "max_entities_per_mention": 1  # <--- LINKER CONFIG CHANGE
})
print("loading linker: ", time.time()-a)


# 3. Process the text
text = "Bro i took crocin last night and i couldnt wake up this morning 😭"
a = time.time()
doc = nlp(text)
print("running nlp: ", time.time()-a)
# for LARGE datasets
# docs = list(nlp.pipe(large_dataset, batch_size=500, n_process=-1))

# 4. Extract and Link Entities
a = time.time()
linker = nlp.get_pipe("scispacy_linker")
print("linking: ", time.time() - a)

print(f"{'Entity':<15} | {'Label':<10} | {'Canonical Name':<20} | {'Concept ID'}")
print("-" * 70)

for ent in doc.ents:
    # Get the best matching concept from the database
    best_concept = ent._.kb_ents[0] if ent._.kb_ents else None
    
    if best_concept:
        concept_id, score = best_concept
        concept = linker.kb.cui_to_entity[concept_id]
        
        print(f"{ent.text:<15} | {ent.label_:<10} | {concept.canonical_name:<20} | {concept_id}")
    else:
        print(f"{ent.text:<15} | {ent.label_:<10} | {'No Match Found':<20} | N/A")