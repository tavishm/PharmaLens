import sqlite3
import os

class DatabaseManager:
    def __init__(self, db_path="data/pharmalens.db"):
        self.db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), db_path)
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.conn = None
        self.init_db()

    def get_connection(self):
        if self.conn is None:
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
        return self.conn

    def init_db(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Simplified Table: Posts
        # Schema: id, text, geo (country code or unk), time, user_type (HCP or Patient)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                text TEXT,
                geo TEXT,
                time TEXT,
                user_type TEXT
            )
        ''')
        
        conn.commit()
        print(f"Database initialized at {self.db_path}")

    def insert_post(self, record):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO posts (id, text, geo, time, user_type)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                record['id'], 
                record['text'], 
                record['geo'], 
                record['time'], 
                record['user_type']
            ))
            conn.commit()
        except Exception as e:
            print(f"DB Insert Error: {e}")

    def close(self):
        if self.conn:
            self.conn.close()

if __name__ == "__main__":
    # If main, recreate DB to ensure schema match (for dev only)
    # WARNING: This deletes the old DB if run directly!
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data/pharmalens.db")
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Removed old database.")
    
    db = DatabaseManager()
    db.init_db()
