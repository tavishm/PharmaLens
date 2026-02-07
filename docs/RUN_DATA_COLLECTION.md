# How to Run PharmaLens Data Collection

## 1. Prerequisites (Python & Dependencies)
Ensure Python is installed.
```powershell
py -m pip install -r requirements.txt
py -m playwright install  # Required for the new web scraper
```

## 2. Generate Synthetic Data (Easiest)
Create dummy data for testing the pipeline without needing API keys.
```powershell
py src/generate_dummy.py
```
This will create `data/raw/dummy/dummy_data_YYYYMMDD_HHMMSS.jsonl`.

## 3. Scrape Drug Reviews (Robust)
Scrape real patient reviews from Drugs.com using a headless browser.
```powershell
py src/ingest_reviews.py
```
This will open a browser in the background and save data to `data/raw/reviews/`.

## 4. Run Reddit Ingestion (API Key Required)
1. Rename `.env.example` to `.env`.
2. Add your `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`.
3. Run the script:
```powershell
py src/ingest_reddit.py
```
This will deep-scrape subreddits and save to `data/raw/reddit/`.

## 5. Process All Data & Load Database
Normalize text and load everything into the SQLite database (`data/pharmalens.db`).
```powershell
py src/process_pipeline.py
```
