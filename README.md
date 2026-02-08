# PharmaLens
## Bridging the Gap Between Clinical Intention and Real-World Perception

PharmaLens is a global intelligence dashboard designed to monitor the public and professional discourse surrounding medicines and medical services. By aggregating data from patients, physicians, and healthcare institutions, PharmaLens provides a high-fidelity view of the global "voice of the market."

---

## Core Features

### 1. Global Sentiment Heatmap

Visualize real-world perception through an interactive world map. Users can toggle between critical health metrics to see how a specific medicine performs geographically.

- **Effectiveness Perception**: How well users believe the treatment works.
- **Side Effect Frequency**: Identifying hotspots for adverse event mentions.
- **Access Friction**: Tracking where patients struggle to obtain the medicine.
- **Affordability Index**: Regional variations in price-point sentiment.
- **Competitive Pressure**: Monitoring the presence and impact of alternative treatments.

---

### 2. Competitive Intelligence & Benchmarking

Understand your market position by comparing perceived advantages and disadvantages against similar medicines.

- **Regional Benchmarking**: Compare Lisinopril vs. Enalapril across global markets.
- **Feature Gap Analysis**: Identify where competitors outperform on perceived safety, affordability, or ease of access.

---

### 3. Deep-Dive Analytics

Go beyond aggregates and inspect the raw narrative signals behind the data.

- **Testimonial Inspection**: Read authentic, anonymized excerpts from patients and doctors.
- **Thematic Clustering**: AI-surfaced dominant themes (e.g., "High cost in rural areas", "Fast-acting relief").
- **Representative Excerpts**: Automatically surfaced quotes that define a region’s specific perception.

---

## Technical Architecture: The Data Pipeline

PharmaLens uses a hybrid AI approach to turn unstructured chatter into structured clinical insights.

| Phase         | Technology       | Output                                                   |
|--------------|------------------|----------------------------------------------------------|
| Extraction   | scispaCy (NER)   | Identifies medical entities, drugs, and symptoms          |
| Normalization| RxNorm / ATC     | Maps mentions to official drug classes and generic names  |
| Clustering   | UMAP + HDBSCAN   | Groups thousands of posts into "Thematic Clusters"        |
| Labeling     | LLM (GPT-4)      | Generates human-readable labels and confidence scores     |

---

## The Purpose

PharmaLens does not claim clinical accuracy or medical validity. Instead, it serves as a strategic mirror, reflecting:

- **Cultural Nuance**: How people in different regions talk about the same drug
- **Experience Gap**: The difference between what a clinical trial promises and what a patient experiences
- **Market Opportunity**: Identifying regions where "Access Friction" is high but "Effectiveness Perception" is strong
