from fastapi import FastAPI, UploadFile, Form, Request, HTTPException, Depends
from typing import List
from fastapi import APIRouter
from wordRecall import generate_word_list, recognize_speech_from_file, process_recognized, vocab_list
import shutil
import uvicorn
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
SECRET_KEY = "your_secret_key"  # Replace with your actual secret key
ALGORITHM = "HS256"
router = APIRouter()
# MongoDB setup
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
test_data_collection = db["test_data"]

app = FastAPI()
session_words = []

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

# Endpoint to generate word list
@router.get("/word-recall/generate-words")
def generate_words():
    global session_words
    session_words = generate_word_list(vocab_list)
    return {"word_list": session_words}

# Endpoint to process the recalled words and store in MongoDB
@router.post("/word-recall")
def word_recall(
    request: Request,
    audio_file: UploadFile = Form(...)
):
    patient_id = get_patient_id(request)

    if not session_words:
        return {"error": "No words generated. Please call /word-recall/generate-words first."}

    # Save uploaded file
    with open(f"temp_audio.wav", "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)

    # Recognize speech from the file
    recognized_text = recognize_speech_from_file("temp_audio.wav")
    
    # Process the recognized text
    output_from_model = process_recognized(session_words, recognized_text)

    # Identify recalled and unrecalled words
    recognized_words = recognized_text.lower().split()
    recalled_words = output_from_model["recalled_words"]
    unrecalled_words = output_from_model["unrecalled_words"]
    score= output_from_model["num_not_recalled"]

    # Store data in MongoDB
    test_record = {
        "test_name": "word_recall",
        "patient_id": patient_id,
        "recalled_words": recalled_words,
        "unrecalled_words": unrecalled_words,
        "score": score,  # Score as the number of recalled words
        "timestamp": datetime.utcnow()
    }
    test_data_collection.insert_one(test_record)

    return {"message": "Test results stored successfully."}