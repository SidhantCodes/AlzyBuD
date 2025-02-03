import random
import sounddevice as sd
from scipy.io.wavfile import write
import wavio as wv
from transformers import pipeline
import re
from metaphone import doublemetaphone
from Levenshtein import distance as levenshtein_distance
import time

from vocablist import vocab_list
# Initialize Whisper pipeline
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-small.en")

def record_user_audio(duration=30, freq=44100):
    print("Recording started...")
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

selected_indices=[]
def generate_word_list(vocablist):

    selected_words = []

    while len(selected_words) < 10:
        rand_index = random.randint(0, len(vocablist) - 1)
        if rand_index not in selected_indices:
            selected_indices.append(rand_index)
            selected_words.append(vocab_list[rand_index])

    return selected_words

def compare_words(target_word, spoken_word, threshold=0.66):
    # Convert to lowercase
    target_word = target_word.lower()
    spoken_word = spoken_word.lower()

    # Direct comparison
    if target_word == spoken_word:
        return True

    # Phonetic comparison using Metaphone
    target_phonetic = doublemetaphone(target_word)[0]
    spoken_phonetic = doublemetaphone(spoken_word)[0]
    
    if target_phonetic == spoken_phonetic:
        return True

    # Strict edit distance comparison on phonetic codes
    max_distance = max(len(target_phonetic), len(spoken_phonetic))
    similarity = 1 - (levenshtein_distance(target_phonetic, spoken_phonetic) / max_distance)
    
    if similarity >= threshold:
        return True

    # Strict regular expression for pronunciation variations
    vowels = 'aeiou'
    consonants = 'bcdfghjklmnpqrstvwxyz'
    
    pattern = '^'
    for c in target_word:
        if c in vowels:
            pattern += f'[{vowels}]'
        elif c in consonants:
            pattern += c
        else:
            pattern += c
    pattern += '$'

    if re.match(pattern, spoken_word) and len(target_word) == len(spoken_word):
        return True

    return False

def process_recognized(target_list, recognized_text):
    count_not_recalled = len(target_list)
    recognized_words = recognized_text.lower().split()
    target_words = [word.lower() for word in target_list]

    # Track which target words have been matched
    matched_words = set()

    for recognized_word in recognized_words:
        for target_word in target_words:
            if compare_words(target_word, recognized_word) and target_word not in matched_words:
                print(f"Matched: {recognized_word} -> {target_word}")
                matched_words.add(target_word)  # Mark the target word as matched
                count_not_recalled -= 1
                break  # Move to the next recognized word after a match

    print(f"\nNumber of words not recalled: {count_not_recalled}")
    return count_not_recalled 

def main():
    word_list = generate_word_list(vocab_list)
    result=[]
    if not word_list:
        print("Failed to generate word list. Exiting.")
        return
    for i in range(3):
        print(word_list) ##to be displayed on the screen
        time.sleep(5)
        audio_file = record_user_audio()
        recognized_text = recognize_speech_from_file(audio_file)
    
        if recognized_text:
            result.append(process_recognized(word_list, recognized_text))
            print(result) #the final score for this round
        else:
            print("No text was recognized. Please try again.")
            break
        time.sleep(10)

    return result

if __name__ == "__main__":
    main()

