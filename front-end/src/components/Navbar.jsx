import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'

const Navbar = () => {
  return (
    <div class="bg-black p-6 flex">
      <Link to="/home">
        <img src={logo} alt="Logo" width="100"></img>
      </Link>
    </div>
  )
}

export default Navbar