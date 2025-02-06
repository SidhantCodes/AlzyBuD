# from fastapi import APIRouter
# from pymongo import MongoClient
# from dotenv import load_dotenv
# import os
# from collections import defaultdict

# # Load environment variables
# load_dotenv()
# MONGO_URI = os.getenv("MONGO_URI")
# DATABASE_NAME = os.getenv("DATABASE_NAME")

# # Initialize Router
# result_router = APIRouter()

# # Connect to MongoDB
# client = MongoClient(MONGO_URI)
# db = client[DATABASE_NAME]
# collection = db["test_data"]

# @result_router.get("/patients/tests")
# def get_patient_tests():
#     """Fetch data from MongoDB and group by patient_id."""
#     data = collection.find({}, {"_id": 0, "patient_id": 1, "test_name": 1, "score": 1})
#     grouped_data = defaultdict(list)
    
#     for record in data:
#         grouped_data[record["patient_id"]].append({
#             "test_name": record["test_name"],
#             "score": record.get("score", "N/A")  # Handle missing scores
#         })
    
#     return {"patients": grouped_data}
from fastapi import APIRouter
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from collections import defaultdict

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Initialize Router
result_router = APIRouter()

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db["test_data"]

@result_router.get("/patients/tests")
def get_patient_tests():
    """Fetch data from MongoDB and group by patient_id with total score."""
    data = collection.find({}, {"_id": 0, "patient_id": 1, "test_name": 1, "score": 1})
    grouped_data = defaultdict(lambda: {"tests": [], "total_score": 0})
    
    for record in data:
        score = record.get("score", 0)
        grouped_data[record["patient_id"]]["tests"].append({
            "test_name": record["test_name"],
            "score": score
        })
        grouped_data[record["patient_id"]]["total_score"] += score if isinstance(score, (int, float)) else 0
    
    return {"patients": grouped_data}
