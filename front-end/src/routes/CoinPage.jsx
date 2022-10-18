import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import Chart from '../components/Chart'

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
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <div class="flex-grow min-h-min">
        <div>
          <img src={coin.image?.large} alt='/'/>
          <p>{coin.name}</p>
        </div>
        <div>
          <p>About</p>
          {coin.description.en}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CoinPage