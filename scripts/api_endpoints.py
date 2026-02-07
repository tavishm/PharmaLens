from fastapi import FastAPI
from pydantic import BaseModel
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
COUNTRIES = ["USA", "Canada", "UK", "Germany", "France", "Japan", "China", "India", "Brazil", "Australia", "Nigeria", "South Africa", "Egypt", "Madagascar", "Benin", "Algeria", "Chile", "Thailand", "Poland"]

@app.get("/stats")
def get_stats():
    return {
        "countries": COUNTRIES,
        "Population_Growth": [random.random() for _ in COUNTRIES],
        "Internet_Penetration": [random.random() for _ in COUNTRIES],
        "GDP_Growth": [random.random() for _ in COUNTRIES],
        "Literacy_Rate": [random.random() for _ in COUNTRIES],
        "Urbanization_Rate": [random.random() for _ in COUNTRIES],
        "Employment_Rate": [random.random() for _ in COUNTRIES]
    }

# 7. Medicine Stats Endpoint
@app.get("/medicine_stats/{medicine_name}")
def medicine_stats(medicine_name: str):
    return {
        "medicine": medicine_name,
        "countries": COUNTRIES,
        "perception": [random.random() for _ in COUNTRIES],
        "sideEffect": [random.random() for _ in COUNTRIES],
        "access": [random.random() for _ in COUNTRIES],
        "trust": [random.random() for _ in COUNTRIES],
        "competition": [random.random() for _ in COUNTRIES]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
