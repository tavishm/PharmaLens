import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
    REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
    REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "PharmaLens/0.1")

    # Target Subreddits Configuration
    # Type 1: Regional (Source-Based)
    REGIONAL_SUBREDDITS = {
        "US": ["AskDocs", "medical", "healthinsurance", "medicare"],
        "UK": ["doctorsUK", "NHS", "AskUK", "MentalHealthUK"],
        "IN": ["india", "Indian_Academia", "Bangalore", "Mumbai"],
        "CA": ["canadianhealth", "ontario", "vancouver"],
        "AU": ["ausjdocs", "australia", "melbourne"]
    }

    # Type 2: General (Keyword-Based)
    GENERAL_SUBREDDITS = ["AskDrugs", "Drugs", "Health", "Medicine", "Science", "pharmacy", "nursing", "medicalschool", "residency"]

    # Ingestion Settings
    DEEP_SCRAPE_LIMIT = 1000  # Max items per listing type (Reddit API cap is ~1000)
    SEARCH_PERIODS = ['all', 'year', 'month'] # For 'top' sorting
    BATCH_SIZE = 100  # Write to file every N posts

    COUNTRY_KEYWORDS = {
        "US": ["USA", "America", "United States", "New York", "California", "Texas"],
        "UK": ["UK", "United Kingdom", "Britain", "NHS", "London", "England"],
        "IN": ["India", "Delhi", "Mumbai", "Bangalore", "Indian"],
        "CA": ["Canada", "Toronto", "Vancouver", "Ontario"],
        "AU": ["Australia", "Sydney", "Melbourne", "Brisbane"],
        "DE": ["Germany", "Berlin", "Munich", "German"],
        "FR": ["France", "Paris", "French"]
    }
