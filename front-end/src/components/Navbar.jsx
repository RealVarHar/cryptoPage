import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
    <div className='rounded-div flex items-center justify-between h-28 font-bold'>
      <Link to="/home">
        <div className='ml-5'>
          <img src={logo} alt="Logo" width="170"></img>
        </div>
      </Link>
      <div className='flex items-center'>
        <div className='mr-7 hover:text-[#FFD700]'>
          <Link to="/calculator">
            <h1>Calculator</h1>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Navbar
