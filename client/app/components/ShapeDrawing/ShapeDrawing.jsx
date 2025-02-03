import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import axios from 'axios';

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
};

const ShapeDrawing = ({ shape, onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 3 minutes in seconds
  const [showNextButton, setShowNextButton] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shapesData, setShapesData] = useState([]);

  useEffect(() => {
    let timer;
    if (isDrawing && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleDownload();
      setShowNextButton(true);
      setIsDrawing(false);
    }
    return () => clearInterval(timer);
  }, [isDrawing, timeLeft]);

  const handleStartDrawing = () => {
    if (attempts < 2) {
      canvasRef.current.clearCanvas();
      setIsDrawing(true);
      setTimeLeft(10);
      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  const handleDownload = () => {
    canvasRef.current
      .exportImage("jpeg")
      .then(data => {
        setIsDrawing(false);
        
        // Immediately add the new shape data to the array
        setShapesData(prevData => [
          ...prevData,
          {
            base64_image: data,
            correct_shape: shape.name
          }
        ]);
        
        setShowNextButton(true);
      })
      .catch(e => {
        console.error("Error exporting image:", e);
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleNextShape = async () => {
    canvasRef.current.clearCanvas();
    setShowNextButton(false);
    setAttempts(0);
    
    // Check if all shapes have been drawn
    if (shapesData.length === 8) { // Assuming there are 4 shapes in total
      const filteredShapeData = shapesData.filter((_, index) => index % 2 === 0);
      try {
        console.log(filteredShapeData)
        const response = await axios.post('http://localhost:8001/predict_all_shapes', {
          shapes: filteredShapeData
        });
        
        console.log("API response:", response.data);
        
        // Pass the API response to onComplete
        onComplete(response.data);
      } catch (error) {
        console.error("Error sending data to API:", error);
      }
    } else {
      // If not all shapes have been drawn, continue to the next shape
      onComplete({ shapes: shapesData });
    }
  };

  return (
    <div className='mt-4 w-[600px] justify-center items-center flex flex-col'>
      <Image src={shape.image} height={150} width={150} alt={shape.name} className='object-contain flex justify-center items-center'/>
      <h3 className='my-3 font-bold text-2xl'>{shape.name}</h3>
      <div className='mb-4 flex w-[600px] justify-between items-center'>
        <div className='text-xl font-bold'>
          {isDrawing && `Time left: ${formatTime(timeLeft)}`}
          {!isDrawing && `Attempts: ${attempts}/2`}
        </div>
        <div className='flex gap-4'>
          <button 
            onClick={handleStartDrawing} 
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out'
            disabled={isDrawing || attempts >= 2}
          >
            Start Drawing
          </button>
          {showNextButton && (
            <button 
              onClick={handleNextShape} 
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out'
            >
              Next Shape
            </button>
          )}
        </div>
      </div>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={12}
        strokeColor="red"
        style={styles}
        width="600px"
        height="400px"
        canvasColor={isDrawing ? "white" : "lightgray"}
        disabled={!isDrawing}
        className='mb-5'
      />
    </div>
  )
}

export default ShapeDrawing