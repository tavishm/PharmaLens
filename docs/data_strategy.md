# PharmaLens Data Strategy & Implementation Plan

## 1. Data Source Categorization

We categorize data sources into 4 types based on the inherent availability of Metadata. This determines the preprocessing pipeline required for each.

| Type | Description | Examples | Handling Strategy |
| :--- | :--- | :--- | :--- |
| **Type 1: Geotagged + Timetagged** | Source explicitly provides both location and time. | Region-specific Subreddits (e.g., `r/JuniorDoctorsUK`), Local News Comments, Tweets with geo-coordinates (rare). | **High Confidence**. Direct mapping to (Region, Time) bucket. |
| **Type 2: Only Timetagged** | Source provides time, but location is unknown. | General Subreddits (`r/AskDocs`, `r/Drugs`), Drug Review Sites (Drugs.com, WebMD), Twitter/X (mostly). | **Inference Required**. Use "Country Inference Classifier" based on language, lexemes, and user history. |
| **Type 3: Only Geotagged** | Source provides location, but time is unknown or static. | Static local directories, Clinic listings with testimonials (undated). | **Aggregated Baseline**. Use for background priors, but exclude from longitudinal trend analysis. |
| **Type 4: Neither** | No metadata. | Random forum dumps, text files without headers. | **Discard / Training Only**. Use only for training language models; do not use for dashboard metrics. |

## 2. Extraction Strategy

### A. Reddit (PRAW / API)
We will use a prioritized list of subreddits with a two-pronged approach:
1.  **Source-Based**: Scrape all posts from region-specific subreddits (Type 1).
2.  **Keyword-Based (Preferential Search)**: In general subreddits (Type 2 like `r/AskDocs`), we will explicitly search for country names and demonyms (e.g., "India", "USA", "UK", "French", "Canadian") to force-surface geo-locatable content.

- **Ingestion**: Batch scripts using `PRAW`.
- **Frequency**: Daily incremental fetch; Historical backfill once.
- **Storage**: Raw JSON objects.

### B. Review Sites (Scrapers)
Targets: Drugs.com, WebMD, Tata 1mg, Pharmeasy.
- **Ingestion**: `BeautifulSoup` / `Playwright`.
- **Frequency**: Monthly (reviews change slowly).
- **Compliance**: Respect `robots.txt` and rate limits.

### C. Clinical/Scientific (APIs)
Targets: PubMed (Biopython), ClinicalTrials.gov.
- **Ingestion**: Official APIs.
- **Focus**: Abstracts and conclusions mentioning specific drug molecules.

## 3. Comprehensive Subreddit List (for Auto-Geotagging)
Assigning a source-based "Default Location" allows us to treat these as Type 1 (Geotagged).

#### North America
*   **USA**: `r/AskDocs`, `r/medical`, `r/residency`, `r/nursing`, `r/pharmacy`, `r/healthinsurance` (implies US mostly), `r/medicare`
*   **Canada**: `r/canadianhealth`, `r/ontario` (health threads), `r/vancouver` (health threads), `r/CanadianTeachers` (stress/meds threads - sparse), `r/CanadaPolitics` (healthcare policy)

#### Europe
*   **UK**: `r/BEjunipordoctors` (now `r/doctorsUK`), `r/NHS`, `r/AskUK`, `r/BritishSuccess` (health mentions), `r/MentalHealthUK`
*   **Germany**: `r/de` (Health flair), `r/germany` (medical questions)
*   **France**: `r/france` (Santé flair)
*   **Europe General**: `r/AskEurope` (healthcare threads)

#### Asia Pacific
*   **India**: `r/india` (medical threads), `r/Indian_Academia` (med students), `r/Bangalore` (hospital reviews), `r/Mumbai`, `r/Delhi`
*   **Australia**: `r/ausjdocs`, `r/australia` (health threads), `r/melbourne`, `r/sydney`
*   **New Zealand**: `r/newzealand` (health flair)

#### Global / General (Type 2 - Requires Inference)
*   `r/AskDrugs`, `r/Drugs`, `r/decaf`, `r/nootropics`, `r/Health`, `r/Medicine`, `r/Science`

## 4. Raw Data Schema (JSON)

All raw data will be normalized into this flat JSON structure before processing.

```json
{
  "id": "unique_source_id_123",
  "text": "The raw text content of the post or review...",
  "timestamp_utc": "2023-10-27T10:00:00Z",
  "source_platform": "reddit",
  "source_container": "r/AskDocs", " // subreddit or website section
  "url": "https://...",
  "metadata": {
    "author_id": "user123 (hashed if needed)",
    "upvotes": 10,
    "reply_count": 2,
    "is_original_post": true
  },
  "geo_inference": {
    "is_explicit_source": true,        " // true if source_container implies location (Type 1)
    "source_region": "US"              " // e.g., 'US', 'UK', 'IN' or null
  },
  "user_type_label": "patient"         " // 'patient', 'doctor', 'unknown' (can be inferred later)
}
```
