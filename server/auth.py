from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel
from pymongo import MongoClient
import os
import bcrypt
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "your_secret_key")
ALGORITHM = "HS256"

mongo_uri = os.getenv("MONGO_URI")
database_name = os.getenv("DATABASE_NAME")
client = MongoClient(mongo_uri)
db = client[database_name]
patients_collection = db["patients"]

router = APIRouter()


class LoginRequest(BaseModel):
    patient_id: str
    password: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_jwt_token(patient_id: str, expires_delta: timedelta = timedelta(hours=1)):
    exp = datetime.utcnow() + expires_delta
    payload = {"patient_id": patient_id, "exp": exp}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token



@router.post("/login")
async def login(response: Response, login_request: LoginRequest):
    patient = patients_collection.find_one({"patient_id": login_request.patient_id})
    
    if not patient or not verify_password(login_request.password, patient["password"]):
        raise HTTPException(status_code=401, detail="Invalid patient ID or password")

    expires_delta = timedelta(hours=1)
    token = create_jwt_token(login_request.patient_id, expires_delta)
    expires_at = datetime.now(timezone.utc) + expires_delta

    response.set_cookie(
        key="auth_token", 
        value=token, 
        httponly=True, 
        secure=True, 
        expires=expires_at,
        samesite="Strict"
    )

    return {"message": "Login successful", "token": token}