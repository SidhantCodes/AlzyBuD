// app/page.jsx
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import TaskHeading from '../../components/TaskHeading/TaskHeading';
import SubHeading from '../../components/SubHeading/SubHeading';
import Image from 'next/image';

const Page = () => {
    const params = useParams();
    const [currentTrial, setCurrentTrial] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [attempts, setAttempts] = useState(1);
    const [showHint, setShowHint] = useState(false);
    const [userInput, setUserInput] = useState('');

    const images = [
        {
            src: '/images/cycle.png',
            answers: ['bicycle', 'cycle', 'bike'],
            hint: '2 Wheeled, manual, used for travel'
        },
        {
            src: '/images/clock.png',
            answers: ['clock', 'wall clock','watch', 'time'],
            hint: 'Helps you tell the time'
        },
        {
            src: '/images/chair.png',
            answers: ['chair', 'seat'],
            hint: 'Furniture used for sitting'
        },
        {
            src: '/images/umbrella.png',
            answers: ['umbrella', 'parasol'],
            hint: 'Protects you from rain'
        },
        {
            src: '/images/key.png',
            answers: ['key'],
            hint: 'Used to lock and unlock things'
        }
    ];

    const isCorrectAnswer = (input) => {
        const currentImage = images[currentImageIndex];
        return currentImage.answers.includes(input.toLowerCase().trim());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isCorrectAnswer(userInput) || userInput === '') {
            // Move to next image
            if (currentImageIndex < 4) {
                setCurrentImageIndex(prev => prev + 1);
                setAttempts(1);
                setShowHint(false);
                setUserInput('');
            } else {
                // Completed all 5 images in current trial
                if (currentTrial < 3) {
                    // Move to next trial
                    setCurrentTrial(prev => prev + 1);
                    setCurrentImageIndex(0);
                    setAttempts(1);
                    setShowHint(false);
                    setUserInput('');
                } else {
                    // All trials completed
                    alert('All trials completed!');
                    // Add navigation logic here if needed
                }
            }
        } else {
            // Wrong answer, still move to next image
            if (currentImageIndex < 4) {
                setCurrentImageIndex(prev => prev + 1);
                setAttempts(1);
                setShowHint(false);
                setUserInput('');
            } else {
                // Completed all 5 images in current trial
                if (currentTrial < 3) {
                    setCurrentTrial(prev => prev + 1);
                    setCurrentImageIndex(0);
                    setAttempts(1);
                    setShowHint(false);
                    setUserInput('');
                } else {
                    alert('All trials completed!');
                }
            }
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <TaskHeading heading="Naming Task" />
            <SubHeading subhead={`Trial ${currentTrial}`} />
            
            <div className="mt-8 max-w-2xl w-full">
                <div className="relative w-full h-64 mb-8">
                    <Image 
                        src={images[currentImageIndex].src}
                        alt="Object to name"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-lg"
                    />
                </div>

                <p className="text-xl text-center mb-6">Guess the object</p>
                
                {showHint && (
                    <div className="bg-blue-100 p-4 rounded-lg mb-6">
                        <p className="text-blue-800">Hint: {images[currentImageIndex].hint}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4"
                        placeholder="Enter your answer (or leave empty to skip)"
                    />
                    <button
                        type="submit"
                        className="py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Page;