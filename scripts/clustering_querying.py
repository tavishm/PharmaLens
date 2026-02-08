import os
import re
import sqlite3
import numpy as np
import hdbscan
import umap
from collections import Counter
from sentence_transformers import SentenceTransformer
from sklearn.metrics import pairwise_distances_argmin_min
import google.generativeai as genai
from dotenv import load_dotenv
import requests
import json
import concurrent.futures
import time
import os

# Import NER modules
try:
    from NER_location import get_locations
    from NER_medicine import get_medicines_with_provenance
except ImportError:
    import sys
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from NER_location import get_locations
    from NER_medicine import get_medicines_with_provenance

# ------------------ CONFIG ------------------

load_dotenv()
API_KEY = os.getenv("API_KEY")

DB_PATH = "data/pharmalens.db"
# Switch to a clinical-specific model (PubMedBERT based)
EMBEDDING_MODEL = "NeuML/pubmedbert-base-embeddings"

# ------------------ DB INIT ------------------

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Cleaning: Remove old tables if they exist
    cursor.execute("DROP TABLE IF EXISTS post_clusters")
    cursor.execute("DROP TABLE IF EXISTS entities")
    cursor.execute("DROP TABLE IF EXISTS clusters")
    cursor.execute("DROP TABLE IF EXISTS posts_cleaned")
    
    # 2. posts_cleaned
    # We'll copy structure from posts but add location and medicine columns
    # 'posts' has UUID text IDs, so we must use TEXT here.
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts_cleaned (
        id TEXT PRIMARY KEY,
        text TEXT,
        locations TEXT, 
        medicines TEXT,
        time TEXT, -- Added time column
        cluster_id INTEGER,
        FOREIGN KEY(cluster_id) REFERENCES clusters(cluster_id)
    )
    """)
    
    # 3. clusters
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clusters (
        cluster_id INTEGER PRIMARY KEY,
        label TEXT,
        category TEXT,
        post_ids TEXT
    )
    """)
    
    conn.commit()
    conn.close()

init_db()

# ------------------ MODELS ------------------

embedder = SentenceTransformer(EMBEDDING_MODEL)
genai.configure(api_key=API_KEY)

# ------------------ HELPER FUNCTIONS ------------------

def chunk(text):
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
    parts = re.split(CONNECTORS, text, flags=re.IGNORECASE | re.VERBOSE)
    return [p.strip() for p in parts if p.strip()]

def get_embeddings(texts):
    return embedder.encode(texts, show_progress_bar=True)

def cluster_data(embeddings):
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=5,
        metric="euclidean",
        prediction_data=True
    )
    labels = clusterer.fit_predict(embeddings)
    return labels, clusterer

def get_representative_samples(records, reduced_embeddings, labels, n_samples=5):
    cluster_samples = {}
    for label in set(labels):
        if label == -1: continue
        
        idxs = np.where(labels == label)[0]
        vecs = reduced_embeddings[idxs]
        
        centroid = vecs.mean(axis=0).reshape(1, -1)
        _, distances = pairwise_distances_argmin_min(centroid, vecs)
        
        sorted_idxs = idxs[np.argsort(distances)]
        
        # Get unique texts to avoid redundancy in samples
        samples = []
        seen = set()
        for i in sorted_idxs:
            txt = records[i]["text"]
            if txt not in seen:
                samples.append(txt)
                seen.add(txt)
            if len(samples) >= n_samples:
                break
                
        cluster_samples[label] = samples
        
    return cluster_samples

def label_cluster_with_llm(samples):
    # Prompt with classification
    prompt = f"""
Analyze the following medical text samples from the same semantic cluster:
{chr(10).join(f"- {s}" for s in samples)}

Task:
1. Provide a concise 2–3 word label for this cluster.
2. Classify this cluster into EXACTLY one of the following 7 groups:
   - Effectiveness
   - Side Effect Mention
   - Access Friction
   - Trust in Evidence
   - Competitive Pressure
   - Other medical relevant concerns
   - Medical irrelevant concerns

Format your response strictly as:
Label: <label_text>
Group: <group_text>
"""
    
    # Try OpenRouter first, fallback to Gemini or just use one. The original used OpenRouter.
    # Using the same KEY/Model from original script for continuity.
    OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
    OPENROUTER_MODEL = "arcee-ai/trinity-large-preview:free"
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "PharmaLens"
    }
    
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }
    
    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        r.raise_for_status()
        content = r.json()["choices"][0]["message"]["content"].strip()
        
        # Parse
        label = "Unknown"
        group = "Medical irrelevant concerns"
        
        for line in content.split('\n'):
            if line.lower().startswith("label:"):
                label = line.split(":", 1)[1].strip()
            elif line.lower().startswith("group:"):
                group = line.split(":", 1)[1].strip()
                
        return label, group
        
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Error", "Medical irrelevant concerns"
def label_cluster_wrapper(args):
    cid, samples = args
    print(f"Labeling Cluster {cid}...")
    lbl, cat = label_cluster_with_llm(samples)
    return cid, lbl, cat

# ------------------ MAIN PIPELINE ------------------

print("1. Loading posts from DB...")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, text, time, geo FROM posts LIMIT 10") # Removed Limit for full run, or keep it if testing
rows = cursor.fetchall()

if not rows:
    print("No posts found!")
    exit()

post_data = [{"id": r[0], "text": r[1], "time": r[2], "geo": r[3]} for r in rows]
print(f"Loaded {len(post_data)} posts.")

# ------------------ NER PHASE ------------------

print("2. Running NER (Location & Medicine)...")
all_texts = [p["text"] for p in post_data]

# Locations
# Logic: use 'geo' from posts if not UNK, else use NER
final_locs = []

# We need only runs where geo is UNK for NER to save time? 
# Or just run NER for all and prioritize? 
# To be robust: Run NER for all, but prioritize explicit DB data.
loc_ner_results = get_locations(all_texts) 

for i, p in enumerate(post_data):
    db_loc = p["geo"]
    # Normalize check
    if db_loc and db_loc.upper() != "UNK" and db_loc.strip() != "":
        # Use DB location
        # Format as list to match NER output style
        final_locs.append([db_loc])
    else:
        # Use NER result
        final_locs.append(loc_ner_results[i])

# Medicines
meds = get_medicines_with_provenance(all_texts) 

# Attach to post data
for i, p in enumerate(post_data):
    p["locations"] = json.dumps(final_locs[i])
    p["medicines"] = json.dumps(meds[i])

print("NER Complete.")

# ------------------ CLUSTERING PHASE ------------------

print("3. Chunking texts for clustering...")
chunk_records = []
for p in post_data:
    chunks = chunk(p["text"])
    for i, c in enumerate(chunks):
        chunk_records.append({
            "post_id": p["id"],
            "chunk_id": i,
            "text": c
        })

print(f"Generated {len(chunk_records)} chunks.")

print("4. Embedding chunks...")
texts = [r["text"] for r in chunk_records]
embeddings = get_embeddings(texts)

print("5. Reducing dimensionality...")
reducer = umap.UMAP(
    n_neighbors=min(len(embeddings) - 1, 15),
    n_components=5,
    metric="cosine",
    random_state=42,
    init='random'
)
reduced_embeddings = reducer.fit_transform(embeddings)

print("6. Clustering...")
labels, _ = cluster_data(reduced_embeddings)

# Assign cluster back to chunk records
for i, r in enumerate(chunk_records):
    r["cluster"] = labels[i]

# Aggregate Cluster -> Posts
# We need to decide which cluster a POST belongs to.
# Voting mechanism: The cluster that appears most in the post's chunks.
post_cluster_map = {} # post_id -> cluster_id
cluster_contents = {} # cluster_id -> set of post_ids

# Use a temporary mapping to count votes
post_votes = {} # post_id -> Counter(cluster_ids)

for r in chunk_records:
    pid = r["post_id"]
    cid = r["cluster"]
    if cid == -1: continue # Ignore noise
    
    if pid not in post_votes:
        post_votes[pid] = Counter()
    post_votes[pid][cid] += 1

# Resolve votes
for pid, votes in post_votes.items():
    if not votes:
        final_cid = -1
    else:
        final_cid = votes.most_common(1)[0][0]
    
    post_cluster_map[pid] = final_cid
    
    if final_cid != -1:
        if final_cid not in cluster_contents:
            cluster_contents[final_cid] = []
        cluster_contents[final_cid].append(pid)

# Add cluster_id to post_data
for p in post_data:
    p["cluster_id"] = post_cluster_map.get(p["id"], -1)

# ------------------ LLM LABELING PHASE ------------------

print("7. Labeling Clusters...")
# Get representative samples for each cluster from the CHUNKS (better resolution)
rep_samples = get_representative_samples(chunk_records, reduced_embeddings, labels)

cluster_metadata = {} # cid -> {label, category}

# Prepare arguments for parallel execution
tasks = [(cid, samples) for cid, samples in rep_samples.items()]

# Run in parallel
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(label_cluster_wrapper, tasks))

for cid, lbl, cat in results:
    cluster_metadata[cid] = {"label": lbl, "category": cat}

# ------------------ SAVING PHASE ------------------

print("8. Saving to DB...")

# Save Clusters
cursor.execute("DELETE FROM clusters")
for cid, meta in cluster_metadata.items():
    # post_ids field: user wants "all the posts that match it" in the table
    # We'll join IDs as a comma string
    pids = cluster_contents.get(cid, [])
    pids_str = ",".join(map(str, pids))
    
    cursor.execute("""
        INSERT INTO clusters (cluster_id, label, category, post_ids)
        VALUES (?, ?, ?, ?)
    """, (int(cid), meta["label"], meta["category"], pids_str))

# Save Posts Cleaned
cursor.execute("DELETE FROM posts_cleaned")
batch_posts = []
for p in post_data:
    batch_posts.append((
        p["id"],
        p["text"],
        p["locations"],
        p["medicines"][0]["canonical_name"],
        p["time"],
        p["cluster_id"] if p["cluster_id"] != -1 else None
    ))

cursor.executemany("""
    INSERT INTO posts_cleaned (id, text, locations, medicines, time, cluster_id)
    VALUES (?, ?, ?, ?, ?, ?)
""", batch_posts)

conn.commit()
conn.close()

print("Pipeline Complete! Data saved to 'posts_cleaned' and 'clusters' tables.")