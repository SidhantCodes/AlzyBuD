'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TaskHeading from '../../components/TaskHeading/TaskHeading';
import Paragraph from '../../components/Paragraph/Paragraph';
import Link from 'next/link';

export default function MainPage() {
    const params = useParams();
    const patient_id = params.patient_id;
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="flex justify-center text-center mx-10 flex-col items-center min-h-[calc(100vh-64px)]">
                <TaskHeading heading="Montreal Cognitive Assessment" />
                <Paragraph para="Welcome to our Alzheimer's Cognitive Assessment platform. You will complete tasks that assess various cognitive functions, with an instructor present to guide you throughout. Please ensure you're in a quiet, well-lit room, and follow the instructions provided. Take your time—there's no rush, and support is available if needed. Make sure to have any required materials ready for the test." /> 

                <button 
                    onClick={() => setShowModal(true)}
                    className='mt-12 py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20'
                >
                    Start the test
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
                        <h2 className="text-2xl font-bold text-center mb-4">Instructions</h2>
                        <ul className="list-disc list-inside text-left space-y-2">
                            <li>Once a test has been started, it must be completed in one sitting without any breaks.</li>
                            <li>You are allowed to take breaks only in between a test, not any time else.</li>
                            <li>Please make yourself seated in a comfortable and quiet environment without any disturbances as it can cause distractions during the tests.</li>
                        </ul>

                        <div className="mt-6 flex justify-between">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="py-2 px-6 rounded-lg text-gray-700 font-bold bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out"
                            >
                                Go back
                            </button>

                            <button 
                                onClick={() => router.push(`/${patient_id}/start-word-recall-test/`)}
                                className="py-2 px-6 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out"
                            >
                                Yes, I understand, Proceed to test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
