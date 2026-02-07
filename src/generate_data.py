import json
import os
import random
import uuid
from datetime import datetime, timedelta
from faker import Faker
import argparse
from tqdm import tqdm

# Setup
fake = Faker()
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data/raw/dummy")
os.makedirs(DATA_DIR, exist_ok=True)

# Configuration
DRUGS = ["Ozempic", "Wegovy", "Mounjaro", "Zepbound", "Rybelsus", "Saxenda", "Trulicity"]
COUNTRIES = ["US", "UK", "IN", "CA", "AU", "DE", "FR"]

class TextGenerator:
    def __init__(self):
        self.openers = [
            "I've been on {drug} for about {duration} now.",
            "Just started {drug} {duration} ago.",
            "My doctor prescribed {drug} recently.",
            "Wanted to share my experience with {drug}.",
            "Anyone else on {drug}? I have some questions.",
            "Here is my update after {duration} on {drug}."
        ]
        
        self.durations = ["2 weeks", "3 months", "a year", "5 days", "6 months"]
        
        self.positive_results = [
            "I've lost {weight} lbs so far!",
            "My A1C dropped to {a1c}.",
            "I feel so much better, more energy.",
            "The food noise is completely gone.",
            "Clothes are fitting way better.",
            "Finally broke my stall."
        ]
        
        self.negative_results = [
            "Haven't lost a single pound yet.",
            "Scale isn't moving.",
            "I feel hungry all the time still.",
            "Not seeing the results I expected.",
            "Gained 2 lbs actually.",
            "My A1C hasn't budged."
        ]
        
        self.side_effects_severe = [
            "The nausea is absolutely terrible.",
            "I've been vomiting every morning.",
            "Severe constipation, nothing helps.",
            "Headaches are splitting.",
            "Feel so dizzy and weak.",
            "Can't keep any food down."
        ]
        
        self.side_effects_mild = [
            "Little bit of nausea but it passes.",
            "Some fatigue in the afternoons.",
            "Mild headache on injection day.",
            "Burps are sulfur-y but manageable.",
            "Stomach hurts if I eat too much."
        ]
        
        self.insurance_issues = [
            "Insurance denied the PA.",
            "Copay is $500, too expensive.",
            "Pharmacy is out of stock everywhere.",
            "Waiting on prior authorization.",
            "Coupon card isn't working.",
            "Coverage got dropped this month."
        ]
        
        self.closers = [
            "Hoping it improves.",
            "Stick with it everyone!",
            "Any advice?",
            "Is this normal?",
            "Thanks for reading.",
            "Let me know your thoughts."
        ]

    def generate(self, drug, dimension):
        # Build a paragraph based on dimension
        parts = []
        
        # Opener
        opener = random.choice(self.openers).format(drug=drug, duration=random.choice(self.durations))
        parts.append(opener)
        
        # Body
        if dimension == "effectiveness":
            if random.random() > 0.5:
                parts.append(random.choice(self.positive_results).format(weight=random.randint(5, 50), a1c=round(random.uniform(5.0, 6.5), 1)))
                parts.append(random.choice(self.positive_results).format(weight=random.randint(5, 50), a1c=round(random.uniform(5.0, 6.5), 1)))
            else:
                 parts.append(random.choice(self.negative_results))
                 parts.append("Frustrated.")
                 
        elif dimension == "side_effects":
            if random.random() > 0.5:
                parts.append(random.choice(self.side_effects_severe))
                parts.append("Thinking of stopping.")
            else:
                parts.append(random.choice(self.side_effects_mild))
                parts.append("Hopefully it gets better.")

        elif dimension == "access":
             parts.append(random.choice(self.insurance_issues))
             parts.append("Called 10 pharmacies today.")
             
        elif dimension == "competition":
            parts.append(f"Thinking of switching to {random.choice([d for d in DRUGS if d != drug])}.")
            parts.append("heard it might work better.")

        # Add random general filler (context relevant)
        if random.random() > 0.5:
            parts.append("Drinking lots of water.")
        
        # Closer
        parts.append(random.choice(self.closers))
        
        return " ".join(parts)

generator = TextGenerator()

def generate_record():
    country = random.choices(COUNTRIES, weights=[40, 15, 10, 10, 5, 5, 5])[0]
    drug = random.choice(DRUGS)
    dimension = random.choice(["effectiveness", "side_effects", "access", "competition"])
    
    full_text = generator.generate(drug, dimension)

    user_type = random.choices(["Patient", "PHC"], weights=[0.9, 0.1])[0]

    return {
        "id": str(uuid.uuid4()),
        "text": full_text,
        "geo": country,
        "time": datetime.now().isoformat(),
        "user_type": user_type,
        "extraction_metadata": {
            "source_type": "synthetic",
            "dimension": dimension
        }
    }

def generate_dummy_data(count):
    # Use fixed filename for verification, or append timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = os.path.join(DATA_DIR, f"dummy_data_{timestamp}.jsonl")
    print(f"Generating {count} realistic records to {filename}...")
    
    with open(filename, "w", encoding="utf-8") as f:
        for _ in tqdm(range(count)):
            record = generate_record()
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    
    print(f"Done! Saved to {filename}")
    return filename

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=1000, help="Number of records to generate")
    parser.add_argument("--output_dir", default="data/raw/dummy", help="Output directory")
    args = parser.parse_args()
    
    # Update global DATA_DIR based on args
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), args.output_dir)
    os.makedirs(DATA_DIR, exist_ok=True)
    
    generate_dummy_data(args.count)
