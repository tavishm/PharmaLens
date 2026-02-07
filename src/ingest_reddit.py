import praw
import json
import os
import time
from datetime import datetime
from config import Config
from tqdm import tqdm

class RedditIngester:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=Config.REDDIT_CLIENT_ID,
            client_secret=Config.REDDIT_CLIENT_SECRET,
            user_agent=Config.REDDIT_USER_AGENT
        )
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data/raw/reddit")
        os.makedirs(self.data_dir, exist_ok=True)
        # Use a single large file approach (rotating daily/by session) or per-batch
        self.output_file = os.path.join(self.data_dir, f"reddit_dump_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jsonl")
        self.buffer = []
        self.collected_ids = set()

    def _flush_buffer(self):
        if not self.buffer:
            return
        with open(self.output_file, "a", encoding="utf-8") as f:
            for item in self.buffer:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
        print(f"Flushed {len(self.buffer)} posts to {self.output_file}")
        self.buffer = []

    def save_post(self, post, source_type, inferred_country=None, method="unknown"):
        """Buffers a post for saving."""
        if post.id in self.collected_ids:
            return # Deduplicate
        
        self.collected_ids.add(post.id)
        
        data = {
            "id": post.id,
            "title": post.title,
            "text": post.selftext,
            "url": post.url,
            "subreddit": post.subreddit.display_name,
            "author": str(post.author),
            "created_utc": post.created_utc,
            "score": post.score,
            "num_comments": post.num_comments,
            "permalink": post.permalink,
            "extraction_metadata": {
                "source_type": source_type,
                "inferred_country": inferred_country,
                "method": method,
                "timestamp": datetime.now().isoformat()
            }
        }
        self.buffer.append(data)
        
        if len(self.buffer) >= Config.BATCH_SIZE:
            self._flush_buffer()

    def ingest_regional_deep(self):
        print("--- Starting Deep Regional Ingestion (Type 1) ---")
        limit = Config.DEEP_SCRAPE_LIMIT
        
        for region, subreddits in Config.REGIONAL_SUBREDDITS.items():
            for sub_name in subreddits:
                try:
                    subreddit = self.reddit.subreddit(sub_name)
                    print(f"Deep scraping r/{sub_name} for {region}...")
                    
                    # 1. Newest
                    for post in tqdm(subreddit.new(limit=limit), desc=f"r/{sub_name} (new)"):
                        self.save_post(post, "regional", region, "new")
                        
                    # 2. Hot
                    for post in tqdm(subreddit.hot(limit=limit), desc=f"r/{sub_name} (hot)"):
                        self.save_post(post, "regional", region, "hot")

                    # 3. Top (All, Year, Month)
                    for period in Config.SEARCH_PERIODS:
                        for post in tqdm(subreddit.top(time_filter=period, limit=limit), desc=f"r/{sub_name} (top-{period})"):
                            self.save_post(post, "regional", region, f"top-{period}")
                            
                except Exception as e:
                    print(f"Error accessing r/{sub_name}: {e}")
        self._flush_buffer()

    def ingest_keyword_deep(self):
        print("--- Starting Deep Keyword Search (Type 2) ---")
        limit = Config.DEEP_SCRAPE_LIMIT
        
        for sub_name in Config.GENERAL_SUBREDDITS:
            try:
                subreddit = self.reddit.subreddit(sub_name)
                for country, keywords in Config.COUNTRY_KEYWORDS.items():
                    query = " OR ".join([f'"{k}"' for k in keywords])
                    print(f"Searching r/{sub_name} for {country} keywords: {query}")
                    
                    # Search with multiple sorts to maximize yield
                    for sort_method in ['relevance', 'new', 'top']:
                         for post in tqdm(subreddit.search(query, sort=sort_method, limit=limit), desc=f"Search {country} in r/{sub_name} ({sort_method})"):
                            self.save_post(post, "keyword_search", country, f"search-{sort_method}")

            except Exception as e:
                print(f"Error searching r/{sub_name}: {e}")
        self._flush_buffer()

if __name__ == "__main__":
    if not Config.REDDIT_CLIENT_ID or not Config.REDDIT_CLIENT_SECRET:
        print("Error: Reddit API credentials not found. Please set them in src/config.py or .env")
    else:
        ingester = RedditIngester()
        ingester.ingest_regional_deep()
        ingester.ingest_keyword_deep()
