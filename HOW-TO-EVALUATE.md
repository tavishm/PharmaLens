# HOW TO EVALUATE: PharmaLens

**PharmaLens** is a real-time pharmaceutical intelligence platform that aggregates and analyzes patient discussions from Reddit to provide global insights into drug performance, access, and sentiment.


---

## Golden Paths (Best Demos)
To get the best experience, please use the following combinations during your evaluation:

### 1. The "Pain Management" Scenario (Best Data)
*   **Medicine**: `tramadol`
*   **Key Countries to Click**: Germany, Australia, India 
*   **What to look for**:
    *   High "Effectiveness" scores in Germany.
    *   "Access Friction" discussions in India.
    *   Click on **Germany** in the map to see specific patient quotes about effectiveness.

### 2. The "Diabetes/Obesity" Scenario
*   **Medicine**: `metformin`
*   **Key Countries to Click**: United Kingdom, Brazil 
*   **What to look for**:
    *   Strong "Side Effect" mentions in the UK (GI issues).
    *   Compare with `Ozempic` (if data available) or check the "Similar Drug" stats.

### 3. The "ADHD" Scenario
*   **Medicine**: `Adderall`
*   **Key Countries to Click**: USA, China, France 
*   **What to look for**:
    *   High "Access Friction" in the US (shortage discussions).
    *   "Competitive Pressure" insights when verified against generic alternatives.

---

## 📝 Evaluation Checklist

### 1. UX & Visuals
- [ ] **Interactive Globe**: Spin the globe and hover over countries. Note the color-coded metrics (Green = Good, Red = Bad).
- [ ] **Glassmorphism UI**: Observe the modern, dark-themed UI with translucent sidebars.
- [ ] **Dynamic Animations**: Transitions when selecting countries or switching metrics.

### 2. Technical Complexity
- [ ] **NER Pipeline**: We extract **Medicines** (e.g., "Tramadol") and **Locations** (e.g., "Berlin", "UK") from unstructured text.
- [ ] **Semantic Clustering**: Posts are grouped by topic (Effectiveness, Side Effects) using embeddings, not just keywords.
- [ ] **LLM Integration**: The "Drug Summary" and "Discussion Points" are generated on-the-fly using an LLM.

### 3. Business Value
- [ ] **Market Intelligence**: Identifying supply shortages (Access Friction) before official reports.
- [ ] **Patient Voice**: Capturing unfiltered side effect reports that clinical trials might miss.

---

## 🛠️ Quick Start
1.  **Open the Web Interface**: `http://localhost:5173`
2.  **Select a Drug**: Choose **"tramadol"** from the top dropdown.
3.  **Explore the Map**: Click on **Germany**.
4.  **Read Insights**: Look at the "Analytics" sidebar on the right.
5.  **Compare**: See the "Head-to-Head" comparison in the sidebar.


