from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime
import speech_recognition as sr
import difflib
from dateutil import parser
import spacy
import re

import datetime
import sounddevice as sd
from scipy.io.wavfile import write
import wavio as wv
from dateutil import parser
from transformers import pipeline
import time


app = FastAPI()

class OrientationResponse(BaseModel):
    score: int
    feedback: dict
    total_questions: int
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-small.en")
patient_name="Samuel Jackson".split(" ")
nlp = spacy.load('en_core_web_sm')


def get_speech_input(prompt,duration=15, freq=44100):
    print(prompt)
    print("Recording started...")
    # recording = sd.rec(int(duration * freq), samplerate=freq, channels=1)
    recording = sd.rec(int(duration * freq), samplerate=freq, channels=2)
    sd.wait()
    print("Recording finished.")
    
    audio_filename1 = "patient_recording0.wav"
    audio_filename2 = "patient_recording1.wav"
    write(audio_filename1, freq, recording)
    wv.write(audio_filename2, recording, freq, sampwidth=2)
    
    return audio_filename2

def recognize_speech_from_file(audio_file):
    print(f"Recognizing speech from {audio_file} using Whisper model...")
    
    try:
        result = pipe(audio_file)
        recognized_text = result['text']
        print(f"Recognized text: {recognized_text}")
        return recognized_text
    except Exception as e:
        print(f"Error during speech recognition: {e}")
        return ""
    
def extract_time(transcribed_text):
    """
    Extracts and parses time from transcribed text using spaCy and dateutil.
    
    Parameters:
        transcribed_text (str): The transcribed text from the audio recording.
    
    Returns:
        datetime.time: Parsed time if found, None otherwise.
    """
    doc = nlp(transcribed_text)
    for ent in doc.ents:
        if ent.label_ == "TIME":
            try:
                # Parse the time entity
                parsed_time = parser.parse(ent.text).time()
                return parsed_time
            except (ValueError, OverflowError):
                # If parsing fails, return None
                return None
    return None

# def check_date(answer):
#     today = datetime.date.today()
#     try:
#         answer_date = datetime.datetime.strptime(answer, "%Y-%m-%d").date()
#         # Check if the date is within +1 day
#         return abs((answer_date - today).days) <= 1
#     except ValueError:
#         return False
    
def check_date(answer, correct_date=None, tolerance_days=1):
    """
    Fuzzy matches the spoken date input with the correct date.
    
    Parameters:
        answer (str): The spoken input to be parsed into a date.
        correct_date (datetime.date, optional): The correct reference date. Defaults to today's date.
        tolerance_days (int, optional): The number of days within which a match is acceptable.
                                        Defaults to 1 (i.e., ±1 day).
    
    Returns:
        bool: True if the date is within the tolerance, False otherwise.
    """
    if correct_date is None:
        correct_date = datetime.date.today()

    try:
        # Parse the spoken date string, allowing fuzzy matching for natural language inputs
        parsed_date = parser.parse(answer, fuzzy=True).date()
        # Check if the parsed date is within the allowed tolerance
        return abs((parsed_date - correct_date).days) <= tolerance_days
    except (ValueError, OverflowError):
        # Return False if the input couldn't be parsed as a date
        return False

# def check_time(answer):
#     now = datetime.datetime.now()
#     try:
#         answer_time = datetime.datetime.strptime(answer, "%H:%M").time()
#         # Check if time is within +1 hour
#         diff = abs(datetime.timedelta(hours=now.hour, minutes=now.minute) - 
#                    datetime.timedelta(hours=answer_time.hour, minutes=answer_time.minute))
#         return diff <= datetime.timedelta(hours=1)
#     except ValueError:
#         return False
    
def check_time(answer, correct_time=None, tolerance_minutes=60):
    """
    Fuzzy matches the spoken time input with the correct time.
    
    Parameters:
        answer (str): The spoken input to be parsed into a time.
        correct_time (datetime.time, optional): The correct reference time. Defaults to current time.
        tolerance_minutes (int, optional): The number of minutes within which a match is acceptable.
                                           Defaults to 60 (i.e., ±1 hour).
    
    Returns:
        bool: True if the time is within the tolerance, False otherwise.
    """
    if correct_time is None:
        correct_time = datetime.datetime.now().time()

    try:
        # Parse the spoken time string, allowing fuzzy matching for natural language inputs
        parsed_time = parser.parse(answer, fuzzy=True).time()

        # Convert both times to datetime for easier comparison
        now = datetime.datetime.combine(datetime.date.today(), correct_time)
        parsed = datetime.datetime.combine(datetime.date.today(), parsed_time)

        # Check if the parsed time is within the allowed tolerance in minutes
        time_difference = abs((parsed - now).total_seconds()) / 60
        return time_difference <= tolerance_minutes
    except (ValueError, OverflowError):
        # Return False if the input couldn't be parsed as a time
        return False

def normalize_time_input(transcribed_answer):
    """
    Normalizes time input such as '12 23 p.m.' to '12:23 PM'.
    
    Parameters:
        transcribed_answer (str): The transcribed text containing time information.
    
    Returns:
        str: Normalized time string in the format 'HH:MM AM/PM'.
    """
    # Regular expression to match time formats like '12 23 p.m.', '12:23 pm', or '1223 pm'
    time_pattern = re.compile(r'(\d{1,2})\s*(\d{2})\s*(a\.m\.|p\.m\.|am|pm)', re.IGNORECASE)
    match = time_pattern.search(transcribed_answer)
    
    if match:
        # Extract and format the matched time components (HH:MM AM/PM)
        hours = match.group(1)
        minutes = match.group(2)
        period = match.group(3).replace(".", "").upper()  # Normalize 'am/pm' and remove periods

        # Reformat to 'HH:MM AM/PM'
        normalized_time = f"{hours}:{minutes} {period}"
        return normalized_time
    
    return None
    
def process_time(transcribed_answer):
    #extracting the time related phrases from transcripted text using nlp
    time_ans=normalize_time_input(extract_time(transcribed_answer))
    if time_ans is not None:
        print(f"Extracted time: {time_ans}")
        try:
            parsed_time = datetime.strptime(time_ans, '%I:%M %p')
            res=check_time(time_ans) #checking the extracted time phrase
            if res:
                return True
            else:
                return False
        except ValueError:
            return "Could not parse the extracted time."
    else:
        return "No time-related information found in the answer."


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
        # Extend the range to 1 week before and 2 weeks after
        start_date = datetime.date(today.year, start_month, start_day) - datetime.timedelta(weeks=1)
        end_date = datetime.date(today.year, end_month, end_day) + datetime.timedelta(weeks=2)
        if start_date <= today <= end_date:
            current_season = season
            break

    if current_season in ["fall", "autumn"] and answer.lower() in ["fall", "autumn"]:
        return True
    
    return answer.lower() == current_season


def check_place(answer, correct_place):
    # Split the strings into words
    answer_words = answer.lower().split()
    correct_place_words = correct_place.lower().split()

    # Compare word-by-word for partial matches
    matches = 0
    for word in answer_words:
        # Find the best match for each word in the correct place string
        best_match = difflib.get_close_matches(word, correct_place_words, n=1, cutoff=0.6)
        if best_match:
            matches += 1
    
    # Calculate similarity based on word matches
    similarity_ratio = matches / max(len(correct_place_words), len(answer_words))

    # Return true if the similarity ratio is 60% or more
    return similarity_ratio >= 0.6

def run_orientation_test():
    """
    returns the final score"""
    correct_place = "india"  # Example place name

    questions = [
        ("Please state your full name.", lambda spoken_name: all(word.lower() in spoken_name.lower().split() for word in patient_name), "Speak your first and last name clearly."),
        ("What day of the week is it?", lambda x: x.lower() == datetime.datetime.now().strftime("%A").lower(), "Say the full name of the day."),
        ("What is today's date?", check_date, "State today's date."),
        ("What month is it?", lambda x: any(month in x.lower() for month in [datetime.datetime.now().strftime("%B").lower(), datetime.datetime.now().strftime("%b").lower()]), "State the current month."),
        ("What year is it?", lambda x: str(datetime.datetime.now().year) in ''.join(filter(str.isdigit, x)), "State the current year."),
        ("What season is it?", check_season, "State the current season(summer, spring ,autumn, winter)."),
        ("What time is it now?", check_time, "State the time, e.g., 'half past two'."),
        ("Where are we now?", lambda x: check_place(x, correct_place), "State the country.")
    ]

    print("\nWelcome to the Cog Orientation Task.")
    print("I will ask you a series of questions about time and place.")
    print("Please answer each question to the best of your ability.")
    print("Let's begin!\n")

    score = 0
    for question, validator, instruction in questions:
        while True:
            audiofile = get_speech_input(f"{question}\n{instruction}")
            answer=recognize_speech_from_file(audiofile)
            if answer.lower() == 'repeat':
                continue
            if not validator(answer):
                score += 1
                print("Incorrect.")
            else:
                print("Correct.")
            break

    print(f"\nTest completed. Score: {score} (lower is better, maximum incorrect = 8)")
    return score

@app.post("/orientation-test", response_model=OrientationResponse)
async def run_orientation_test_api():
    correct_place = "india"  # Example place name


    questions = [
        ("Please state your full name.", lambda spoken_name: all(word.lower() in spoken_name.lower().split() for word in patient_name), "Speak your first and last name clearly."),
        ("What day of the week is it?", lambda x: x.lower() == datetime.datetime.now().strftime("%A").lower(), "Say the full name of the day."),
        ("What is today's date?", check_date, "State today's date."),
        ("What month is it?", lambda x: any(month in x.lower() for month in [datetime.datetime.now().strftime("%B").lower(), datetime.datetime.now().strftime("%b").lower()]), "State the current month."),
        ("What year is it?", lambda x: str(datetime.datetime.now().year) in ''.join(filter(str.isdigit, x)), "State the current year."),
        ("What season is it?", check_season, "State the current season(summer, spring ,autumn, winter)."),
        ("What time is it now?", check_time, "State the time, e.g., 'half past two'."),
        ("Where are we now?", lambda x: check_place(x, correct_place), "State the country.")
    ]

    score = 0
    feedback = {}
    for i, (question, validator, instruction) in enumerate(questions, 1):
        audiofile = get_speech_input(f"{question}\n{instruction}")
        answer = recognize_speech_from_file(audiofile)
        if answer.lower() == 'repeat':
            raise HTTPException(status_code=400, detail="User requested to repeat the question")
        is_correct = validator(answer)
        if not is_correct:
            score += 1
        print("Correct" if is_correct else "Incorrect")
        feedback[f"Question {i}"] = "Correct" if is_correct else "Incorrect"

    return OrientationResponse(
        score=score,
        feedback=feedback,
        total_questions=len(questions)
    )

# Keep all the existing functions (get_speech_input, recognize_speech_from_file, etc.)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)