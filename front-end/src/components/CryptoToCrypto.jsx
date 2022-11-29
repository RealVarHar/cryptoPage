let useEffect=React.useEffect, useState=React.useState;
import axios from '/third-party/esm/axios.min.js'

const CryptoToCrypto = () => {
  const [coins, setCoins] = useState([])
  const [coinName, setCoinName] = useState();
  const [coinName2, setCoinName2] = useState();
  const [coinPrice, setCoinPrice] = useState(0);
  const [coinPrice2, setCoinPrice2] = useState(1);
  const [coinSymbol, setCoinSymbol] = useState();
  const [coinSymbol2, setCoinSymbol2] = useState();
  const [number, setNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true)

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`

  useEffect(() => {
    setIsLoading(true)
    axios.get(url).then((response) => {
      setCoins(response.data)
      setCoinPrice(response.data[0].current_price)
      setCoinName(response.data[0].name)
      setCoinSymbol(response.data[0].symbol.toUpperCase())
      setCoinPrice2(response.data[1].current_price)
      setCoinName2(response.data[1].name)
      setCoinSymbol2(response.data[1].symbol.toUpperCase())
      setIsLoading(false)
    })
  }, [] )

  const handleChangeCoinPrice = (event) => {
    coins.filter((coin) => {
        if (coin.name == event.target.value) {
          return coin
        }}
        ).map((coin) => (setCoinName(coin.name), setCoinPrice(coin.current_price), setCoinSymbol(coin.symbol.toUpperCase())))
  }

  const handleChangeCoinPrice2 = (event) => {
    coins.filter((coin) => {
        if (coin.name == event.target.value) {
          return coin
        }}
        ).map((coin) => (setCoinName2(coin.name), setCoinPrice2(coin.current_price), setCoinSymbol2(coin.symbol.toUpperCase())))
  }

  return (
    <div>
        <div>
            <div className='flex justify-center'>
                <p className='text-3xl my-2'>Crypto to Crypto</p>
            </div>
            <div className='flex flex-col items-center w-full'>
                <div className='flex justify-center w-full'>
                    <div className='w-1/3 flex items-center justify-end'>
                        <input className='w-full h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' type="number" value={number} onChange={(event) => {setNumber(event.target.value)}}/>
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
                    <select className='w-full h-10 bg-primary border border-secondary px-3 py-2 rounded-2xl shadow-xl' value={coinName2} onChange={handleChangeCoinPrice2}>
                        {coins.map(option => (
                            <option key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                        ))}
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
                        <p>{(coinPrice/coinPrice2).toFixed(5)} {coinName2} {coinSymbol2}</p>
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
                        <p>{((number*coinPrice)/coinPrice2).toFixed(5)} {coinName2} {coinSymbol2}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default CryptoToCrypto