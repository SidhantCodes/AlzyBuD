"use client"
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [patientId, setPatientId] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isOnScreenKeyboard, setIsOnScreenKeyboard] = useState(true);
  const [authToken, setAuthToken] = useState('');

  const questions = [
    'Please state your full name',
    `What day of the week is it?`,
    `What is today's date?`,
    `What month is it?`,
    `What year is it?`,
    `What season is it?`,
    `What time is it now?`,
    `Where are we now?`,
  ];

  

  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    setPatientId(urlParts[1]);

    const fetchAuthToken = async () => {
      const response = await fetch("http://localhost:8000/auth-token", {
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("Auth Token:", data.auth_token);
      setAuthToken(data.auth_token);
    };

    fetchAuthToken();
  }, []);

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const firstRow = alphabet.slice(0, 13);
  const secondRow = alphabet.slice(13);
  const row = ["1","2","3","4","5","6","7","8","9",'0',":"];

  const handleKeyboardToggle = () => {
    setIsOnScreenKeyboard(!isOnScreenKeyboard);
  };

  const handleKeyPress = (char) => {
    setAnswer(prev => prev + char);
  };

  const handleBackspace = () => {
    setAnswer(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setAnswer('');
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      console.log('Submitting answers:', updatedAnswers);
      console.log('Auth Token:', authToken);
  
      try {
        const response = await fetch('http://localhost:8000/orientation-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${authToken}`, // Use this if backend expects a Bearer token
          },
          // Uncomment below if the backend requires the token as a cookie
          credentials: 'include',
          body: JSON.stringify({ responses: updatedAnswers }),
        });
  
        if (!response.ok) {
          const errorDetails = await response.text(); // Fetch response body to debug further
          console.error('Response error:', errorDetails);
          throw new Error('Failed to submit answers');
        }
  
        console.log('Submission successful');
        window.location.href = `/${patientId}/naming-task`;
      } catch (error) {
        console.error('Error submitting answers:', error);
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-4xl font-bold mb-5">Orientation</h1>
      <p className="text-2xl mb-10">{questions[currentQuestionIndex]}</p>

      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly={isOnScreenKeyboard}
          className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type your answer here..."
        />
      </div>

      <button
        onClick={handleKeyboardToggle}
        className="mb-6 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg"
      >
        {isOnScreenKeyboard ? 'Use Device Keyboard' : 'Use On-Screen Keyboard'}
      </button>

      {isOnScreenKeyboard && (
        <div className="w-full max-w-3xl bg-gray-100 p-4 rounded-xl shadow-lg">
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {firstRow.map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="w-12 h-12 bg-white rounded-lg shadow-md hover:shadow-lg text-xl font-medium"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {secondRow.map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="w-12 h-12 bg-white rounded-lg shadow-md hover:shadow-lg text-xl font-medium"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => handleKeyPress(char)}
                className="w-12 h-12 bg-white rounded-lg shadow-md hover:shadow-lg text-xl font-medium"
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleBackspace}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              ← Backspace
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        {currentQuestionIndex < questions.length - 1 ? 'Submit Answer' : 'Finish Test'}
      </button>
    </div>
  );
};

export default Page;