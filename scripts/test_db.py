# text with ID
import sqlite3

from sentence_transformers import SentenceTransformer

def chunk(text):
    import re

    CONNECTORS = r"""
        \s+and\s+ |
        \s+but\s+ |
        \s+or\s+ |
        \s+nor\s+ |
        \s+yet\s+ |
        \s+so\s+ |
        \s+however\s+ |
        \s+therefore\s+ |
        \s+although\s+ |
        \s+though\s+ |
        [.,;:—]
    """
    phrases = re.split(CONNECTORS, text, flags=re.IGNORECASE | re.VERBOSE)
    return [p.strip() for p in phrases if p.strip()]

model = SentenceTransformer('all-MiniLM-L6-v2')


def get_embeddings(texts):
    # 'all-MiniLM-L6-v2' is fast; use 'dmis-lab/biobert-v1.1' for specialized medical text    
    return model.encode(texts)

full_db_path = "data\pharmalens.db"
conn = sqlite3.connect(full_db_path)
cursor = conn.cursor()
cursor.execute('''
    SELECT id, text FROM posts 
    LIMIT 10
''')
rows = cursor.fetchall()
data = {entry[0]: entry[1] for entry in rows}
print(data)


# Chunk

data = {key: chunk(value) for key, value in data.items()}
print(data)
chunked_data = data.copy()

# Embed
flat_data = []
for value in data.values(): flat_data.extend(value)
embeddings = get_embeddings(flat_data)
i = 0
for key, value in data.items():
    data[key] = []
    for chunk in value:
        data[key].append(embeddings[i])
        i+=1

print(chunked_data)
data_alt = {key: get_embeddings(value) for key, value in chunked_data.items()}

print(data[1], alt_data[1], data[-1], alt_data[-1])

if data_alt == data_alt: "Equal!"
else: "Not Equal!"