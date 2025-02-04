// app/page.jsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import TaskHeading from '../../components/TaskHeading/TaskHeading';
import SubHeading from '../../components/SubHeading/SubHeading';
import Paragraph from '../../components/Paragraph/Paragraph';
import Link from 'next/link';

const Page = () => {
    const params = useParams();
    const patient_id = params.patient_id;

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center">
            <TaskHeading heading="Naming Task" />
            <SubHeading subhead="Let's test your object recognition" />
            <div className="mt-8 max-w-2xl w-full">
                <Paragraph para="In this test, you'll be shown different images and asked to name the objects shown. Don't worry if you can't recognize something - you can skip it or get a hint after 3 attempts." />
                <div className="mt-8 flex justify-center">
                    <Link 
                        href={`/${patient_id}/naming-test`}
                        className="mt-12 py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20"
                    >
                        Start Test
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;