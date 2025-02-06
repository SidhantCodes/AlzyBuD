"use client"
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TaskHeading from '../../components/TaskHeading/TaskHeading';

const WordDisplayRecorder = () => {
  const [patientId, setPatientId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);
  const chunksRef = useRef([]);
  const [authToken, setAuthToken] = useState('');
  const router = useRouter();
  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    setPatientId(urlParts[1]);

    const fetchAuthToken = async () => {
      const response = await fetch(`http://localhost:8000/auth-token`, {
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("Auth Token:", data.auth_token);
      setAuthToken(data.auth_token);
    };

    fetchAuthToken();
  }, []);
  // Fetch words from the API
  const fetchWords = async () => {
    try {
      console.log('Fetching words...');
      const response = await fetch(`http://localhost:8000/word-recall/generate-words`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', errorText);
        throw new Error(`Failed to fetch words: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let wordList;
      try {
        wordList = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed word list:', wordList);

      if (!Array.isArray(wordList["word_list"])) {
        throw new Error('Server did not return an array of words');
      }

      setWords(wordList["word_list"]);
      setError(null);
    } catch (error) {
      console.error('Error in fetchWords:', error);
      setError(error.message);
    }
  };

  // Initial fetch of words
  useEffect(() => {
    fetchWords();
  }, []);

  // Handle word changes
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const wordTimer = setTimeout(() => {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
        setCountdown(10);
      }, 10000);

      return () => clearTimeout(wordTimer);
    } else if (words.length > 0 && currentWordIndex === words.length) {
      setShowRecorder(true);
    }
  }, [currentWordIndex, words.length]);

  // Handle countdown
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length && !showRecorder) {
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
  const saveToComputer = async () => {
    if (!audioBlob) {
      alert('No audio to send.');
      return;
    }
  
    try {
      // Fetch the auth token from the /auth-token API endpoint
      const response = await fetch(`http://localhost:8000/auth-token`, {
        credentials: 'include', // Ensure cookies (like auth_token) are sent
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching auth token:', errorText);
        alert('Failed to fetch auth token.');
        return;
      }
  
      const data = await response.json();
      const authToken = data.auth_token;
  
      if (!authToken) {
        alert('No auth_token found. Please log in.');
        return;
      }
  
      // Log the auth token for debugging
      console.log('Auth Token:', authToken);
  
      // Create a FormData object
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.wav');
  
      // Make the POST request with the audio file and auth token in headers
      const postResponse = await fetch(`http://localhost:8000/word-recall`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`, // Explicitly pass the token in headers
        },
        body: formData,
        credentials: 'include', // This ensures cookies (like auth_token) are sent
      });
  
      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        console.error('Error uploading audio:', errorText);
        alert('Error uploading audio.');
      } else {
        alert('Audio uploaded successfully!');
        router.push(`/${patientId}/start-orientation-test/`)
        
      }
    } catch (error) {
      console.error('Error sending audio to API:', error);
      alert('Error sending audio to API.');
    }
  };
  
  

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    chunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center font-sans mt-44">
      {error ? (
        <div className="text-red-500">
          <p>Error loading words: {error}</p>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => {
              setError(null);
              fetchWords();
            }}
          >
            Retry
          </button>
        </div>
      ) : !showRecorder ? (
        <div className="text-center">
          <TaskHeading heading="Word Recall" />
          {words.length > 0 && currentWordIndex < words.length ? (
            <>
              <div className="text-5xl font-semibold mb-4 border-2 border-black p-4 rounded-lg w-[400px] h-[100px] flex justify-center items-centre">
                {words[currentWordIndex]}
              </div>
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
              Upload
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
              <h2 className="text-2xl mb-4">Preview your speech</h2>
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