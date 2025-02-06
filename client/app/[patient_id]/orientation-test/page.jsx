// "use client";
// import React, { useState, useEffect } from "react";
// import { ReactSketchCanvas } from "react-sketch-canvas";

// const Page = () => {
//   const [patientId, setPatientId] = useState("");
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [authToken, setAuthToken] = useState("");

//   const questions = [
//     "Please state your full name",
//     `What day of the week is it?`,
//     `What is today's date?`,
//     `What month is it?`,
//     `What year is it?`,
//     `What season is it?`,
//     `What time is it now?`,
//     `Where are we now?`,
//   ];

//   useEffect(() => {
//     const urlParts = window.location.pathname.split("/");
//     setPatientId(urlParts[1]);

//     /* Commented out API call
//     const fetchAuthToken = async () => {
//       const response = await fetch("http://localhost:8000/auth-token", {
//         credentials: "include", // Include cookies in the request
//       });
//       const data = await response.json();
//       console.log("Auth Token:", data.auth_token);
//       setAuthToken(data.auth_token);
//     };

//     fetchAuthToken();
//     */
//   }, []);

//   const handleClearCanvas = (canvasRef) => {
//     canvasRef.current.clearCanvas();
//   };

//   const handleSubmit = async (canvasRef) => {
//     const updatedAnswers = [...answers];

//     try {
//       const dataURL = await canvasRef.current.exportImage("png");
//       updatedAnswers.push(dataURL);
//       setAnswers(updatedAnswers);

//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex((prev) => prev + 1);
//         canvasRef.current.clearCanvas();
//       } else {
//         console.log("Submitting answers:", updatedAnswers);
//         console.log("Auth Token:", authToken);

//         /* Commented out API call
//         try {
//           const response = await fetch("http://localhost:8000/orientation-test", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               // Authorization: `Bearer ${authToken}`,
//             },
//             credentials: "include",
//             body: JSON.stringify({ responses: updatedAnswers }),
//           });

//           if (!response.ok) {
//             const errorDetails = await response.text();
//             console.error("Response error:", errorDetails);
//             throw new Error("Failed to submit answers");
//           }

//           console.log("Submission successful");
//           window.location.href = `/${patientId}/naming-test`;
//         } catch (error) {
//           console.error("Error submitting answers:", error);
//         }
//         */
//       }
//     } catch (error) {
//       console.error("Error exporting canvas image:", error);
//     }
//   };

//   const canvasRef = React.createRef();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
//       <h1 className="text-4xl font-bold mb-5">Orientation</h1>
//       <p className="text-2xl mb-10">{questions[currentQuestionIndex]}</p>

//       <div className="w-full max-w-2xl mb-6">
//         <div className="border-2 border-gray-300 rounded-lg p-4">
//           <ReactSketchCanvas
//             ref={canvasRef}
//             style={{ width: "100%", height: "300px" }}
//             strokeWidth={4}
//             strokeColor="black"
//           />
//         </div>
//       </div>

//       <button
//         onClick={() => handleClearCanvas(canvasRef)}
//         className="mb-6 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg"
//       >
//         Clear
//       </button>

//       <button
//         onClick={() => handleSubmit(canvasRef)}
//         className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//       >
//         {currentQuestionIndex < questions.length - 1 ? "Submit Answer" : "Finish Test"}
//       </button>

//       {/* Commented out text field backup
//       <div className="w-full max-w-2xl mb-6">
//         <input
//           type="text"
//           value={answer}
//           onChange={(e) => setAnswer(e.target.value)}
//           readOnly
//           className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//           placeholder="Type your answer here..."
//         />
//       </div>
//       */}
//     </div>
//   );
// };

// export default Page;  

"use client";
import React, { useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import TaskHeading from "../../components/TaskHeading/TaskHeading"

const Page = () => {
  const [patientId, setPatientId] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [authToken, setAuthToken] = useState("");

  const questions = [
    "Please state your full name",
    `What day of the week is it?`,
    `What is today's date?`,
    `What month is it?`,
    `What year is it?`,
    `What season is it?`,
    `What time is it now?`,
    `Where are we now?`,
  ];

  useEffect(() => {
    const urlParts = window.location.pathname.split("/");
    setPatientId(urlParts[1]);

    /* Commented out API call
    const fetchAuthToken = async () => {
      const response = await fetch("http://localhost:8000/auth-token", {
        credentials: "include", // Include cookies in the request
      });
      const data = await response.json();
      console.log("Auth Token:", data.auth_token);
      setAuthToken(data.auth_token);
    };

    fetchAuthToken();
    */
  }, []);

  const handleClearCanvas = (canvasRef) => {
    canvasRef.current.clearCanvas();
  };

  const handleSubmit = async (canvasRef) => {
    const updatedAnswers = [...answers];

    try {
      const dataURL = await canvasRef.current.exportImage("jpeg");
      updatedAnswers.push(dataURL);
      setAnswers(updatedAnswers);

      console.log("Submitting image as JPEG:", dataURL);

      // Dummy API endpoint
      try {
        const response = await fetch("https://dummyapi.com/submit-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: dataURL }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("Response error:", errorDetails);
          throw new Error("Failed to submit image");
        }

        console.log("Image submission successful");
      } catch (error) {
        console.error("Error submitting image:", error);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        canvasRef.current.clearCanvas();
      }
    } catch (error) {
      console.error("Error exporting canvas image:", error);
    }
  };

  const canvasRef = React.createRef();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* <h1 className="text-4xl font-bold mb-5">Orientation</h1> */}
      <TaskHeading heading="Orientation" />
      <p className="text-2xl mb-10">{questions[currentQuestionIndex]}</p>

      <div className="w-full max-w-2xl mb-6">
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <ReactSketchCanvas
            ref={canvasRef}
            style={{ width: "100%", height: "300px" }}
            strokeWidth={4}
            strokeColor="black"
          />
        </div>
      </div>

      <button
        onClick={() => handleClearCanvas(canvasRef)}
        className="mb-6 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg"
      >
        Clear
      </button>

      <button
        onClick={() => handleSubmit(canvasRef)}
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        {currentQuestionIndex < questions.length - 1 ? "Submit Answer" : "Finish Test"}
      </button>

      {/* Commented out text field backup
      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          readOnly
          className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type your answer here..."
        />
      </div>
      */}
    </div>
  );
};

export default Page;
