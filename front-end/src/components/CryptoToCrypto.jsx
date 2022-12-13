let useEffect=React.useEffect, useState=React.useState;
import axios from '/third-party/esm/axios.min.js'
import reactIcons from '/third-party/esm/react-icons';let TbArrowsRightLeft=await reactIcons("TbArrowsRightLeft");let TbEqual=await reactIcons("TbEqual");

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
  const [button2, setButton2] = useState(0)

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

  const buttonCryptoCrypto = () => {
    setButton2(!button2)
  }

  return (
    <div className='text-xs md:text-base font-medium'>
        <div>
            <div className='flex justify-center'>
                <p className='text-xl md:text-3xl my-1 font-semibold'>Crypto to Crypto</p>
            </div>
            <div className='py-2 flex flex-col items-center w-full'>
                <div className='flex justify-center w-full'>
                    <div className='w-2/3 sm:w-1/3 flex items-center justify-end'>
                        <input className='w-full h-8 md:h-10 bg-primary border border-secondary px-4 rounded-2xl shadow-xl' type="number" value={number} onChange={(event) => {setNumber(event.target.value)}}/>
                    </div>
                    <div className='hidden w-16 sm:flex justify-center'></div>
                    <div className='hidden w-1/3 sm:flex items-center'></div>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-center w-full'>
                <div className='sm:w-1/3 flex justify-center'>
                    {button2 == 0 ? (
                        <select className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' value={coinName} onChange={handleChangeCoinPrice}>
                            {coins.map(option => (
                                <option className='flex items-center text-center' key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                            ))}
                        </select>
                    ) : (
                        <select className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' value={coinName2} onChange={handleChangeCoinPrice2}>
                            {coins.map(option => (
                                <option className='flex items-center text-center' key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className='sm:w-16 flex justify-center sm:py-0 py-2'>
                    <p className='text-xl md:text-2xl flex items-center rotate-90 sm:rotate-0'>
                        <button className='dark:hover:text-[#FFD700] hover:text-[#14B8A6]' onClick={buttonCryptoCrypto}><TbArrowsRightLeft /></button>
                    </p>
                </div>
                <div className='sm:w-1/3 flex justify-center'>
                    {button2 == 0 ? (
                        <select className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' value={coinName2} onChange={handleChangeCoinPrice2}>
                            {coins.map(option => (
                                <option className='flex items-center text-center' key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                            ))}
                        </select>
                    ) : (
                        <select className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' value={coinName} onChange={handleChangeCoinPrice}>
                            {coins.map(option => (
                                <option className='flex items-center text-center' key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
        {isLoading ? (
            <div className='h-[88px]'></div>
        ) : (
            <div className='flex flex-col items-center w-full py-3'>
                <div className='flex justify-center w-full h-8'>
                    <div className='sm:w-1/3 flex items-center justify-end'>
                        {button2 == 0 ? (
                            <p>1 {coinSymbol}</p>
                        ) : (
                            <p>1 {coinSymbol2}</p>
                        )}
                    </div>
                    <div className='w-8 sm:w-16 flex justify-center'>
                        <p className='text-base md:text-2xl flex items-center'>
                            <TbEqual />
                        </p>
                    </div>
                    <div className='sm:w-1/3 flex items-center'>
                        {button2 == 0 ? (
                            <p>{parseFloat(coinPrice/coinPrice2).toFixed(6) > 1 ? parseFloat((coinPrice/coinPrice2).toFixed(6)).toLocaleString('pl-PL') : parseFloat(coinPrice/coinPrice2).toFixed(6)} {coinSymbol2}</p>
                        ) : (
                            <p>{parseFloat(coinPrice2/coinPrice).toFixed(6) > 1 ? parseFloat((coinPrice2/coinPrice).toFixed(6)).toLocaleString('pl-PL') : parseFloat(coinPrice2/coinPrice).toFixed(6)} {coinSymbol}</p>
                        )}
                    </div>
                </div>
                <div className='flex justify-center w-full h-8'>
                    <div className='sm:w-1/3 flex items-center justify-end'>
                        {button2 == 0 ? (
                            <p>{parseFloat(number) > 1 ? parseFloat(number).toLocaleString('pl-PL') : parseFloat(number)} {coinSymbol}</p>
                        ) : (
                            <p>{parseFloat(number) > 1 ? parseFloat(number).toLocaleString('pl-PL') : parseFloat(number)} {coinSymbol2}</p>
                        )}
                    </div>
                    <div className='w-8 sm:w-16 flex justify-center'>
                        <p className='text-base md:text-2xl flex items-center'>
                            <TbEqual />
                        </p>
                    </div>
                    <div className='sm:w-1/3 flex items-center'>
                        {button2 == 0 ? (
                            <p>{parseFloat((number*coinPrice)/coinPrice2).toFixed(6) > 1 ? parseFloat(((number*coinPrice)/coinPrice2).toFixed(6)).toLocaleString('pl-PL') : parseFloat((number*coinPrice)/coinPrice2).toFixed(6)} {coinSymbol2}</p>
                        ) : (
                            <p>{parseFloat((number*coinPrice2)/coinPrice).toFixed(6) > 1 ? parseFloat(((number*coinPrice2)/coinPrice).toFixed(6)).toLocaleString('pl-PL') : parseFloat((number*coinPrice2)/coinPrice).toFixed(6)} {coinSymbol}</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default CryptoToCrypto