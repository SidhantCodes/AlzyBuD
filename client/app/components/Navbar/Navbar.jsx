import React from 'react'
import Image from 'next/image'
import logo from '../../../public/AlzybuD.png' 
import Link from 'next/link'
export default function Navbar() {
  return (
    <div className='flex items-center justify-center mt-6'>
      <Image src={logo} height={140} width={140} alt='AlzyBud' className=''/>
    </div>
  )
}
