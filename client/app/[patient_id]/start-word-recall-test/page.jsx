// // app/page.jsx
// 'use client';
// import React from 'react';
// import { useRouter, useParams } from 'next/navigation';

// import TaskHeading from '../../components/TaskHeading/TaskHeading';
// import Btn from '../../components/Btn/Btn'
// import Paragraph from '../../components/Paragraph/Paragraph';
// import Link from 'next/link';
// // import Cookies from 'js-cookie';

// export default function MainPage() {
//     const params = useParams();
//     const patient_id = params.patient_id;
//     const router = useRouter();
//     return (
//         <>
//         <div className="flex justify-center text-center mx-10 flex-col items-center min-h-[calc(100vh-64px)]">
//         <TaskHeading heading="Alzheimer's Cognitive Assessment" />
//         <Paragraph para="Welcome to our Alzheimer's Cognitive Assessment platform. You will complete tasks that assess various cognitive functions, with an instructor present to guide you throughout. Please ensure you're in a quiet, well-lit room, and follow the instructions provided. Take your time—there's no rush, and support is available if needed. Make sure to have any required materials ready for the test."/>    
//         {/* <Btn name="Start the test"/> */}
//         <Link href={`/${patient_id}/word-recall-test/`} className='mt-12 py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20 '>
//             Start the test
//         </Link>

        
//         </div>
//         </>
//     );
// }

// app/page.jsx
'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import TaskHeading from '../../components/TaskHeading/TaskHeading';
import SubHeading from '../../components/SubHeading/SubHeading';
import Paragraph from '../../components/Paragraph/Paragraph';
import Btn from '../../components/Btn/Btn'
import Link from 'next/link';


export default function MainPage() {
    const { 'patient_id': patientId } = useParams()
    return (
        <div className="flex justify-center text-center mx-10 flex-col items-center min-h-[calc(100vh-64px)]">
        <TaskHeading heading="Word Recall" />
        <SubHeading subhead="Instruction"/>
        <Paragraph para="You will be shown a series of 10 words on the screen. Your task is to carefully memorize them. Once all the words have been displayed, you will need to record yourself attempting to recall as many words as possible from memory."/>    
        <Link href={`/${patientId}/word-recall-test`}>
            <Btn name="Start the test"/>
        </Link>
        </div>
    );
};

// export default Page;