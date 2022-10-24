import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'

const CoinPage = () => {
  const [coin, setCoin] = useState({})
  const params = useParams()

  const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}?localization=false`

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoin(response.data)
      console.log(response.data)
    })
  },[url])

  return (
    <div className='p-3'>
      <Navbar />
      <div className='my-8 rounded-div'>
        <img src={coin.image?.large} alt='/'/>
        <p>{coin.name}</p>
      </div>
      <Footer />
    </div>
  )
}

export default CoinPage