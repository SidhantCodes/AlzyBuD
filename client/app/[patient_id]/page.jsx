// app/page.jsx

import TaskHeading from '../components/TaskHeading/TaskHeading';
import Button from '../components/Btn/Btn';
import Paragraph from '../components/Paragraph/Paragraph';
import Link from 'next/link';
import Navbar from '../components/Navbar/Navbar';

export default function MainPage() {
  return (
    <>
      <div className="flex justify-center text-center mx-10 flex-col items-center min-h-[calc(100vh-64px)]">
        <Navbar />
        
      
      </div>
    </>
  );
}