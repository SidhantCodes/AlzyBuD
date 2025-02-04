"use client"
import { useState, useRef, useEffect } from 'react';
import TaskHeading from '../components/TaskHeading/TaskHeading';

const WordDisplayRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const chunksRef = useRef([]);

  const words = [
    "Happiness",
    "Adventure",
    "Discovery",
    "Learning",
    "Growth",
    "Challenge",
    "Success",
    "Journey",
    "Achievement",
    "Progress"
  ];

  // Handle word changes
  useEffect(() => {
    if (currentWordIndex < words.length) {
      const wordTimer = setTimeout(() => {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
        setCountdown(10);
      }, 10000);

      return () => clearTimeout(wordTimer);
    } else if (currentWordIndex === words.length) {
      setShowRecorder(true);
    }
  }, [currentWordIndex, words.length]);

  // Handle countdown
  useEffect(() => {
    if (currentWordIndex < words.length && !showRecorder) {
      const countdownTimer = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [currentWordIndex, words.length, showRecorder]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        chunksRef.current = [];
      };
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const saveToComputer = () => {
    if (audioBlob) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'recording.wav';
      a.click();
      URL.revokeObjectURL(audioUrl);
      alert('Audio saved to your computer!');
    } else {
      alert('No audio to save.');
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    chunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center mt-12 font-sans">
      {!showRecorder ? (
        <div className="text-center">
          {/* <h1 className="text-4xl mb-8">Word Display</h1> */}
          <TaskHeading heading="Word Recall" />
          {currentWordIndex < words.length ? (
            <>
              <div className="text-5xl font-semibold mb-4 border-2 border-black p-4 rounded-lg w-[400px] h-[100px] flex justify-center items-centre">{words[currentWordIndex]}</div>
              <div className="text-lg text-gray-600">
                Word {currentWordIndex + 1} of {words.length}
              </div>
              <div className="mt-4 text-lg text-gray-600">
                Next word in {countdown} seconds...
              </div>
            </>
          ) : (
            <div className="text-2xl">Preparing recorder...</div>
          )}
        </div>
      ) : (
        <>
          {/* <h1 className="text-3xl mb-6">Audio Recorder</h1> */}
          <TaskHeading heading="Word Recall Test" />
          <div className="space-x-4 mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 text-lg text-white rounded-lg transition-colors ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRecording ? (
                <>
                  <span className="mr-2">●</span> Stop Recording
                </>
              ) : (
                'Start Recording'
              )}
            </button>
            <button
              onClick={saveToComputer}
              disabled={!audioBlob}
              className={`px-6 py-3 text-lg text-white rounded-lg transition-colors ${
                audioBlob ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
              }`}
            >
              Save to Computer
            </button>
            <button
              onClick={clearRecording}
              disabled={!audioBlob}
              className={`px-6 py-3 text-lg text-white rounded-lg transition-colors ${
                audioBlob ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400'
              }`}
            >
              Clear Recording
            </button>
          </div>
          {audioUrl && (
            <div className="mt-6">
              <h2 className="text-2xl mb-4">Playback</h2>
              <audio controls src={audioUrl} className="mb-6" />
            </div>
          )}
          {isRecording && (
            <p className="text-red-500 mt-4">
              Recording in progress...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WordDisplayRecorder;