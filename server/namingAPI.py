from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from pymongo import MongoClient
import jwt
from typing import List
from naming import evaluate_response  # Import your logic function

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
MONGO_URI = "mongodb+srv://miitcodes27:27082003@cluster0.lmm3j.mongodb.net/patients?retryWrites=true&w=majority&appName=Cluster0"

db_client = MongoClient(MONGO_URI)
db = db_client["patient_db"]
collection = db["test_data"]

router = APIRouter()

def get_patient_id(request: Request):
    token = request.cookies.get("auth_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing auth_token cookie")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("patient_id")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class NamingTaskRequest(BaseModel):
    correct_answer: str
    user_response: str

patient_scores = {}

@router.post("/naming-task")
def naming_task(request_data: NamingTaskRequest, request: Request, patient_id: str = Depends(get_patient_id)):
    if patient_id not in patient_scores:
        patient_scores[patient_id] = {"test_name": "naming_task", "correct_answers": [], "score": 0}
    
    result = evaluate_response(request_data.user_response, request_data.correct_answer)
    score = list(result.values())[0][1]
    patient_scores[patient_id]["correct_answers"].append(request_data.correct_answer)
    patient_scores[patient_id]["score"] += score
    
    if len(patient_scores[patient_id]["correct_answers"]) == 5:
        collection.insert_one({"patient_id": patient_id, **patient_scores[patient_id]})
        response_data = patient_scores.pop(patient_id)
        return {"message": "Test completed", "data": response_data}
    
    return {"message": "Response recorded", "current_score": patient_scores[patient_id]["score"]}
__all__ = ["router"]
