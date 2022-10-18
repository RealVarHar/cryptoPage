import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparklines, SparklinesLine } from 'react-sparklines'

const Coins = () => {
  const [coins, setCoins] = useState([])

  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d'

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoins(response.data)
    })
  }, [url] )

  return (
    <div class="flex justify-center p-5">
      <table class="border border-black max-w-7xl">
        <thead>
          <tr>
            <th class="border border-black">#</th>
            <th class="border border-black">Coin</th>
            <th class="border border-black">Price</th>
            <th class="border border-black">1h</th>
            <th class="border border-black">24h</th>
            <th class="border border-black">7d</th>
            <th class="border border-black">Market Cap</th>
            <th class="border border-black w-1/6">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr>
              <td class="border border-black p-2">{coin.market_cap_rank}</td>
              <td class="border border-black p-2">
                <Link to={`/coin/${coin.id}`}>
                  <div class="flex">
                    <img src={coin.image} alt={coin.id} width="60" />
                    <p class="pl-4">{coin.name}</p>
                    <p class="pl-4">{coin.symbol.toUpperCase()}</p>
                  </div>
                </Link>
              </td>
              <td class="border border-black p-2">${coin.current_price.toLocaleString('en-US')}</td>
              <td class="border border-black font-medium p-2">
                {coin.price_change_percentage_1h_in_currency > 0 ? (
                  <p class="text-green-600">{coin.price_change_percentage_1h_in_currency.toFixed(2)}%</p>
                ) : (
                  <p class="text-red-600">{coin.price_change_percentage_1h_in_currency.toFixed(2)}%</p>
                )}
              </td>
              <td class="border border-black font-medium p-2">
                {coin.price_change_percentage_24h_in_currency > 0 ? (
                  <p class="text-green-600">{coin.price_change_percentage_24h_in_currency.toFixed(2)}%</p>
                ) : (
                  <p class="text-red-600">{coin.price_change_percentage_24h_in_currency.toFixed(2)}%</p>
                )}
              </td>
              <td class="border border-black font-medium p-2">
                {coin.price_change_percentage_7d_in_currency > 0 ? (
                  <p class="text-green-600">{coin.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
                ) : (
                  <p class="text-red-600">{coin.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
                )}
              </td>
              <td class="border border-black p-2">${coin.market_cap.toLocaleString('en-US')}</td>
              <td class="border border-black">
                {coin.price_change_percentage_7d_in_currency > 0 ? (
                  <Sparklines data={coin.sparkline_in_7d.price}>
                    <SparklinesLine color="green" />
                  </Sparklines>
                ) : (
                  <Sparklines data={coin.sparkline_in_7d.price}>
                    <SparklinesLine color="red" />
                  </Sparklines>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Coins