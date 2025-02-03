import React from 'react'

const Button = ({ name }) => {
  return (
    <div className='flex justify-center items-center'>
      <button className="mt-12 py-2 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-20 max-w-fit">
        {name}
    </button>
    </div>
    
  )
}

export default Button