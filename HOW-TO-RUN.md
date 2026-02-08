# How to Run PharmaLens

This guide provides simple instructions to set up and run the PharmaLens application (Backend + Frontend).

## Prerequisites
- [Python 3.x](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/) (with npm)

## Python Requirements
praw
python-dotenv
pandas
tqdm
requests
beautifulsoup4
lxml
faker
numpy
playwright
sentence-transformers
scikit-learn
datasets
spacy
scispacy
    Model required: https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz
fastapi
uvicorn
duckduckgo_search

## 1. Backend Setup

The backend is built with FastAPI and handles data processing and API endpoints.

### Step 1: Navigate to the project root
```bash
cd /path/to/medithon
```

### Step 2: Set up Virtual Environment (Recommended)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```
*Note: If you encounter issues with `ddgs`, ensure you have `duckduckgo_search` installed.*

### Step 4: Configure Environment Variables
Ensure you have a `.env` file in `scripts/.env` or root with valid API keys:
```env
OPENROUTER_API_KEY=your_key_here
```

### Step 5: Run the Backend Server
```bash
cd scripts
python api_endpoints.py
```
The server will start at `http://127.0.0.1:8000`.

---

## 2. Frontend Setup

The frontend is a React application using Vite.

### Step 1: Navigate to the frontend directory
Open a new terminal window and run:
```bash
cd ui_copy
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 3. Usage
- Open `http://localhost:5173` in your browser.
- Select a medicine and country to view analytics.
- The map and charts will populate with data from the backend.

