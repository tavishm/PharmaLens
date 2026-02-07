import spacy
import scispacy
from scispacy.linking import EntityLinker

# 1. Load the medical NER model
# 'en_ner_bc5cdr_md' is trained on Chemicals and Diseases
nlp = spacy.load("en_ner_bc5cdr_md")

# 2. Add the Entity Linker to the pipeline
# This is the "cross-referencing" step. Linkers available: umls, rxnorm, mesh, etc.
nlp.add_pipe("scispacy_linker", config={"resolve_abbreviations": True, "linker_name": "umls"})

# 3. Process the text
text = "Bro i took crocin last night and i couldnt wake up this morning 😭"
doc = nlp(text)

# 4. Extract and Link Entities
linker = nlp.get_pipe("scispacy_linker")

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