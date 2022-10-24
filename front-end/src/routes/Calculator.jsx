import React, {useEffect, useState} from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import CurrencyRow from '../components/CurrencyRow'
import axios from 'axios'


const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'

const Calculator = () => {
 const [currencyOptions, setCurrencyOptions] = useState([])
 useEffect(() =>{
    axios.get(url)
      .then(res => setCurrencyOptions(res.data))
 }, [url])

  return (
    <div className='p-3'>
      <Navbar />
        <div className='my-8 rounded-div'>
          <h1>Calculator</h1>
          <CurrencyRow 
            currencyOptions={currencyOptions}
          />
          <div>=</div>
          <CurrencyRow 
            currencyOptions={currencyOptions}
  />
        </div>
      <Footer />
    </div>
  )
}

export default Calculator

