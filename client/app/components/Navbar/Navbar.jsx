import React from 'react'
import Image from 'next/image'
import logo from '@/public/AlzybuD.png' 
import { navlinks } from '@/public/constants/constants'
import Link from 'next/link'
export default function Navbar() {
  return (
    <div className='flex w-screen justify-between'>
      <Image src={logo} height={140} width={140} alt='AlzyBud' className='ml-6'/>
      <nav className='flex  text-xl font-semibold '>
            <div className="flex gap-x-10 mr-16">
              {navlinks.map((link) => (
                  <Link key={link.url} href={link.url} className="">
                      {link.name}
                  </Link>
                  
              ))}
            </div>
      </nav>
    </div>
  )
}
