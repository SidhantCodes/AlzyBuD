from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import random
import string
import bcrypt
import smtplib
from email.mime.text import MIMEText
from auth import router as auth_router
from recall_api import router as recall_router 
from orientation import router as orientation_router

load_dotenv()

app = FastAPI()
# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],  # Specific frontend origins
    allow_credentials=True,  # Allow credentials (cookies, authentication headers)
    allow_methods=["GET", "POST", "OPTIONS"],  # Specify needed methods
    allow_headers=["Content-Type", "Authorization"],  # Allow specific headers
)


app.include_router(auth_router)
app.include_router(recall_router)
app.include_router(orientation_router)

mongo_uri = os.getenv("MONGO_URI")
database_name = os.getenv("DATABASE_NAME")
client = MongoClient(mongo_uri)
db = client[database_name]
patients_collection = db["patients"]

# SMTP settings for Brevo
BREVO_SMTP_SERVER = "smtp-relay.brevo.com"
BREVO_SMTP_PORT = 587
SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL")
SMTP_PASSWORD = os.getenv("BREVO_SMTP_PASSWORD")


class PatientDetails(BaseModel):
    patient_name: str
    patient_age: int
    patient_gender: str
    suspected_condition: str
    patient_email: EmailStr


def generate_patient_id():
    return ''.join(random.choices(string.digits, k=10))


def generate_password():
    all_chars = string.ascii_letters + string.digits + string.punctuation  # Letters, digits, and special chars
    return ''.join(random.choices(all_chars, k=10))


def hash_password(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Function to send email using Brevo SMTP
# def send_email(to_email: str, patient_id: str, password: str):
#     subject = "Your Patient ID and Password"
#     body = f"Your Patient ID: {patient_id}\nYour Password: {password}"

#     msg = MIMEText(body)
#     msg['Subject'] = subject
#     msg['From'] = SENDER_EMAIL
#     msg['To'] = to_email

#     try:
#         with smtplib.SMTP(BREVO_SMTP_SERVER, BREVO_SMTP_PORT) as server:
#             server.starttls()
#             server.login(SENDER_EMAIL, SMTP_PASSWORD)
#             server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
#         print(f"Email successfully sent to {to_email}")  # Print statement on successful send
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
@app.options("/login")
async def preflight():
    return {}
@app.post("/add_patient")
async def add_patient(patient: PatientDetails):
    patient_id = generate_patient_id()
    password = generate_password()
    hashed_password = hash_password(password)

    patient_data = patient.dict()
    patient_data["patient_id"] = patient_id
    patient_data["password"] = hashed_password  # Store hashed password

    patients_collection.insert_one(patient_data)
    # send_email(patient.patient_email, patient_id, password)

    return {
        "message": "Patient details added successfully",
        "patient_id": patient_id,
        "password": password  # Return plain password in response
    }

@app.get("/auth-token")
async def get_auth_token(request: Request):
    auth_token = request.cookies.get("auth_token")
    return {"auth_token": auth_token}

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI app on http://0.0.0.0:8000") 
    uvicorn.run(app, host="localhost", port=8000)