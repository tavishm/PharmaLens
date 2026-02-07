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
#         best_concept = ent._.kb_ents[0] if ent._.kb_ents else None
        
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

def get_medicine_names(large_dataset):
    """
    Refactored to handle large datasets by splitting NER (multi-core) 
    and Linking (single-core) to avoid NMSLIB pickle errors.
    """
    
    # --- PHASE 1: Fast NER Detection (Multiprocessing) ---
    # Load only the NER model without the linker to use all CPU cores
    nlp_ner = spacy.load("en_ner_bc5cdr_md", exclude=["tagger", "parser", "attribute_ruler", "lemmatizer"])
    
    print(f"Starting NER detection on {len(large_dataset)} documents...")
    # This part uses all cores (n_process=-1)
    docs = list(nlp_ner.pipe(large_dataset, batch_size=500, n_process=-1))
    
    # --- PHASE 2: Entity Linking (Single Process) ---
    # Create a blank model just to host the linker
    nlp_linker = spacy.blank("en")
    nlp_linker.add_pipe("scispacy_linker", config={
        "resolve_abbreviations": True, 
        "linker_name": "rxnorm",
        "max_entities_per_mention": 1 # Speed up database lookup
    })
    
    linker = nlp_linker.get_pipe("scispacy_linker")
    final_output = []

    print("Starting database linking (RxNorm)...")
    # We must process these on a single core to avoid the FloatIndex error
    for doc in docs:
        doc_meds = []
        # Manually trigger the linker on the doc
        linked_doc = linker(doc)
        
        for ent in linked_doc.ents:
            # We filter for CHEMICAL label to ensure we only get medicines
            if ent.label_ == "CHEMICAL" and ent._.kb_ents:
                concept_id, score = ent._.kb_ents[0]
                concept = linker.kb.cui_to_entity[concept_id]
                
                doc_meds.append(concept.canonical_name,)
        
        final_output.append(doc_meds)

    return final_output

# --- Example Run ---
if __name__ == "__main__":
    my_data = [
        "bro i need methamphetamines does anybody have crocin",
        "The patient is on 50mg of Losartan.",
        "Aspirin helps with the headache."
    ]
    
    results = get_medicine_names(my_data)
    
    for i, meds in enumerate(results):
        print(f"Doc {i}: {meds}")