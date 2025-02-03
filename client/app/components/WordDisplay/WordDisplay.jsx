import React from 'react'

const WordDisplay = ({ word }) => {
  return (
    <div className='border border-black rounded-md my-10 w-fit px-8 py-2 text-[4rem] font-semibold'>
        {word}
    </div>
  )
}

export default WordDisplay