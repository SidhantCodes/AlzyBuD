'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar/Navbar';
import SubHeading from '../components/SubHeading/SubHeading';
import Heading from '../components/Heading/Heading';

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Please input your patient ID!';
    if (!formData.password) newErrors.password = 'Please input your password!';
    return newErrors;
  };

  const dummyValidation = (patientId, password) => {
    return patientId === 'patient123' && password === 'password123'; // Dummy credentials
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      if (dummyValidation(formData.patientId, formData.password)) {
        router.push(`/${formData.patientId}/start-word-recall-test`);
      } else {
        setErrors({ general: 'Invalid Patient ID or Password!' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col py-10 mx-4">
      <Navbar />
      <div className="title mt-28 flex flex-col justify-center items-center">
        <SubHeading subhead={`Your gateway to streamlined`} />
        <Heading heading={`Alzheimer's care solutions`} />
        <div className="bg-black mx-24 h-0.5 rounded-full"></div>
        <SubHeading subhead={`Strength in care, even when memories fade`} />

        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Patient Login</h2>

          <div className="mb-4 w-full">
            <label className="block text-black font-semibold mb-2">Patient ID</label>
            <input
              type="text"
              name="patientId"
              placeholder="Enter your pid"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>}
          </div>

          <div className="mb-6 w-full">
            <label className="block text-black font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

          <button type="submit" className="w-full py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300 ease-in-out">
            Login
          </button>
        </form>

        <p className="pt-10 text-center">Please refer to the patient ID and the password sent to you on your registered email.</p>
      </div>
    </div>
  );
};

export default Page;
