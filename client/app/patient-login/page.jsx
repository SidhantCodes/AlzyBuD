import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SubHeading from '../components/SubHeading/SubHeading'
import Button from '../components/Button/Button'
import Heading from '../components/Heading/Heading'
import MiniHeading from '../components/MiniHeading/MiniHeading'
const page = () => {
  return (
    <div className='flex-col py-10 mx-4'>
    <Navbar />        
    <div className="title mt-28 flex-col justify-center items-center">
        <SubHeading subhead={`Your gateway to streamlined `} />
        <Heading heading={`Alzheimer's care solutions`} />
        <div className="bg-black mx-24 h-0.5 rounded-full "></div>
        <SubHeading subhead={`Strength in care, even when memories fade`}  />
        
        <Button name={`Register now`} />
        <p className='pt-10 items-center text-center justify-center'>Please refer to the patient id and the password sent to you on your registered mail</p>
        </div>
    </div>
  )
}

export default page