// app/page.jsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import TaskHeading from '../../components/TaskHeading/TaskHeading';
import Btn from '../../components/Btn/Btn'
import Paragraph from '../../components/Paragraph/Paragraph';
import Link from 'next/link';

export default function MainPage() {
    const { 'patient_id': patientId } = useParams()
    return (
        <>
        <div className="flex justify-center text-center mx-10 flex-col items-center min-h-[calc(100vh-64px)]">
        <TaskHeading heading="Alzheimer's Cognitive Assessment" />
        <Paragraph para="Welcome to our Alzheimer's Cognitive Assessment platform. You will complete tasks that assess various cognitive functions, with an instructor present to guide you throughout. Please ensure you're in a quiet, well-lit room, and follow the instructions provided. Take your time—there's no rush, and support is available if needed. Make sure to have any required materials ready for the test."/>    
        <Link href={`/${patientId}/word-recall-test`}>
            <Btn name="Start the test"/>
        </Link>
        </div>
        </>
    );
}