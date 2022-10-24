import React from 'react'
import Coins from '../components/Coins'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const Home = () => {
  return (
    <div className='p-3'>
      <Navbar />
      <Coins />
      <Footer />
    </div>
  )
}

export default Home