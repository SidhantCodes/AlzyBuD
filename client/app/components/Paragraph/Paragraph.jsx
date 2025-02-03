import React from 'react'

const Paragraph = ({ para }) => {
  return (
    <p className='text-[1.3rem] text-center max-w-[500px] mx-auto my-10'>
      {para}
    </p>
  )
}

export default Paragraph