import React from 'react';
import Heading from '../components/Heading/Heading';

const Dashboard = () => {
  return (
    <div className="p-5 font-sans">
      {/* <h1 className="text-3xl font-bold text-gra/y-800">AlzyBuddy</h1> */}
      <Heading heading="Welcome, admin" />
      {/* <p className="text-lg text-gray-600 mt-2">Welcome, Admin.</p> */}

      <div className="my-5">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-3 hover:bg-blue-600">
          Add Patients +
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Schedule Test +
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-3 text-left">Patient Id</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Test Scheduled</th>
            <th className="p-3 text-left">Report</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">HYFE625</td>
            <td className="p-3">Sidhant Mishra</td>
            <td className="p-3">07-02-25</td>
            <td className="p-3"></td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">HYFE626</td>
            <td className="p-3">Akshoy Bhandari</td>
            <td className="p-3">07-02-25</td>
            <td className="p-3"></td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">HYFE627</td>
            <td className="p-3">Uttkarsh Srivastava</td>
            <td className="p-3">07-02-25</td>
            <td className="p-3"></td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="p-3">HYFE628</td>
            <td className="p-3">Yuvraj Singh</td>
            <td className="p-3">07-02-25</td>
            <td className="p-3"></td>
          </tr>
        </tbody>
      </table>

      {/* <button className="mt-5 items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
        Exit
      </button> */}
    </div>
  );
};

export default Dashboard;