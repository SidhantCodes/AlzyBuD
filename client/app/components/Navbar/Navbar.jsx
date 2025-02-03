import React from 'react'
import Image from 'next/image'
import logo from '@/public/Alzybud.png'
import { navlinks } from '@/public/constants/constants'
import Link from 'next/link'
export default function Navbar() {
  return (
    <div className='flex w-screen justify-between px-16'>
      <Image src={logo} height={140} width={140} alt='AlzyBud' className='object-contain'/>
      <nav className='flex justify-between text-xl gap-x-16 font-semibold '>
            <div className="flex gap-x-10">
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
