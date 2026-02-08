import sqlite3
import json

DB_PATH = '../data/pharmalens_reddit.db'

def get_all_countries():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT locations FROM posts_cleaned")
    rows = cursor.fetchall()
    conn.close()
    
    countries = set()
    for row in rows:
        val = row[0]
        if not val: continue
        
        # Parse if JSON
        try:
            # It might be '["US"]' or 'US'
            if val.startswith('['):
                codes = json.loads(val)
                for c in codes:
                    countries.add(c)
            else:
                countries.add(val)
        except:
            countries.add(val)
            
    print("Found countries:", sorted(list(countries)))

if __name__ == "__main__":
    get_all_countries()
