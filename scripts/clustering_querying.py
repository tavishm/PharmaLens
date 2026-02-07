import hdbscan
import umap
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics import pairwise_distances_argmin_min
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")

# 1. Setup Data & Embeddings
def get_embeddings(texts):
    # 'all-MiniLM-L6-v2' is fast; use 'dmis-lab/biobert-v1.1' for specialized medical text
    # WILL BE OVERWRITTEN.
    model = SentenceTransformer('all-MiniLM-L6-v2')
    return model.encode(texts)

# 2. HDBSCAN Clustering
def cluster_data(embeddings):
    # min_cluster_size: smaller numbers find niche topics; larger numbers find broad trends
    clusterer = hdbscan.HDBSCAN(min_cluster_size=5, metric='euclidean', prediction_data=True)
    cluster_labels = clusterer.fit_predict(embeddings)
    return cluster_labels, clusterer

# 3. RAG-style Representative Selection
def get_representative_samples(embeddings, labels, texts, n_samples=5):
    cluster_samples = {}
    unique_labels = set(labels)
    
    for label in unique_labels:
        if label == -1: continue # Skip noise
        
        # Get indices of items in this cluster
        indices = np.where(labels == label)[0]
        cluster_vecs = embeddings[indices]
        
        # Calculate centroid (center of the cluster)
        centroid = np.mean(cluster_vecs, axis=0).reshape(1, -1)
        
        # Find points closest to centroid (the "Representative" items)
        closest_indices, _ = pairwise_distances_argmin_min(centroid, cluster_vecs)
        # For variety, we can take the 5 closest points
        # (Simplified: taking first 5 for the script, but logic can be top-N distance)
        sample_texts = [texts[idx] for idx in indices[:n_samples]]
        cluster_samples[label] = sample_texts
        
    return cluster_samples

# 4. LLM Labeling
def label_clusters(cluster_samples):
    results = {}
    for label, samples in cluster_samples.items():
        prompt = f"""
        Analyze these 5 medical text samples from a single cluster:
        {chr(10).join([f"- {s}" for s in samples])}
        
        Task: 
        1. Provide a concise 2-3 word 'Cluster Label' (e.g., 'Gastrointestinal Side Effects').
        2. Provide a 'Confidence Score' from 0-100 on how homogenous these samples are.
        
        Format output as: Label | Score
        """
        
        # Assuming OpenAI/Standard LLM call
        genai.configure(api_key=API_KEY)

        model = genai.GenerativeModel("gemini-flash-latest")

        results = model.generate_content(prompt)
        
    return results

# --- Main Pipeline ---
data = ["I have a headache after DrugX", "DrugX made my head hurt", "Migraine from DrugX", ...]
embeddings = get_embeddings(data)

reducer = umap.UMAP(
    init='random',
    n_neighbors=min(len(data) - 1, 15), 
    n_components=5,      # Reduce to 5 dimensions for clustering
    metric='cosine', 
    random_state=42
)
reduced_embeddings = reducer.fit_transform(embeddings)
labels, clusterer = cluster_data(reduced_embeddings)
samples = get_representative_samples(reduced_embeddings, labels, data)
labels_with_scores = label_clusters(samples)