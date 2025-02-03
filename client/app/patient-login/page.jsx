// 'use client'
// import React from 'react'
// import Navbar from '../components/Navbar/Navbar'
// import SubHeading from '../components/SubHeading/SubHeading'
// import Btn from '../components/Btn/Btn'
// import Heading from '../components/Heading/Heading'
// import { useState } from 'react';


// const page = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     remember: false,
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.username) newErrors.username = 'Please input your username!';
//     if (!formData.password) newErrors.password = 'Please input your password!';
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length === 0) {
//       console.log('Success:', formData);
//     } else {
//       setErrors(validationErrors);
//     }
//   };
//   return (
//     <div className='flex-col py-10 mx-4'>
//     <Navbar />        
//     <div className="title mt-28 flex-col justify-center items-center">
//         <SubHeading subhead={`Your gateway to streamlined `} />
//         <Heading heading={`Alzheimer's care solutions`} />
//         <div className="bg-black mx-24 h-0.5 rounded-full "></div>
//         <SubHeading subhead={`Strength in care, even when memories fade`}  />
//         {/*  */}
//         <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }} className='flex flex-col justify-center items-center'>
//           <>
//           <div className='mb-8'>
//             <input
//               type="text"
//               name="username"
//               placeholder='Username'
//               value={formData.username}
//               onChange={handleChange}
//               className='font-black border-1'
//             />
//             {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
//           </div>

//           <div style={{ marginBottom: '16px' }}>
//             <label style={{ display: 'block', marginBottom: '4px' }}>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//             />
//             {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
//           </div>

//           <div style={{ marginBottom: '16px' }}>
//             <label>
//               <input
//                 type="checkbox"
//                 name="remember"
//                 checked={formData.remember}
//                 onChange={handleChange}
//               />{' '}
//               Remember me
//             </label>
//           </div>
//           </>
//           <button className='w-screen flex mt-12 py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20 max-w-fit'>
//             Submit
//           </button>
//         </form>
//         {/*  */}
        
//         <p className='pt-10 items-center text-center justify-center'>Please refer to the patient id and the password sent to you on your registered mail</p>
//         </div>
//     </div>
//   )
// }

// export default page

'use client'
import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import SubHeading from '../components/SubHeading/SubHeading';
import Heading from '../components/Heading/Heading';

const Page = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Success:', formData);
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

          <button type="submit" className="w-full py-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition duration-300 ease-in-out">
            Register now
          </button>
        </form>

        <p className="pt-10 text-center">Please refer to the patient ID and the password sent to you on your registered email.</p>
      </div>
    </div>
  );
};

export default Page; 