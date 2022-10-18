import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Coins from '../components/Coins'


const Home = () => {
  return (
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <div class="flex-grow min-h-min">
        <Coins />
      </div>
      <Footer />
    </div>
  )
}

export default Home