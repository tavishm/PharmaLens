import sqlite3
import os
import numpy as np
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

def create_embeddings(db_path="data/pharmalens.db", model_name='all-MiniLM-L6-v2'):
    # Path setup
    base_dir = os.path.dirname(os.path.dirname(__file__))
    full_db_path = os.path.join(base_dir, db_path)
    
    if not os.path.exists(full_db_path):
        print(f"Error: Database not found at {full_db_path}")
        return

    # Load Model
    print(f"Loading embedding model: {model_name}...")
    model = SentenceTransformer(model_name)
    hidden_dim = model.get_sentence_embedding_dimension()
    print(f"Model loaded. Hidden dimension: {hidden_dim}")

    # Connect to DB
    conn = sqlite3.connect(full_db_path)
    cursor = conn.cursor()

    # Create embeddings table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS embeddings (
            id TEXT PRIMARY KEY,
            vector BLOB,
            FOREIGN KEY (id) REFERENCES posts (id)
        )
    ''')
    conn.commit()

    # Fetch data (only those not already embedded)
    print("Fetching texts from database...")
    cursor.execute('''
        SELECT id, text FROM posts 
        WHERE id NOT IN (SELECT id FROM embeddings)
    ''')
    rows = cursor.fetchall()
    
    if not rows:
        print("All entries already have embeddings. Nothing to do.")
        return

    print(f"Generating embeddings for {len(rows)} entries in batches...")
    
    batch_size = 64
    for i in tqdm(range(0, len(rows), batch_size)):
        batch = rows[i:i+batch_size]
        batch_ids = [r[0] for r in batch]
        batch_texts = [r[1] for r in batch]
        
        # Generate vectors
        vectors = model.encode(batch_texts)
        
        # Prepare for DB insert
        insert_data = []
        for pid, vec in zip(batch_ids, vectors):
            insert_data.append((pid, vec.tobytes()))
            
        cursor.executemany('INSERT INTO embeddings (id, vector) VALUES (?, ?)', insert_data)
        conn.commit()

    print(f"Done! Successfully stored {len(rows)} vectors in the 'embeddings' table.")
    print(f"Total vector space dimension: {hidden_dim}")

if __name__ == "__main__":
    create_embeddings()
