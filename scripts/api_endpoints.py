from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()



def get_medicine_class(medicine_name):
    pass


# 1. Root Endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Medithon API"}

# 2. Health Check Endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "medithon-api"}

# 3. Item Retrieval Endpoint
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

# 4. User Creation Endpoint
class User(BaseModel):
    username: str
    email: str

@app.post("/users/")
def create_user(user: User):
    return {"username": user.username, "email": user.email, "status": "created"}

# 5. Simple Addition Endpoint
@app.get("/add/{a}/{b}")
def add_numbers(a: int, b: int):
    return {"operation": "add", "a": a, "b": b, "result": a + b}

# 6. Random Stats Endpoint
@app.get("/stats")
def get_stats():
    countries = ["USA", "Canada", "UK", "Germany", "France", "Japan", "China", "India", "Brazil", "Australia"]
    stats = {
        "countries": countries,
        "Population_Growth": [random.random() for _ in countries],
        "Internet_Penetration": [random.random() for _ in countries],
        "GDP_Growth": [random.random() for _ in countries],
        "Literacy_Rate": [random.random() for _ in countries],
        "Urbanization_Rate": [random.random() for _ in countries],
        "Employment_Rate": [random.random() for _ in countries]
    }
    return stats

# 7. Medicine Stats Endpoint
@app.get("/medicine_stats/{medicine_name}")
def medicine_stats(medicine_name: str):
    return {
        "medicine": medicine_name,
        "efficacy": random.random(),
        "side_effects_rate": random.random(),
        "market_availability": random.random(),
        "average_cost": random.randint(10, 1000)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
