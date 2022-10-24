import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const Calculator = () => {
  return (
    <div className='p-3'>
      <Navbar />
        <div className='my-8 rounded-div'>
          <h1>Calculator</h1>
        </div>
      <Footer />
    </div>
  )
}

export default Calculator