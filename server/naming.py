import random
import sounddevice as sd
from scipy.io.wavfile import write
import wavio as wv
from transformers import pipeline
import re
from metaphone import doublemetaphone
from Levenshtein import distance as levenshtein_distance
import time
import spacy

# Load pre-trained NLP model for semantic similarity
nlp = spacy.load("en_core_web_sm")

# Initialize Whisper pipeline
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-small.en")

# Naming Task Items and Semantic Cues
naming_items = {
    "Flower": "grows in a garden",
    "Bed": "used for sleeping in",
    "Whistle": "makes a sound when you blow on it",
    "Pencil": "used for writing",
    "Rattle": "a baby’s toy",
    "Mask": "hides your face",
    "Scissors": "cuts paper",
    "Comb": "used on hair",
    "Wallet": "holds your money",
    "Harmonica": "a musical instrument",
    "Stethoscope": "doctor uses it to listen to your heart",
    "Tongs": "picks up food"
}

# Acceptable alternative names for fingers
finger_names = {
    "Thumb": ["Thumb"],
    "Index": ["Index", "Forefinger", "Pointer"],
    "Middle": ["Middle"],
    "Ring": ["Ring"],
    "Pinky": ["Pinky", "Little"]
}

# Record User Audio
def record_user_audio(duration=5, freq=44100):
    print("Recording started...")
    recording = sd.rec(int(duration * freq), samplerate=freq, channels=2)
    sd.wait()
    print("Recording finished.")

    audio_filename = "patient_response.wav"
    write(audio_filename, freq, recording)
    wv.write(audio_filename, recording, freq, sampwidth=2)

    return audio_filename

# Speech Recognition with Whisper
def recognize_speech_from_file(audio_file):
    print(f"Recognizing speech from {audio_file} using Whisper model...")
    try:
        result = pipe(audio_file)
        recognized_text = result['text'].strip()
        print(f"Recognized text: {recognized_text}")
        return recognized_text
    except Exception as e:
        print(f"Error during speech recognition: {e}")
        return ""

# Compare Words Using Phonetic and Semantic Similarity
def compare_words(target_word, spoken_word, threshold=0.66):
    target_word, spoken_word = target_word.lower(), spoken_word.lower()
    
    if target_word == spoken_word:
        return True
    
    # Phonetic comparison
    if doublemetaphone(target_word)[0] == doublemetaphone(spoken_word)[0]:
        return True
    
    # Levenshtein distance for spelling mistakes
    max_distance = max(len(target_word), len(spoken_word))
    similarity = 1 - (levenshtein_distance(target_word, spoken_word) / max_distance)
    if similarity >= threshold:
        return True
    
    # Semantic similarity using word embeddings
    doc1, doc2 = nlp(target_word), nlp(spoken_word)
    if doc1.similarity(doc2) >= threshold:
        return True
    
    return False

def evaluate_response(user_response: str, correct_answer: str):
    res=dict()
    if compare_words(correct_answer, user_response):
        res[correct_answer]=[user_response,1]
        return res  # Full score on first attempt, partial on second
    res[correct_answer]=[user_response,0]
    return  res # No points if incorrect on both attempts

# Naming Task Execution
def run_naming_task(answer, correct):
    # Select 12 random objects
    selected_objects = random.sample(list(naming_items.keys()), 12)
    score = 0

    for obj in selected_objects:
        print(f"Image: {obj}")  # Display Image (Simulation)
        time.sleep(2)  # Simulate time for patient to observe

        for attempt in range(1, 3):
            print("What is this called?")
            audio_file = record_user_audio()
            user_response = recognize_speech_from_file(audio_file)

            if not user_response:
                print("No response detected.")
                continue

            result = evaluate_response(obj, user_response, attempt)
            if result == 1:
                print("Correct!")
                score += 2
                break
            elif result == 0:
                print("Try again with the given cue.")
                score+=1
            else:
                print("Incorrect.")

    print(f"Final Score: {score}/12")

# Finger Naming Task Execution
def run_finger_naming_task():
    print("Which hand do you write with?")
    dominant_hand = input("Enter 'Left' or 'Right': ").strip().lower()

    if dominant_hand not in ["left", "right"]:
        print("Invalid input. Assuming right hand.")
        dominant_hand = "right"

    score = 0
    for finger, alternatives in finger_names.items():
        print(f"What is this? (Pointing to {finger} finger)")

        for attempt in range(1, 3):
            audio_file = record_user_audio()
            user_response = recognize_speech_from_file(audio_file)

            if not user_response:
                print("No response detected.")
                continue

            if any(compare_words(name, user_response) for name in alternatives):
                print("Correct!")
                score += 1
                break
            else:
                if attempt == 1:
                    print("Try again. Can you think of another name for it?")
                else:
                    print("Incorrect.")

    print(f"Finger Naming Score: {score}/5")

# Main Execution
def main():
    print("\n--- ADAS Naming Task ---")
    user=input("Enter response: ")
    
    print(evaluate_response(user, "Flower"));


if __name__ == "__main__":
    main()
