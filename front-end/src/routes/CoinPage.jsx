let useEffect=React.useEffect, useState=React.useState, useContext=React.useContext
import axios from '/third-party/esm/axios.min.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SelectButton from '../components/SelectButton.jsx'
import {Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,} from '/third-party/esm/chartjs/chart.js'
import { Line } from '/third-party/esm/react-chartjs-2.js'
let useParams=ReactRouterDOM.useParams
import { ThemeContext } from '../context/ThemeContext.jsx'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartDays = [
  {
    label: "1 Day",
    value: 1,
  },
  {
    label: "1 Month",
    value: 30,
  },
  {
    label: "1 Year",
    value: 365,
  },
  {
    label: "All",
    value: "max",
  }
]

const CoinPage = () => {
  const [coin, setCoin] = useState({})
  const [prices, setPrices] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoading2, setIsLoading2] = useState(true)
  const [days, setDays] = useState(1)
  const [label, setLabel] = useState("1 Day")
  const [currency, setCurrency] = useState('usd')
  const { theme, setTheme } = useContext(ThemeContext)
  const params = useParams()

  const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  const url2 = `https://api.coingecko.com/api/v3/coins/${params.coinId}/market_chart?vs_currency=${currency}&days=${days}`

  useEffect(() => {
    setIsLoading(true)
    axios.get(url).then((response) => {
      setCoin(response.data)
      setIsLoading(false)
    })
  },[url])

  useEffect(() => {
    setIsLoading2(true)
    axios.get(url2).then((response) => {
      setPrices(response.data.prices)
      setIsLoading2(false)
    })
  },[days, currency])

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const renderChart = (
    <>
      {isLoading2 ? (
        <div class="flex items-center" style={{height: "45vw", maxHeight: "623px"}}>
          <svg class="h-24 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          {theme == "dark" ? (
          <>
            <Line data={{
              labels: prices.map((price) => {
                let date = new Date(price[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [{
                data: prices.map((price) => price[1]),
                label: `Price ( Past ${label} ) in ${currency.toUpperCase()}`,
                borderColor: "#FFD700",
              },],
              }}
              options={{
                elements: {
                  point: {
                    radius: 3,
                  },
                },
              }}
            />
          </>
          ) : (
            <>
              <Line data={{
                labels: prices.map((price) => {
                  let date = new Date(price[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [{
                  data: prices.map((price) => price[1]),
                  label: `Price ( Past ${label} ) in ${currency.toUpperCase()}`,
                  borderColor: "#14B8A6",
                },],
                }}
                options={{
                  elements: {
                    point: {
                      radius: 3,
                    },
                  },
                }}
              />
            </>
          )}
        </>
      )}
    </>
  )
  
  return (
    <div className='p-3'>
      <Navbar />
      <div className='my-8 rounded-div'>
        {isLoading ? (
          <div class="h-64 flex items-center justify-evenly">
            <svg class="h-24 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div>
            <div className='flex justify-between'>
              <div className='flex items-center'>
                <p className='font-semibold sm:text-lg text-md'>Rank {coin.market_cap_rank != null ? "#"+coin.market_cap_rank : "-"}</p>
              </div>
              <select defaultValue={"usd"} className='h-9 sm:h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl sm:text-base text-sm' onChange={handleChangeCurrency}>
                <option value={"usd"}>USD</option>
                <option value={"pln"}>PLN</option>
              </select>
            </div>
            <div className='mt-5 flex flex-col lg:flex-row justify-center'>
              <div className='px-5 lg:w-2/5 flex flex-col justify-between'>
                <div className='flex justify-center'>
                  <div className='flex items-center'>
                    <img src={coin.image?.large} alt='/' className='w-16 sm:w-24'/>
                    <div className='mx-0 flex flex-col items-center text-center'>
                      <p className='mx-3 text-2xl sm:text-4xl font-semibold'>{coin.name}</p>
                      <p className='text-md sm:text-lg text-[#949494]'>{coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 flex justify-between'>
                  <div className='flex items-center'>
                    <p className='text-xl sm:text-3xl font-semibold flex'>
                      {coin.market_data.current_price[currency] != null ? (
                        <p className='flex'>{coin.market_data.current_price[currency] > 1 ? coin.market_data.current_price[currency].toLocaleString('pl-PL') : coin.market_data.current_price[currency]} {currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                      ) : ("-")}
                    </p>
                    <p className='ml-2 sm:ml-3 text-lg sm:text-2xl font-semibold'>
                      {coin.market_data.price_change_percentage_24h_in_currency[currency] == null ? (
                          <p></p>
                        ) : coin.market_data.price_change_percentage_24h_in_currency[currency] > 0 ? (
                          <p class="text-green-600">{coin.market_data.price_change_percentage_24h_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600">{coin.market_data.price_change_percentage_24h_in_currency[currency].toFixed(2)}%</p>
                        )}
                    </p>
                    <p className='ml-2 sm:ml-3 text-md sm:text-lg font-semibold text-[#949494] flex'>
                      {coin.market_data.price_change_24h_in_currency[currency] != null ? (
                        <p className='flex'>{parseFloat(coin.market_data.price_change_24h_in_currency[currency].toFixed(5))}{currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                      ) : (<p></p>)}
                    </p>
                  </div>
                </div>
                <div className='mt-5'>
                  {coin.market_data.low_24h[currency] != null && coin.market_data.high_24h[currency] != null ? (
                    <div>
                      <div className='bg-slate-300 dark:bg-slate-600 h-3 rounded-full'>
                        <div className='bg-button h-3 rounded-full' style={{ width: ( ( 100 - ( ( coin.market_data.high_24h[currency] - coin.market_data.current_price[currency] ) / ( coin.market_data.high_24h[currency] - coin.market_data.low_24h[currency] ) * 100 )).toString( ) + "%" ) }}>
                        </div>
                      </div>
                      <div className='flex justify-between font-semibold text-xs sm:text-base'>
                        <p className='flex'>{coin.market_data.low_24h[currency] > 1 ? coin.market_data.low_24h[currency].toLocaleString('pl-PL') : coin.market_data.low_24h[currency]} {currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                        <p className='flex'>24H Range</p>
                        <p className='flex'>{coin.market_data.high_24h[currency] > 1 ? coin.market_data.high_24h[currency].toLocaleString('pl-PL') : coin.market_data.high_24h[currency]} {currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='bg-slate-300 dark:bg-slate-600 h-3 rounded-full'>
                      </div>
                      <div className='flex justify-between font-semibold text-xs sm:text-base'>
                        <p className='flex'>-</p>
                        <p className='flex'>24H Range</p>
                        <p className='flex'>-</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className='mt-5'>
                  {coin.sentiment_votes_down_percentage != null && coin.sentiment_votes_up_percentage != null ? (
                  <div>  
                    <div className='bg-green-600 dark:bg-green-800 h-3 rounded-full'>
                      <div className='bg-red-600 dark:bg-red-800 h-3 rounded-l-full' style={{ width: (coin.sentiment_votes_down_percentage).toString() + "%" }}></div>
                    </div>
                    <div className='flex justify-between font-semibold text-xs sm:text-base'>
                      <p className='flex'>{coin.sentiment_votes_down_percentage}%</p>
                      <p className='flex'>Sell / Buy</p>
                      <p className='flex'>{coin.sentiment_votes_up_percentage}%</p>
                    </div>
                  </div>
                  ) : (
                    <div>
                      <div className='bg-slate-300 dark:bg-slate-600 h-3 rounded-full'>
                      </div>
                      <div className='flex justify-between font-semibold text-xs sm:text-base'>
                        <p className='flex'>-</p>
                        <p className='flex'>Sell / Buy</p>
                        <p className='flex'>-</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className='my-5'>
                  <div className='mt-5 flex justify-between'>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>1h</div>
                      <div>{coin.market_data.price_change_percentage_1h_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_1h_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_1h_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_1h_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>24h</div>
                      <div>{coin.market_data.price_change_percentage_24h_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_24h_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_24h_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_24h_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>7D</div>
                      <div>{coin.market_data.price_change_percentage_7d_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_7d_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_7d_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_7d_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>14D</div>
                      <div>{coin.market_data.price_change_percentage_14d_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_14d_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_14d_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_14d_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 flex justify-between'>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>30D</div>
                      <div>{coin.market_data.price_change_percentage_30d_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_30d_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_30d_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_30d_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>60D</div>
                      <div>{coin.market_data.price_change_percentage_60d_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_60d_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_60d_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_60d_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>200D</div>
                      <div>{coin.market_data.price_change_percentage_200d_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_200d_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_200d_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_200d_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                    <div className='w-1/5 flex flex-col items-center border border-secondary rounded-lg sm:text-lg text-xs'>
                      <div className='w-full border-b border-secondary flex justify-center font-semibold'>1Y</div>
                      <div>{coin.market_data.price_change_percentage_1y_in_currency[currency] == null ? (
                          <p>-</p>
                        ) : coin.market_data.price_change_percentage_1y_in_currency[currency] > 0 ? (
                          <p class="text-green-600 font-semibold">{coin.market_data.price_change_percentage_1y_in_currency[currency].toFixed(2)}%</p>
                        ) : (
                          <p class="text-red-600 font-semibold">{coin.market_data.price_change_percentage_1y_in_currency[currency].toFixed(2)}%</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-5 lg:mt-0 px-6 lg:w-3/5 flex justify-center'>
                <div className='max-w-2xl w-full'>
                <p className='flex justify-center text-lg sm:text-2xl font-semibold'>{coin.symbol.toUpperCase()} Price Statistics</p>
                <table className='w-full text-xs sm:text-base'>
                  <tbody>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Market Cap Rank</p>
                      </td>
                      <td>
                        <p className='flex'>{coin.market_data.market_cap_rank != null ? "#"+coin.market_data.market_cap_rank : "-"}</p>
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>{coin.name} Price</p>
                      </td>
                      <td>
                        {coin.market_data.current_price[currency] != null ? (
                        <p className='flex'>{coin.market_data.current_price[currency] > 1 ? coin.market_data.current_price[currency].toLocaleString('pl-PL') : coin.market_data.current_price[currency]} {currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                        ) : ("-")}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>24h Low / 24h High</p>
                      </td>
                      <td>
                        {coin.market_data.low_24h[currency] != null && coin.market_data.high_24h[currency] != null ? (
                          <p className='flex'>
                            {coin.market_data.low_24h[currency] > 1 ? coin.market_data.low_24h[currency].toLocaleString('pl-PL') : coin.market_data.low_24h[currency]}&nbsp;/&nbsp;
                            {coin.market_data.high_24h[currency] > 1 ? coin.market_data.high_24h[currency].toLocaleString('pl-PL') : coin.market_data.high_24h[currency]} 
                            {currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}
                          </p>
                        ) : (<p>-</p>)}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Trading Volume</p>
                      </td>
                      <td>
                        {coin.market_data.total_volume[currency] != null ? (
                        <p className='flex'>{coin.market_data.total_volume[currency] > 1 ? coin.market_data.total_volume[currency].toLocaleString('pl-PL') : coin.market_data.total_volume[currency]}{currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                        ) : ("-")}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Market Cap</p>
                      </td>
                      <td>
                        {coin.market_data.market_cap[currency] != null ? (
                          <p className='flex'>{coin.market_data.market_cap[currency] > 1 ? coin.market_data.market_cap[currency].toLocaleString('pl-PL') : coin.market_data.market_cap[currency]}{currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}</p>
                        ) : ("-")}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Circulating Supply</p>
                      </td>
                      <td>
                        {coin.market_data.circulating_supply != null ? coin.market_data.circulating_supply.toLocaleString('pl-PL') : "-"}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Total Supply</p>
                      </td>
                      <td>
                        {coin.market_data.total_supply != null ? coin.market_data.total_supply.toLocaleString('pl-PL') : "-"}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td>
                        <p>Max Supply</p>
                      </td>
                      <td>
                        {coin.market_data.max_supply != null ? coin.market_data.max_supply.toLocaleString('pl-PL') : "-"}
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td className='flex items-center'>
                        <p>All-Time High</p>
                      </td>
                      <td className='flex flex-col items-end'>
                        <p className='flex'>
                          {coin.market_data.ath[currency] > 1 ? coin.market_data.ath[currency].toLocaleString('pl-PL') : coin.market_data.ath[currency]}{currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}&nbsp;&nbsp;
                          {coin.market_data.ath_change_percentage[currency] == null ? (
                            <p></p>
                          ) : coin.market_data.ath_change_percentage[currency] > 0 ? (
                            <p class="text-green-600 font-semibold">{coin.market_data.ath_change_percentage[currency].toFixed(2)}%</p>
                          ) : (
                            <p class="text-red-600 font-semibold">{coin.market_data.ath_change_percentage[currency].toFixed(2)}%</p>
                          )}
                        </p>
                        <p>{(new Date(coin.market_data.ath_date[currency])).toLocaleString()}</p>
                      </td>
                    </tr>
                    <tr className='py-2 border-b border-secondary flex justify-between'>
                      <td className='flex items-center'>
                        <p>All-Time Low</p>
                      </td>
                      <td className='flex flex-col items-end'>
                        <p className='flex'>
                          {coin.market_data.atl[currency] > 1 ? coin.market_data.atl[currency].toLocaleString('pl-PL') : coin.market_data.atl[currency]}{currency == "usd" ? (<p>&nbsp;$</p>) : (<p>&nbsp;zł</p>)}&nbsp;&nbsp;
                          {coin.market_data.atl_change_percentage[currency] == null ? (
                            <p></p>
                          ) : coin.market_data.atl_change_percentage[currency] > 0 ? (
                            <p class="text-green-600 font-semibold">{coin.market_data.atl_change_percentage[currency].toFixed(2)}%</p>
                          ) : (
                            <p class="text-red-600 font-semibold">{coin.market_data.atl_change_percentage[currency].toFixed(2)}%</p>
                          )}
                        </p>
                        <p>{(new Date(coin.market_data.atl_date[currency])).toLocaleString()}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
            <div className='hidden mt-7 sm:flex sm:justify-center sm:max-h-96' style={{height: "45vw", maxHeight: "623px"}}>{renderChart}</div>
            <div className='hidden sm:flex sm:mt-5 sm:justify-around sm:w-full'>
              {chartDays.map((day) => (<SelectButton key={day.value} onClick={() => { setDays(day.value); setLabel(day.label)}} selected={day.value === days}>{day.label}</SelectButton>))}
            </div>
            <div className='mt-5'>
              <p className='text-lg sm:text-2xl font-bold'>About {coin.name}</p>
              <p style={{textAlign: "justify"}} className='pt-1 text-xs sm:text-base'>{coin.description?.en.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoinPage