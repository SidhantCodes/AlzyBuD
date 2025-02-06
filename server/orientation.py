from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import datetime
from dateutil import parser
import spacy
import re
from typing import List
from fastapi import APIRouter
import difflib
from dotenv import load_dotenv
import os
from pymongo import MongoClient
import jwt



load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SECRET_KEY = "your_secret_key" 
ALGORITHM = "HS256"
router = APIRouter()
# MongoDB setup
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
test_data_collection = db["test_data"]
router = APIRouter()


class OrientationResponse(BaseModel):
    score: int
    feedback: dict
    total_questions: int

class OrientationRequest(BaseModel):
    responses: List[str]

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Define patient name
patient_name = "Samuel Jackson".split(" ")

# Define the correct place for the orientation test
correct_place = "india"

# Define the questions and their validation functions
questions = [
    ("Please state your full name.", lambda spoken_name: all(word.lower() in spoken_name.lower().split() for word in patient_name), "Speak your first and last name clearly."),
    ("What day of the week is it?", lambda x: x.lower() == datetime.datetime.now().strftime("%A").lower(), "Say the full name of the day."),
    ("What is today's date?", lambda x: check_date(x), "State today's date."),
    ("What month is it?", lambda x: any(month in x.lower() for month in [datetime.datetime.now().strftime("%B").lower(), datetime.datetime.now().strftime("%b").lower()]), "State the current month."),
    ("What year is it?", lambda x: str(datetime.datetime.now().year) in ''.join(filter(str.isdigit, x)), "State the current year."),
    ("What season is it?", lambda x: check_season(x), "State the current season(summer, spring ,autumn, winter)."),
    ("What time is it now?", lambda x: check_time(x), "State the time, e.g., 'half past two'."),
    ("Where are we now?", lambda x: check_place(x, correct_place), "State the country.")
]
# Function to decode JWT and extract patient_id
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
# Validation functions (unchanged)
def check_date(answer, correct_date=None, tolerance_days=1):
    if correct_date is None:
        correct_date = datetime.date.today()
    try:
        parsed_date = parser.parse(answer, fuzzy=True).date()
        return abs((parsed_date - correct_date).days) <= tolerance_days
    except (ValueError, OverflowError):
        return False

def check_time(answer, correct_time=None, tolerance_minutes=60):
    if correct_time is None:
        correct_time = datetime.datetime.now().time()
    try:
        parsed_time = parser.parse(answer, fuzzy=True).time()
        now = datetime.datetime.combine(datetime.date.today(), correct_time)
        parsed = datetime.datetime.combine(datetime.date.today(), parsed_time)
        time_difference = abs((parsed - now).total_seconds()) / 60
        return time_difference <= tolerance_minutes
    except (ValueError, OverflowError):
        return False

def check_season(answer):
    today = datetime.date.today()
    month = today.month
    day = today.day
    seasons = {
        "spring": (3, 20, 6, 20),
        "summer": (6, 21, 9, 22),
        "fall": (9, 23, 12, 20),
        "autumn": (9, 23, 12, 20),
        "winter": (12, 21, 3, 19)
    }
    current_season = None
    for season, (start_month, start_day, end_month, end_day) in seasons.items():
        start_date = datetime.date(today.year, start_month, start_day) - datetime.timedelta(weeks=1)
        end_date = datetime.date(today.year, end_month, end_day) + datetime.timedelta(weeks=2)
        if start_date <= today <= end_date:
            current_season = season
            break
    if current_season in ["fall", "autumn"] and answer.lower() in ["fall", "autumn"]:
        return True
    return answer.lower() == current_season

def check_place(answer, correct_place):
    answer_words = answer.lower().split()
    correct_place_words = correct_place.lower().split()
    matches = 0
    for word in answer_words:
        best_match = difflib.get_close_matches(word, correct_place_words, n=1, cutoff=0.6)
        if best_match:
            matches += 1
    similarity_ratio = matches / max(len(correct_place_words), len(answer_words))
    return similarity_ratio >= 0.6


# API endpoint to run the orientation test
@router.post("/orientation-test", response_model=OrientationResponse)
async def run_orientation_test_api(request: Request, req_data: OrientationRequest):
    patient_id = get_patient_id(request)  # Get patient ID from JWT
    responses = req_data.responses

    if len(responses) != len(questions):
        raise HTTPException(status_code=400, detail=f"Expected {len(questions)} responses, but got {len(responses)}")

    score = 0
    feedback = {}
    for i, (response, (question, validator, instruction)) in enumerate(zip(responses, questions), 1):
        is_correct = validator(response)
        if not is_correct:
            score += 1
        feedback[f"Question {i}"] = "Correct" if is_correct else "Incorrect"

    # Store results in MongoDB
    test_record = {
        "test_name": "orientation",
        "patient_id": patient_id,
        "feedback": feedback,
        "score": score,
        "timestamp": datetime.datetime.utcnow()
    }
    test_data_collection.insert_one(test_record)

    return {
        "score": score,
        "feedback": feedback,
        "total_questions": len(questions)
    }
__all__ = ["router"]