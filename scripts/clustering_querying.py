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

# ------------------ CONFIG ------------------

load_dotenv()
API_KEY = os.getenv("API_KEY")

DB_PATH = "data/pharmalens.db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# ------------------ MODELS ------------------

embedder = SentenceTransformer(EMBEDDING_MODEL)
genai.configure(api_key=API_KEY)

# ------------------ TEXT CHUNKING ------------------

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

# ------------------ EMBEDDINGS ------------------

def get_embeddings(texts):
    return embedder.encode(texts, show_progress_bar=True)

# ------------------ CLUSTERING ------------------

def cluster_data(embeddings):
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=5,
        metric="euclidean",
        prediction_data=True
    )
    labels = clusterer.fit_predict(embeddings)
    return labels, clusterer

# ------------------ REPRESENTATIVES ------------------

def get_representative_samples(records, reduced_embeddings, labels, n_samples=5):
    cluster_samples = {}

    for label in set(labels):
        if label == -1:
            continue

        idxs = np.where(labels == label)[0]
        vecs = reduced_embeddings[idxs]

        centroid = vecs.mean(axis=0).reshape(1, -1)
        _, distances = pairwise_distances_argmin_min(centroid, vecs)

        sorted_idxs = idxs[np.argsort(distances)]

        cluster_samples[label] = [
            records[i]["text"]
            for i in sorted_idxs[:n_samples]
        ]

    return cluster_samples

# ------------------ LLM LABELING ------------------
def label_clusters(cluster_samples, provider="openrouter"):
    results = {}

    if provider == "openrouter":
        import requests

        OPENROUTER_API_KEY = "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"
        OPENROUTER_MODEL = "arcee-ai/trinity-large-preview:free"

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",   # required by OpenRouter
            "X-Title": "PharmaLens"
        }

        for label, samples in cluster_samples.items():
            prompt = f"""
Analyze the following medical text samples from the same semantic cluster:
{chr(10).join(f"- {s}" for s in samples)}

Task:
1. Produce a concise 2–3 word cluster label.
2. Provide a homogeneity confidence score (0–100).

Format:
Label | Score
"""

            payload = {
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.2
            }

            r = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60
            )
            r.raise_for_status()

            results[label] = r.json()["choices"][0]["message"]["content"].strip()

    elif provider == "gemini":
        import google.generativeai as genai

        model = genai.GenerativeModel("gemini-3-flash-preview")

        for label, samples in cluster_samples.items():
            prompt = f"""
Analyze the following medical text samples from the same semantic cluster:
{chr(10).join(f"- {s}" for s in samples)}

Task:
1. Produce a concise 2–3 word cluster label.
2. Provide a homogeneity confidence score (0–100).

Format:
Label | Score
"""
            response = model.generate_content(prompt)
            results[label] = response.text.strip()

    else:
        raise ValueError("provider must be 'openrouter' or 'gemini'")

    return results

# ------------------ MAIN PIPELINE ------------------

# 1. Load posts
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT id, text FROM posts LIMIT 250")
rows = cursor.fetchall()
conn.close()
print("Loaded posts!")

# 2. Chunk + preserve provenance
chunk_records = []

for post_id, text in rows:
    for chunk_idx, chunk_text in enumerate(chunk(text)):
        chunk_records.append({
            "post_id": post_id,
            "chunk_id": chunk_idx,
            "text": chunk_text
        })
print("Loaded chunks!")

# 3. Embed (single batch)
texts = [r["text"] for r in chunk_records]
embeddings = get_embeddings(texts)

for r, emb in zip(chunk_records, embeddings):
    r["embedding"] = emb
print("Loaded embeddings!")

# 4. Dimensionality reduction
reducer = umap.UMAP(
    n_neighbors=min(len(embeddings) - 1, 15),
    n_components=5,
    metric="cosine",
    random_state=42
)
reduced_embeddings = reducer.fit_transform(embeddings)
print("Reduced Dimensionality!")

# 5. Cluster
labels, clusterer = cluster_data(reduced_embeddings)

for r, label in zip(chunk_records, labels):
    r["cluster"] = label
print("Clustered!")

# 6. Representative samples
cluster_samples = get_representative_samples(
    chunk_records,
    reduced_embeddings,
    labels,
    n_samples=5
)
print("RAG-style Samples taken!")

# 7. LLM cluster labeling
cluster_labels = label_clusters(cluster_samples)
print("LLM Cluster Labeling Complete!")

# ------------------ ANALYSIS HELPERS ------------------

def cluster_post_distribution(cluster_id):
    return Counter(
        r["post_id"]
        for r in chunk_records
        if r["cluster"] == cluster_id
    )

# ------------------ OUTPUT ------------------

print("\nCLUSTER LABELS\n--------------")
for k, v in cluster_labels.items(): print(f"Cluster {k}: {v}")

print("\nPOST CONTRIBUTIONS\n------------------")
for k in cluster_labels: print(f"Cluster {k}: {cluster_post_distribution(k)}")

# ------------------ VISUALIZATION ------------------

import matplotlib.pyplot as plt
import textwrap

# 1. 2D UMAP for plotting ONLY
viz_reducer = umap.UMAP(
    n_neighbors=min(len(embeddings) - 1, 15),
    n_components=2,
    metric="cosine",
    random_state=42
)
viz_embeddings = viz_reducer.fit_transform(embeddings)

# 2. Prepare plotting data
clusters = {}
for r, coord in zip(chunk_records, viz_embeddings):
    label = r["cluster"]
    if label == -1:
        continue
    clusters.setdefault(label, []).append((coord, r))

# 3. Plot
plt.figure(figsize=(14, 10))

for label, items in clusters.items():
    points = np.array([c for c, _ in items])
    plt.scatter(points[:, 0], points[:, 1], label=f"Cluster {label}", alpha=0.7)

# 4. Annotate cluster centroids with LLM label
for label, items in clusters.items():
    points = np.array([c for c, _ in items])
    centroid = points.mean(axis=0)
    label_text = cluster_labels.get(label, "Unlabeled")
    plt.text(
        centroid[0],
        centroid[1],
        label_text,
        fontsize=10,
        weight="bold",
        ha="center",
        va="center",
        bbox=dict(facecolor="white", alpha=0.8, edgecolor="black")
    )

plt.title("UMAP Visualization of Text Clusters")
plt.legend()
plt.show()

# ------------------ RAW TEXT DUMP PER CLUSTER ------------------

print("\n\nCLUSTER CONTENTS (RAW TEXT)")
print("=" * 60)

for label, items in clusters.items():
    print(f"\nCLUSTER {label}: {cluster_labels.get(label, 'Unlabeled')}")
    print("-" * 60)

    for _, r in items:
        wrapped = textwrap.fill(r["text"], width=100)
        print(f"[Post {r['post_id']} | Chunk {r['chunk_id']}]")
        print(wrapped)
        print()