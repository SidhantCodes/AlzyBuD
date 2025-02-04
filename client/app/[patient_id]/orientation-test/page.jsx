'use client'
import React, { useState, useEffect } from 'react';


const Page = () => {
  const [patientId, setPatientId] = useState('');
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isOnScreenKeyboard, setIsOnScreenKeyboard] = useState(true);

  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    setPatientId(urlParts[1]);
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

  const handleSubmit = () => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      console.log('All answers:', updatedAnswers);
      window.location.href = `/${patientId}/naming-task`;
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
