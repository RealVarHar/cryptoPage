let useEffect=React.useEffect, useState=React.useState;
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import axios from '/third-party/esm/axios.min.js'

const Calculator = () => {
  const [coins, setCoins] = useState([])
  const [coinName, setCoinName] = useState();
  const [coinPrice, setCoinPrice] = useState(0);
  const [number, setNumber] = useState(1);
  const [currency, setCurrency] = useState('usd');

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoins(response.data)
      setCoinPrice(response.data[0].current_price)
      setCoinName(response.data[0].name)
    })
  }, [currency] )

  const handleChangeCoinPrice = (event) => {
    setCoinName(event.target.value)
    setCoinPrice(coins.filter((coin) => {
      if (coin.name === event.target.value) {
        return coin
      }}
      ).map((coin) => (coin.current_price)))
  }

  return (
    <div className='p-3'>
      <Navbar />
        <div className='my-8 rounded-div'>
          <h1>Calculator</h1>

          <br></br>

          <div>
            <select defaultValue={"usd"} className='h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' onChange={(event) => {setCurrency(event.target.value)}}>
                <option value={"usd"}>USD</option>
                <option value={"pln"}>PLN</option>
            </select>
          </div>

          <br></br>

          <div>
            <input type="number" value={number} onChange={(event) => {setNumber(event.target.value)}}/>


            <select value={coinName} onChange={handleChangeCoinPrice}>
              {coins.map(option => (
                  <option key={option.name} value={option.name}>{option.name}</option>
              ))}
            </select>   
          </div>

          <br></br>
          <p>{coinName}   {coinPrice} {currency.toUpperCase()}</p>
          <br></br>
          <p>{(number*coinPrice)} {currency.toUpperCase()}</p>
          

        </div>
      <Footer />
    </div>
  )
}

export default Calculator