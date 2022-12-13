let useEffect=React.useEffect, useState=React.useState;
import axios from '/third-party/esm/axios.min.js'
import reactIcons from '/third-party/esm/react-icons';let TbArrowsRightLeft=await reactIcons("TbArrowsRightLeft");let TbEqual=await reactIcons("TbEqual");

const CryptoToFiat = () => {
  const [coins, setCoins] = useState([])
  const [coinName, setCoinName] = useState()
  const [coinSymbol, setCoinSymbol] = useState()
  const [coinPrice, setCoinPrice] = useState(0)
  const [number, setNumber] = useState(1)
  const [currency, setCurrency] = useState('usd')
  const [isLoading, setIsLoading] = useState(true)
  const [button1, setButton1] = useState(0)

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
    //setNumber(1)
  }

  const buttonCryptoFiat = () => {
    setButton1(!button1)
  }

  return (
    <div className='text-xs md:text-base font-medium'>
        <div>
            <div className='flex justify-center'>
                <p className='text-xl md:text-3xl my-1 font-semibold'>Crypto to FIAT</p>
            </div>
            <div className='py-2 flex flex-col items-center w-full'>
                <div className='flex justify-center w-full'>
                    <div className='w-2/3 sm:w-1/3 flex items-center justify-end'>
                        <input className='w-full h-8 md:h-10 bg-primary border border-secondary px-4 rounded-2xl shadow-xl' type="number" value={number} onChange={(event) => {(setNumber(event.target.value))}}/>
                    </div>
                    <div className='hidden w-16 sm:flex justify-center'></div>
                    <div className='hidden w-1/3 sm:flex items-center'></div>
                </div>
            </div>
            <div className='flex flex-col sm:flex-row justify-center w-full'>
                <div className='sm:w-1/3 flex justify-center'>
                    {button1 == 0 ? (
                        <select className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' value={coinName} onChange={handleChangeCoinPrice}>
                            {coins.map(option => (
                                <option className='flex items-center text-center' key={option.name} value={option.name}>{option.name} {option.symbol.toUpperCase()}</option>
                            ))}
                        </select>
                    ) : (
                        <select defaultValue={"usd"} className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' onChange={(event) => {setCurrency(event.target.value)}}>
                            <option className='flex items-center text-center' value={"usd"}>&nbsp;USD&nbsp;&nbsp;&nbsp;United States Dollar "$"</option>
                            <option className='flex items-center text-center' value={"pln"}>&nbsp;PLN&nbsp;&nbsp;&nbsp;Polish Złoty "zł"</option>
                            <option className='flex items-center text-center' value={"usd"}>&nbsp;USD&nbsp;&nbsp;&nbsp;United States Dollar</option>
                            <option className='flex items-center text-center' value={"pln"}>&nbsp;PLN&nbsp;&nbsp;&nbsp;Polish Złoty</option>
                            <option className='flex items-center text-center' value={"eur"}>&nbsp;EUR&nbsp;&nbsp;&nbsp;Euro</option>
                            <option className='flex items-center text-center' value={"gbp"}>&nbsp;GBP&nbsp;&nbsp;&nbsp;Pound Sterling</option>
                            <option className='flex items-center text-center' value={"chf"}>&nbsp;CHF&nbsp;&nbsp;&nbsp;Swiss Franc</option>
                            <option className='flex items-center text-center' value={"cny"}>&nbsp;CNY&nbsp;&nbsp;&nbsp;Chinese Yuan</option>
                            <option className='flex items-center text-center' value={"nok"}>&nbsp;NOK&nbsp;&nbsp;&nbsp;Norwegian Krone</option>
                            <option className='flex items-center text-center' value={"sek"}>&nbsp;SEK&nbsp;&nbsp;&nbsp;Swedish Krona</option>
                            <option className='flex items-center text-center' value={"czk"}>&nbsp;CZK&nbsp;&nbsp;&nbsp;Czech Koruna</option>
                            <option className='flex items-center text-center' value={"dkk"}>&nbsp;DKK&nbsp;&nbsp;&nbsp;Danish Krone</option>
                            <option className='flex items-center text-center' value={"krw"}>&nbsp;KRW&nbsp;&nbsp;&nbsp;South Korean Won</option>
                            <option className='flex items-center text-center' value={"uah"}>&nbsp;UAH&nbsp;&nbsp;&nbsp;Ukrainian Hryvnia</option>
                            <option className='flex items-center text-center' value={"rub"}>&nbsp;RUB&nbsp;&nbsp;&nbsp;Russian Ruble</option>
                            <option className='flex items-center text-center' value={"jpy"}>&nbsp;JPY&nbsp;&nbsp;&nbsp;Japanese Yen</option>
                            <option className='flex items-center text-center' value={"cad"}>&nbsp;CAD&nbsp;&nbsp;&nbsp;Canadian Dollar</option>
                            <option className='flex items-center text-center' value={"mxn"}>&nbsp;MXN&nbsp;&nbsp;&nbsp;Mexican Peso</option>
                        </select>
                    )}
                    
                </div>
                <div className='sm:w-16 flex justify-center sm:py-0 py-2'>
                    <p className='text-xl md:text-2xl flex items-center rotate-90 sm:rotate-0'>
                        <button className='dark:hover:text-[#FFD700] hover:text-[#14B8A6]' onClick={buttonCryptoFiat}><TbArrowsRightLeft /></button>
                    </p>
                </div>
                <div className='sm:w-1/3 flex justify-center'>
                    {button1 == 0 ? (
                        <select defaultValue={"usd"} className='w-2/3 sm:w-full h-8 md:h-10 bg-primary border border-secondary rounded-2xl shadow-xl' onChange={(event) => {setCurrency(event.target.value)}}>
                            <option className='flex items-center text-center' value={"usd"}>&nbsp;USD&nbsp;&nbsp;&nbsp;United States Dollar</option>
                            <option className='flex items-center text-center' value={"pln"}>&nbsp;PLN&nbsp;&nbsp;&nbsp;Polish Złoty</option>
                            <option className='flex items-center text-center' value={"eur"}>&nbsp;EUR&nbsp;&nbsp;&nbsp;Euro</option>
                            <option className='flex items-center text-center' value={"gbp"}>&nbsp;GBP&nbsp;&nbsp;&nbsp;Pound Sterling</option>
                            <option className='flex items-center text-center' value={"chf"}>&nbsp;CHF&nbsp;&nbsp;&nbsp;Swiss Franc</option>
                            <option className='flex items-center text-center' value={"cny"}>&nbsp;CNY&nbsp;&nbsp;&nbsp;Chinese Yuan</option>
                            <option className='flex items-center text-center' value={"nok"}>&nbsp;NOK&nbsp;&nbsp;&nbsp;Norwegian Krone</option>
                            <option className='flex items-center text-center' value={"sek"}>&nbsp;SEK&nbsp;&nbsp;&nbsp;Swedish Krona</option>
                            <option className='flex items-center text-center' value={"czk"}>&nbsp;CZK&nbsp;&nbsp;&nbsp;Czech Koruna</option>
                            <option className='flex items-center text-center' value={"dkk"}>&nbsp;DKK&nbsp;&nbsp;&nbsp;Danish Krone</option>
                            <option className='flex items-center text-center' value={"krw"}>&nbsp;KRW&nbsp;&nbsp;&nbsp;South Korean Won</option>
                            <option className='flex items-center text-center' value={"uah"}>&nbsp;UAH&nbsp;&nbsp;&nbsp;Ukrainian Hryvnia</option>
                            <option className='flex items-center text-center' value={"rub"}>&nbsp;RUB&nbsp;&nbsp;&nbsp;Russian Ruble</option>
                            <option className='flex items-center text-center' value={"jpy"}>&nbsp;JPY&nbsp;&nbsp;&nbsp;Japanese Yen</option>
                            <option className='flex items-center text-center' value={"cad"}>&nbsp;CAD&nbsp;&nbsp;&nbsp;Canadian Dollar</option>
                            <option className='flex items-center text-center' value={"mxn"}>&nbsp;MXN&nbsp;&nbsp;&nbsp;Mexican Peso</option>
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
                        {button1 == 0 ? (
                            <p>1 {coinSymbol}</p>
                        ) : (
                            <p>{parseFloat(coinPrice) > 1 ? parseFloat(coinPrice).toLocaleString('pl-PL') : parseFloat(coinPrice)} {currency.toUpperCase()}</p>
                        )}
                    </div>
                    <div className='w-8 sm:w-16 flex justify-center'>
                        <p className='text-base md:text-2xl flex items-center'>
                            <TbEqual />
                        </p>
                    </div>
                    <div className='sm:w-1/3 flex items-center'>
                        {button1 == 0 ? (
                            <p>{parseFloat(coinPrice) > 1 ? parseFloat(coinPrice).toLocaleString('pl-PL') : parseFloat(coinPrice)} {currency.toUpperCase()}</p>
                        ) : (
                            <p>1 {coinSymbol}</p>
                        )}
                    </div>
                </div>
                <div className='flex justify-center w-full h-8'>
                    <div className='sm:w-1/3 flex items-center justify-end'>
                        {button1 == 0 ? (
                            <p>{parseFloat(number) > 1 ? parseFloat(number).toLocaleString('pl-PL') : parseFloat(number)} {coinSymbol}</p>
                        ) : (
                            <p>{parseFloat(number) > 1 ? parseFloat(number).toLocaleString('pl-PL') : parseFloat(number)} {currency.toUpperCase()}</p>
                        )}
                    </div>
                    <div className='w-8 sm:w-16 flex justify-center'>
                        <p className='text-base md:text-2xl flex items-center'>
                            <TbEqual />
                        </p>
                    </div>
                    <div className='sm:w-1/3 flex items-center'>
                        {button1 == 0 ? (
                            <p>{parseFloat((number*coinPrice).toFixed(7)) > 1 ? parseFloat((number*coinPrice).toFixed(7)).toLocaleString('pl-PL') : parseFloat((number*coinPrice).toFixed(7))} {currency.toUpperCase()}</p>
                        ) : (
                            <p>{parseFloat((number/coinPrice).toFixed(7)) > 1 ? parseFloat((number/coinPrice).toFixed(7)).toLocaleString('pl-PL') : parseFloat((number/coinPrice).toFixed(7))} {coinSymbol}</p>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default CryptoToFiat;