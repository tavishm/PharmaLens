import json
import os
import argparse
from database import DatabaseManager
from tqdm import tqdm

def load_data(input_dir):
    db = DatabaseManager()
    
    files = [f for f in os.listdir(input_dir) if f.endswith('.jsonl')]
    if not files:
        print(f"No JSONL files found in {input_dir}")
        return

    total_inserted = 0
    #print(f"Loading data from {len(files)} files into database...")
    
    for filename in files:
        filepath = os.path.join(input_dir, filename)
        print(f"Processing {filename}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in tqdm(f):
                try:
                    record = json.loads(line)
                    #print(record.get("geo"), record.get("time"))
                    # Ensure schema matches
                    db_record = {
                        "id": record.get("id"),
                        "text": record.get("text"),
                        "geo": record.get("geo", "UNK"),
                        "time": record.get("time"),
                        "user_type": record.get("user_type", "Patient") # Default to Patient
                    }
                    
                    if db_record["id"] and db_record["text"]:
                        db.insert_post(db_record)
                        total_inserted += 1
                        
                except json.JSONDecodeError:
                    continue
                except Exception as e:
                    print(f"Error processing record: {e}")
                    continue

    print(f"Successfully loaded {total_inserted} records into the database.")
    db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_dir", default="data/raw/dummy", help="Directory containing JSONL files")
    args = parser.parse_args()
    
    # Resolve absolute path for input_dir if it's relative
    input_path = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), args.input_dir))
    
    load_data(input_path)
