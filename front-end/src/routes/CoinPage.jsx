let useEffect=React.useEffect, useState=React.useState;
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
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [label, setLabel] = useState("1 Day");
  const [currency, setCurrency] = useState('usd');
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
    axios.get(url2).then((response) => {
      setPrices(response.data.prices)
    })
  },[days, currency])

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

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
            <img src={coin.image?.small} alt='/'/>
            <p>{coin.name}</p>
            <p>{coin.symbol.toUpperCase()}</p>
            <p>Rank: {coin.market_cap_rank}</p>
            {currency == "usd" ? (
              <p>{coin.market_data.current_price.usd > 1 ? coin.market_data.current_price.usd.toLocaleString('pl-PL') : coin.market_data.current_price.usd} {currency.toUpperCase()}</p>
            ) : (
              <p>{coin.market_data.current_price.pln > 1 ? coin.market_data.current_price.pln.toLocaleString('pl-PL') : coin.market_data.current_price.pln} {currency.toUpperCase()}</p>
            )}
            <select defaultValue={"usd"} className='h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' onChange={handleChangeCurrency}>
              <option value={"usd"}>USD</option>
              <option value={"pln"}>PLN</option>
            </select>
            <Line data={{
                labels: prices.map((price) => {
                  let date = new Date(price[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: prices.map((price) => price[1]),
                    label: `Price ( Past ${label} ) in ${currency.toUpperCase()}`,
                    borderColor: "#14B8A6",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            
            <div
              style={{
                display: "flex",
                marginTop: 20,
                marginBottom: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton key={day.value} onClick={() => { setDays(day.value); setLabel(day.label)}} selected={day.value === days} >
                  {day.label}
                </SelectButton>
              ))}
            </div>
            <div className=''>
              <p style={{textAlign: "justify"}} className='text-sm'>{coin.description?.en.replace(/<\/?[^>]+(>|$)/g, "")}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoinPage