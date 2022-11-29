let useEffect=React.useEffect, useState=React.useState;
import axios from '/third-party/esm/axios.min.js'

const CryptoToFiat = () => {
  const [coins, setCoins] = useState([])
  const [coinName, setCoinName] = useState();
  const [coinSymbol, setCoinSymbol] = useState();
  const [coinPrice, setCoinPrice] = useState(0);
  const [number, setNumber] = useState(1);
  const [currency, setCurrency] = useState('usd');
  const [isLoading, setIsLoading] = useState(true)

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false`

  useEffect(() => {
    setIsLoading(true)
    axios.get(url).then((response) => {
      setCoins(response.data)
      setCoinPrice(response.data[0].current_price)
      setCoinName(response.data[0].name)
      setCoinSymbol(response.data[0].symbol.toUpperCase())
      setIsLoading(false)
    })
  }, [currency] )

  const handleChangeCoinPrice = (event) => {
    coins.filter((coin) => {
      if (coin.name == event.target.value) {
        return coin
      }}
      ).map((coin) => (setCoinName(coin.name), setCoinPrice(coin.current_price), setCoinSymbol(coin.symbol.toUpperCase())))
    setNumber(1)
  }

  return (
    <div>
        <div>
            <div className='flex justify-center'>
                <p className='text-3xl my-2'>Crypto to FIAT</p>
            </div>
            <div className='flex flex-col items-center w-full'>
                <div className='flex justify-center w-full'>
                    <div className='w-1/3 flex items-center justify-end'>
                        <input className='w-full h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' type="number" value={number} onChange={(event) => {(setNumber(event.target.value))}}/>
                    </div>
                    <div className='w-16 flex justify-center'></div>
                    <div className='w-1/3 flex items-center'></div>
                </div>
            </div>
            <div className='flex justify-center w-full'>
                <div className='w-1/3'>
                    <select className='w-full h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' value={coinName} onChange={handleChangeCoinPrice}>
                        {coins.map(option => (
                            <option key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <div className='w-16 flex justify-center'>
                    <p className='text-3xl'>=</p>
                </div>
                <div className='w-1/3'>
                    <select defaultValue={"usd"} className='w-full h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' onChange={(event) => {setCurrency(event.target.value)}}>
                        <option value={"usd"}>&nbsp;USD&nbsp;&nbsp;&nbsp;United States Dollar "$"</option>
                        <option value={"pln"}>&nbsp;PLN&nbsp;&nbsp;&nbsp;Polish Złoty "zł"</option>
                    </select>
                </div>
            </div>
        </div>
        {isLoading ? (
            <div></div>
        ) : (
            <div className='flex flex-col items-center w-full'>
                <div className='flex justify-center w-full'>
                    <div className='w-1/3 flex items-center justify-end'>
                        <p>1 {coinName} {coinSymbol}</p>
                    </div>
                    <div className='w-16 flex justify-center'>
                        <p className='text-3xl'>=</p>
                    </div>
                    <div className='w-1/3 flex items-center'>
                        <p>{coinPrice} {currency.toUpperCase()}</p>
                    </div>
                </div>
                <div className='flex justify-center w-full'>
                    <div className='w-1/3 flex items-center justify-end'>
                        <p>{number} {coinName} {coinSymbol}</p>
                    </div>
                    <div className='w-16 flex justify-center'>
                        <p className='text-3xl'>=</p>
                    </div>
                    <div className='w-1/3 flex items-center'>
                        <p>{(number*coinPrice)} {currency.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default CryptoToFiat;