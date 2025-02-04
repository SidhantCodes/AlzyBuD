'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SubHeading from '../../components/SubHeading/SubHeading';
import TaskHeading from '../../components/TaskHeading/TaskHeading';
import WordDisplay from '../../components/WordDisplay/WordDisplay';
import Paragraph from '../../components/Paragraph/Paragraph';
import Btn from '../../components/Btn/Btn';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import MicRecorder from 'mic-recorder';
import { useDropzone } from 'react-dropzone';

import clock from '../../../public/circle.svg';

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const patient_id = params.patient_id;
  const [stage, setStage] = useState('showWords');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [timer, setTimer] = useState(5);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const words = ['Flower', 'Mountain', 'Elephant', 'Sunshine', 'Ocean', 'Guitar', 'Butterfly', 'Telescope', 'Waterfall', 'Volcano'];
  const recordingTime = 30;

  useEffect(() => {
    let interval;
    if (stage === 'showWords' && currentWordIndex < words.length) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            return 5;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, currentWordIndex]);

  useEffect(() => {
    if (currentWordIndex === words.length) {
      setStage('recording');
      setTimer(recordingTime);
    }
  }, [currentWordIndex]);

  const handleStartRecording = () => {
    const recorder = new MicRecorder({
      bitRate: 128,
      encoder: 'wav',
      sampleRate: 44100,
    });
    recorder
      .start()
      .then(() => {
        setIsRecording(true);
        setRecordingStarted(true);
        recorderRef.current = recorder;
      })
      .catch((e) => {
        console.error('Error starting recorder:', e);
      });
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current
        .stop()
        .getAudio()
        .then(([buffer, blob]) => {
          const file = new File(buffer, `word_recall_attempt_${attempt}.wav`, {
            type: blob.type,
            lastModified: Date.now(),
          });
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = `word_recall_attempt_${attempt}.wav`;
          a.click();
          setIsRecording(false);
        })
        .catch((e) => {
          console.error('Error stopping recorder:', e);
        });
    }
  };

  const nextAttempt = () => {
    if (attempt < 3) {
      setAttempt(attempt + 1);
      setStage('showWords');
      setCurrentWordIndex(0);
      setTimer(5);
      setRecordingStarted(false);
    } else {
      setStage('finished');
    }
  };

  const moveToNextTest = () => {
    const targetUrl = `/${patient_id}/start-orientation-test`;
    router.push(targetUrl);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError('');
    } else {
      setError('Please upload a valid audio file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!audioFile) {
      setError('Please select an audio file first');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful upload
      console.log('Audio file received:', audioFile.name);
      
      // Clear the audio file and error states
      setAudioFile(null);
      setError('');
      
      // Set recording as started and completed to show the next attempt button
      setRecordingStarted(true);
      setIsRecording(false);

      /* TODO: Implement actual API call later
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await fetch('http://localhost:8000/upload-audio', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to upload audio file');
      }
      */
      
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <TaskHeading heading="Word Recall Test" />
      <SubHeading subhead={`Attempt: ${attempt}`} />

      {stage === 'showWords' && currentWordIndex < words.length && (
        <div className="mb-4 flex flex-col items-center justify-center">
          <WordDisplay word={words[currentWordIndex]} />
          <div className="clock flex items-center justify-center">
            <Image src={clock} height={20} width={20} alt="Clock" className="text-black mr-2" />
            <p>{timer} seconds</p>
          </div>
          <Paragraph para="Read it out loud and try to remember it" />
        </div>
      )}

      {stage === 'recording' && (
        <div className="mb-4 flex flex-col items-center justify-center">
          <Paragraph para="Now speak out all the words you remember in any sequence" />
          {!recordingStarted ? (
            <div className="flex flex-col items-center w-full max-w-md">
              <div 
                {...getRootProps()} 
                className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
                  ${error ? 'border-red-500' : ''}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-green-600">Drop the audio file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600">Drag and drop an audio file here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-2">Supported formats: MP3, WAV, M4A</p>
                  </div>
                )}
              </div>

              {audioFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Selected file: {audioFile.name}</p>
                </div>
              )}

              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}

              <button
                onClick={handleUpload}
                disabled={!audioFile || isUploading}
                className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${!audioFile || isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Audio'}
              </button>
            </div>
          ) : (
            <>
              {/* <button
                className="bg-red-500 text-white text-[1.5rem] mt-4 px-4 py-2 rounded"
                onClick={stopRecording}
              >
                Stop lol
              </button> */}
            </>
          )}
          {!isRecording && recordingStarted && (
            <button
              className="bg-green-800 text-white text-[1.5rem] mt-4 px-4 py-2 rounded"
              onClick={attempt < 3 ? nextAttempt : moveToNextTest}
            >
              {attempt < 3 ? `Attempt ${attempt + 1}` : 'Move to Next Test'}
            </button>
          )}
        </div>
      )}

      {stage === 'finished' && (
        <div>
          <h2 className="text-2xl mb-2">Test Completed</h2>
          <p>Thank you for participating in the Word Recall Test.</p>
          <button
            className="bg-blue-500 text-white text-[1.5rem] mt-4 px-4 py-2 rounded"
            onClick={moveToNextTest}
          >
            Move to Next Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;