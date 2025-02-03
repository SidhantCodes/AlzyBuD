// 'use client'
// import React, { useState, useEffect } from 'react';

// import SubHeading from '@/app/components/SubHeading/SubHeading';
// import TaskHeading from '@/app/components/TaskHeading/TaskHeading';
// import WordDisplay from '@/app/components/WordDisplay/WordDisplay';
// import Paragraph from '@/app/components/Paragraph/Paragraph';
// import Btn from '@/app/components/Btn/Btn'
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';

// import clock from '@/public/icon/clock.svg'

// const page = () => {
//   const router = useRouter();
//   const [stage, setStage] = useState('showWords');
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [attempt, setAttempt] = useState(1);
//   const [timer, setTimer] = useState(5);

//   const words = ['Flower', 'Mountain', 'Elephant', 'Sunshine', 'Ocean', 'Guitar', 'Butterfly', 'Telescope', 'Waterfall', 'Volcano'];
//   const recordingTime = 30;

//   useEffect(() => {
//     let interval;
//     if (stage === 'showWords' && currentWordIndex < words.length) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 0) {
//             setCurrentWordIndex((prevIndex) => prevIndex + 1);
//             return 5; // Reset timer
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     } else if (stage === 'recording') {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 0) {
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [stage, currentWordIndex]);

//   useEffect(() => {
//     if (currentWordIndex === words.length) {
//       setStage('recording');
//       setTimer(recordingTime);
//     }
//   }, [currentWordIndex]);

//   const startRecording = () => {
//     setTimer(recordingTime);
//   };

//   const stopRecording = () => {
//     // Placeholder for stop recording logic
//   };

//   const nextAttempt = () => {
//     if (attempt < 3) {
//       setAttempt(attempt + 1);
//       setStage('showWords');
//       setCurrentWordIndex(0);
//       setTimer(5);
//     } else {
//       setStage('finished');
//     }
//   };

//   const moveToNextTest = () => {
//     router.push('/wordrecalltest/finish-wordrecall-test');
//   };


//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center justify-center">
//       <TaskHeading heading='Word Recall Test' />
//       <SubHeading subhead={`Attempt: ${attempt}`} />

//       {stage === 'showWords' && currentWordIndex < words.length && (
//         <div className="mb-4 flex flex-col items-center justify-center">
//           <WordDisplay word={words[currentWordIndex]} />
//           {/* <p>Time remaining: {timer} seconds</p> */}
//           <div className="clock flex items-center justify-center">
//             <Image src={clock} height={20} width={20} alt='Clock' className='text-black mr-2' />
//             <p> {timer} seconds</p>
//           </div>
//           <Paragraph para='Read it out loud and try to remember it' />
//         </div>
//       )}

//       {stage === 'recording' && (
//         <div className="mb-4 flex flex-col items-center justify-center">
//           {/* <h2 className="text-2xl mb-2">Now speak out all the words you remember in any sequence</h2> */}
//           <Paragraph para='Now speak out all the words you remember in any sequence'/>
//           <div className="clock flex items-center justify-center">
//             <Image src={clock} height={20} width={20} alt='Clock' className='text-black mr-2' />
//             <p> {timer} seconds</p>
//           </div>
//           {timer === recordingTime && (
//             <Btn name='Start Recording' />
//           )}
//           {timer < recordingTime && timer > 0 && (
//             <button
//               className="bg-red-500 text-white text-[1.5rem] mt-24 px-4 py-2 rounded"
//               onClick={stopRecording}
//             >
//               Listening...
//             </button>
//           )}
//           {timer === 0 && (
//             <button
//               className="bg-green-800 text-white text-[1.5rem] mt-24 px-4 py-2 rounded"
//               onClick={attempt < 3 ? nextAttempt : moveToNextTest}
//             >
//               {attempt < 3 ? `Attempt ${attempt + 1}` : 'Move to Next Test'}
//             </button>
//           )}
//         </div>
//       )}

//       {stage === 'finished' && (
//         <div>
//           <h2 className="text-2xl mb-2">Test Completed</h2>
//           <p>Thank you for participating in the Word Recall Test.</p>
//           <button
//             className="bg-blue-500 text-white text-[1.5rem] mt-4 px-4 py-2 rounded"
//             onClick={moveToNextTest}
//           >
//             Move to Next Test
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default page

// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import SubHeading from '@/app/components/SubHeading/SubHeading';
// import TaskHeading from '@/app/components/TaskHeading/TaskHeading';
// import WordDisplay from '@/app/components/WordDisplay/WordDisplay';
// import Paragraph from '@/app/components/Paragraph/Paragraph';
// import Btn from '@/app/components/Btn/Btn';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import clock from '@/public/icon/clock.svg';
// import Recorder from 'recorder-js';

// const page = () => {
//   const router = useRouter();
//   const [stage, setStage] = useState('showWords');
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [attempt, setAttempt] = useState(1);
//   const [timer, setTimer] = useState(5);
//   const [isRecording, setIsRecording] = useState(false);
//   const recorder = useRef(null);
//   const audioContext = useRef(null);

//   const words = ['Flower', 'Mountain', 'Elephant', 'Sunshine', 'Ocean', 'Guitar', 'Butterfly', 'Telescope', 'Waterfall', 'Volcano'];
//   const recordingTime = 30;

//   useEffect(() => {
//     let interval;
//     if (stage === 'showWords' && currentWordIndex < words.length) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 0) {
//             setCurrentWordIndex((prevIndex) => prevIndex + 1);
//             return 5;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     } else if (stage === 'recording') {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => (prevTimer === 0 ? 0 : prevTimer - 1));
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [stage, currentWordIndex]);

//   useEffect(() => {
//     if (currentWordIndex === words.length) {
//       setStage('recording');
//       setTimer(recordingTime);
//     }
//   }, [currentWordIndex]);

//   const startRecording = async () => {
//     try {
//       audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
//       recorder.current = new Recorder(audioContext.current);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       recorder.current.init(stream);
//       recorder.current.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//     }
//   };

//   const stopRecording = () => {
//     if (recorder.current) {
//       recorder.current.stop().then(({ blob }) => {
//         const audioURL = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = audioURL;
//         link.download = `word_recall_attempt_${attempt}.wav`;
//         link.click();
//       });
//     }
//     setIsRecording(false);
//   };

//   const nextAttempt = () => {
//     if (attempt < 3) {
//       setAttempt(attempt + 1);
//       setStage('showWords');
//       setCurrentWordIndex(0);
//       setTimer(5);
//     } else {
//       setStage('finished');
//     }
//   };

//   const moveToNextTest = () => {
//     router.push('/wordrecalltest/finish-wordrecall-test');
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center justify-center">
//       <TaskHeading heading="Word Recall Test" />
//       <SubHeading subhead={`Attempt: ${attempt}`} />

//       {stage === 'showWords' && currentWordIndex < words.length && (
//         <div className="mb-4 flex flex-col items-center justify-center">
//           <WordDisplay word={words[currentWordIndex]} />
//           <div className="clock flex items-center justify-center">
//             <Image src={clock} height={20} width={20} alt="Clock" className="text-black mr-2" />
//             <p>{timer} seconds</p>
//           </div>
//           <Paragraph para="Read it out loud and try to remember it" />
//         </div>
//       )}

//       {stage === 'recording' && (
//         <div className="mb-4 flex flex-col items-center justify-center">
//           <Paragraph para="Now speak out all the words you remember in any sequence" />
//           <div className="clock flex items-center justify-center">
//             <Image src={clock} height={20} width={20} alt="Clock" className="text-black mr-2" />
//             <p>{timer} seconds</p>
//           </div>
//           {!isRecording && timer === recordingTime && <Btn name="Start Recording" onClick={startRecording} />}
//           {isRecording && timer > 0 && (
//             <button className="bg-red-500 text-white text-2xl mt-4 px-4 py-2 rounded" onClick={stopRecording}>
//               Stop Recording
//             </button>
//           )}
//           {timer === 0 && (
//             <button
//               className="bg-green-800 text-white text-2xl mt-4 px-4 py-2 rounded"
//               onClick={attempt < 3 ? nextAttempt : moveToNextTest}
//             >
//               {attempt < 3 ? `Attempt ${attempt + 1}` : 'Move to Next Test'}
//             </button>
//           )}
//         </div>
//       )}

//       {stage === 'finished' && (
//         <div>
//           <h2 className="text-2xl mb-2">Test Completed</h2>
//           <p>Thank you for participating in the Word Recall Test.</p>
//           <button
//             className="bg-blue-500 text-white text-2xl mt-4 px-4 py-2 rounded"
//             onClick={moveToNextTest}
//           >
//             Move to Next Test
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default page;

'use client'
import React, { useState, useEffect, useRef } from 'react';

import SubHeading from '@/app/components/SubHeading/SubHeading';
import TaskHeading from '@/app/components/TaskHeading/TaskHeading';
import WordDisplay from '@/app/components/WordDisplay/WordDisplay';
import Paragraph from '@/app/components/Paragraph/Paragraph';
import Btn from '@/app/components/Btn/Btn';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import clock from '@/public/icon/clock.svg';

const Page = () => {
  const router = useRouter();
  const [stage, setStage] = useState('showWords');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [timer, setTimer] = useState(5);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
    } else if (stage === 'recording') {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            stopRecording();
            return 0;
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `word_recall_attempt_${attempt}.wav`;
        a.click();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const nextAttempt = () => {
    if (attempt < 3) {
      setAttempt(attempt + 1);
      setStage('showWords');
      setCurrentWordIndex(0);
      setTimer(5);
    } else {
      setStage('finished');
    }
  };

  const moveToNextTest = () => {
    router.push('/wordrecalltest/finish-wordrecall-test');
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <TaskHeading heading='Word Recall Test' />
      <SubHeading subhead={`Attempt: ${attempt}`} />

      {stage === 'showWords' && currentWordIndex < words.length && (
        <div className="mb-4 flex flex-col items-center justify-center">
          <WordDisplay word={words[currentWordIndex]} />
          <div className="clock flex items-center justify-center">
            <Image src={clock} height={20} width={20} alt='Clock' className='text-black mr-2' />
            <p>{timer} seconds</p>
          </div>
          <Paragraph para='Read it out loud and try to remember it' />
        </div>
      )}

      {stage === 'recording' && (
        <div className="mb-4 flex flex-col items-center justify-center">
          <Paragraph para='Now speak out all the words you remember in any sequence' />
          <div className="clock flex items-center justify-center">
            <Image src={clock} height={20} width={20} alt='Clock' className='text-black mr-2' />
            <p>{timer} seconds</p>
          </div>
          {!isRecording ? (
            <Btn name='Start Recording' onClick={startRecording} />
          ) : (
            <button
              className="bg-red-500 text-white text-[1.5rem] mt-4 px-4 py-2 rounded"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          )}
          {timer === 0 && (
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
