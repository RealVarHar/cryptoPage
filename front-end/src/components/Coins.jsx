import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparklines, SparklinesLine } from 'react-sparklines'

const Coins = () => {
  const [coins, setCoins] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currency, setCurrency] = useState('usd');

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`

  useEffect(() => {
    setIsLoading(true)
    axios.get(url).then((response) => {
      setCoins(response.data)
      setIsLoading(false)
    })
  }, [url] )

  const handleChangePerPage = (event) => {
    setPerPage(event.target.value);
  };

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const renderTable = (
      <table className='w-full border-separate border-spacing-y-4'>
        <thead>
          <tr>
            <th className='pl-2'>#</th>
            <th className='text-left pl-7 w-auto'>Coin</th>
            <th className='text-right pr-5 w-auto'>Price</th>
            <th className='hidden sm:table-cell w-16'>1H</th>
            <th className='hidden sm:table-cell w-16'>24H</th>
            <th className='hidden sm:table-cell w-16'>7D</th>
            <th className='hidden lg:table-cell text-right pr-3 w-36'>24H Volume</th>
            <th className='hidden md:table-cell text-right pr-3 w-36'>Market Cap</th>
            <th>Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins.sort((a, b) => a.rank - b.rank)
            .filter((value) => {
              if (searchText === '') {
                return value;
              } else if (
                value.name.toLowerCase().includes(searchText.toLowerCase()) || value.symbol.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return value;
              }
            })
            .map((coin) => (
              <tr className='md:hover:scale-[1.03] shadow-xl rounded-lg h-16 overflow-hidden'>
                <td className='pl-2'><p class="flex justify-center">{coin.market_cap_rank}</p></td>
                <td>
                  <div className='flex items-center'>
                    <Link to={`/coin/${coin.id}`}>
                      <div className='ml-2 flex items-center hover:text-teal-400'>
                        <img className='px-2' src={coin.image} alt={coin.id} width="50" />
                        <div className='flex flex-col justify-center'>
                          <p className='font-semibold'>{coin.name}</p>
                          <p className='text-secondary'>{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </Link>
                    <div></div>
                  </div>
                </td>
                <td className='text-right pr-3'>{coin.current_price > 1 ? coin.current_price.toLocaleString('pl-PL') : coin.current_price} {currency.toUpperCase()}</td>
                <td class="font-medium p-2 text-center hidden sm:table-cell">
                  {coin.price_change_percentage_1h_in_currency == null ? (
                    <p></p>
                  ) : coin.price_change_percentage_1h_in_currency > 0 ? (
                    <p class="text-green-600">{coin.price_change_percentage_1h_in_currency.toFixed(2)}%</p>
                  ) : (
                    <p class="text-red-600">{coin.price_change_percentage_1h_in_currency.toFixed(2)}%</p>
                  )}
                </td>
                <td class="font-medium p-2 text-center hidden sm:table-cell">
                  {coin.price_change_percentage_24h_in_currency == null ? (
                    <p></p>
                  ) : coin.price_change_percentage_24h_in_currency > 0 ? (
                    <p class="text-green-600">{coin.price_change_percentage_24h_in_currency.toFixed(2)}%</p>
                  ) : (
                    <p class="text-red-600">{coin.price_change_percentage_24h_in_currency.toFixed(2)}%</p>
                  )}
                </td>
                <td class="font-medium p-2 text-center hidden sm:table-cell">
                  {coin.price_change_percentage_7d_in_currency == null ? (
                    <p></p>
                  ) : coin.price_change_percentage_7d_in_currency > 0 ? (
                    <p class="text-green-600">{coin.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
                  ) : (
                    <p class="text-red-600">{coin.price_change_percentage_7d_in_currency.toFixed(2)}%</p>
                  )}
                </td>
                <td class="p-2 text-right hidden lg:table-cell">{coin.total_volume.toLocaleString('pl-PL')} {currency.toUpperCase()}</td>
                <td class="p-2 text-right hidden md:table-cell">{coin.market_cap.toLocaleString('pl-PL')} {currency.toUpperCase()}</td>
                <td className=''>
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
  );

  return (
    <div className='my-8 rounded-div'>
      <div className='px-1 md:px-3 text-[12px]'>
        <div className='flex flex-col md:flex-row md:items-center justify-between pt-3 pb-3 text-center md:text-right'>
          <h1 className='text-2xl font-bold my-2'>Search Crypto</h1>
          <form className='flex justify-center h-10 md:w-1/3'>
            <input
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full bg-primary border border-secondary px-4 py-2 rounded-2xl shadow-xl'
              type='text'
              placeholder='Search a coin' />
          </form>
        </div>
        <div className='flex justify-end'>
          <select className='h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl mr-3' onChange={handleChangePerPage}>
            <option value={5}>5</option>
            <option selected value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
          <select className='h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' onChange={handleChangeCurrency}>
            <option selected value={"usd"}>USD</option>
            <option value={"pln"}>PLN</option>
          </select>
        </div>
        {isLoading ? (
          <div class="h-64 flex items-center justify-evenly">
            <svg class="h-24 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : renderTable}
      </div>
    </div>
  )
}

export default Coins