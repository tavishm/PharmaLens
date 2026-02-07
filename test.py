import spacy

# 1. Load the small English pipeline
nlp = spacy.load("en_core_web_sm")

# 2. Process your text
text = "Doing some My GP in Pune said it’s standard here in Maharashtra, India."
doc = nlp(text)

# 3. Print the results
for ent in doc.ents:
    print(f"Entity: {ent.text:15} | Label: {ent.label_}")