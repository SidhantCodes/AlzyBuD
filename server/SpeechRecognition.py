import wavio as wv
import sounddevice as sd

def record_user_audio(filename, duration=10, freq=44100):
    print("Recording started...")
    recording = sd.rec(int(duration * freq), samplerate=freq, channels=2)
    sd.wait()
    print("Recording finished.")
    
    audio_filename = f"./audio/{filename}.wav"
    wv.write(audio_filename, recording, freq, sampwidth=2)
    
    return audio_filename