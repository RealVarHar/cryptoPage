import axios from '/third-party/esm/axios.min.js'
let useEffect=React.useEffect,useState=React.useState;
let Link=ReactRouterDOM.Link;
import { Sparklines, SparklinesLine } from '/third-party/esm/react-sparklines/index.js'

const Coins = () => {
  const [typeWaiter, settypeWaiter] = useState(false)
  const [coins, setCoins] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchTextProxy, setSearchTextProxy] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currency, setCurrency] = useState('usd');
  const [sort, setSort] = useState('rankAsc');

  const url = document.location.origin+`/searchCoin`;//?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`
  
  useEffect(() => {
    setIsLoading(true);
    let parameters={limit:perPage};
    if(searchText!="")parameters.name=searchText;
    axios.post(url,parameters).then((response) => {
      for(let coin of response.data){
        coin.sparkline=Object.values(coin.sparkline).reduce((p,c)=>{p.push(...c);return p;},[]);
        for(let key in coin.data){
          coin[key]=coin.data[key];
        }
        coin.current_price=coin.price;
      }
      if(sort == 'rankAsc') {
        response.data.sort((a, b) => {
          if (a.market_cap_rank === null && b.market_cap_rank === null) return 0;
          if (a.market_cap_rank === null) return 1;
          if (b.market_cap_rank === null) return -1;
          return a.market_cap_rank - b.market_cap_rank;
        })
      }
      if(sort == 'rankDesc') {
        response.data.sort((a, b) => {
          if (a.market_cap_rank === null && b.market_cap_rank === null) return 0;
          if (a.market_cap_rank === null) return 1;
          if (b.market_cap_rank === null) return -1;
          return b.market_cap_rank - a.market_cap_rank;
        })
      }
      if(sort == 'nameAsc') {
        response.data.sort((a, b) => {
          if (a.name === null && b.name === null) return 0;
          if (a.name === null) return 1;
          if (b.name === null) return -1;
          return a.name.localeCompare(b.name)
        })
      }
      if(sort == 'nameDesc') {
        response.data.sort((a, b) => {
          if (a.name === null && b.name === null) return 0;
          if (a.name === null) return 1;
          if (b.name === null) return -1;
          return b.name.localeCompare(a.name)
        })
      }
      if(sort == 'priceAsc') {
        response.data.sort((a, b) => {
          if (a.current_price === null && b.current_price === null) return 0;
          if (a.current_price === null) return 1;
          if (b.current_price === null) return -1;
          return a.current_price - b.current_price;
        })
      }
      if(sort == 'priceDesc') {
        response.data.sort((a, b) => {
          if (a.current_price === null && b.current_price === null) return 0;
          if (a.current_price === null) return 1;
          if (b.current_price === null) return -1;
          return b.current_price - a.current_price;
        })
      }
      if(sort == '24HAsc') {
        response.data.sort((a, b) => {
          if (a.price_change_percentage_24h_in_currency === null && b.price_change_percentage_24h_in_currency === null) return 0;
          if (a.price_change_percentage_24h_in_currency === null) return 1;
          if (b.price_change_percentage_24h_in_currency === null) return -1;
          return a.price_change_percentage_24h_in_currency.toFixed(2) - b.price_change_percentage_24h_in_currency.toFixed(2);
        })
      }
      if(sort == '24HDesc') {
        response.data.sort((a, b) => {
          if (a.price_change_percentage_24h_in_currency === null && b.price_change_percentage_24h_in_currency === null) return 0;
          if (a.price_change_percentage_24h_in_currency === null) return 1;
          if (b.price_change_percentage_24h_in_currency === null) return -1;
          return b.price_change_percentage_24h_in_currency.toFixed(2) - a.price_change_percentage_24h_in_currency.toFixed(2);
        })
      }
      if(sort == '7DAsc') {
        response.data.sort((a, b) => {
          if (a.price_change_percentage_7d_in_currency === null && b.price_change_percentage_7d_in_currency === null) return 0;
          if (a.price_change_percentage_7d_in_currency === null) return 1;
          if (b.price_change_percentage_7d_in_currency === null) return -1;
          return a.price_change_percentage_7d_in_currency.toFixed(2) - b.price_change_percentage_7d_in_currency.toFixed(2);
        })
      }
      if(sort == '7DDesc') {
        response.data.sort((a, b) => {
          if (a.price_change_percentage_7d_in_currency === null && b.price_change_percentage_7d_in_currency === null) return 0;
          if (a.price_change_percentage_7d_in_currency === null) return 1;
          if (b.price_change_percentage_7d_in_currency === null) return -1;
          return b.price_change_percentage_7d_in_currency.toFixed(2) - a.price_change_percentage_7d_in_currency.toFixed(2);
        })
      }
      setCoins(response.data)
      setIsLoading(false)
    })
  }, [url,searchText,perPage,sort] );
  
  useEffect(() => {
    if(typeWaiter!==false){
      clearTimeout(typeWaiter);
    }
    settypeWaiter(setTimeout(()=>{
      setSearchText(searchTextProxy);
      settypeWaiter(false);
    },1000));
  }, [searchTextProxy] );

  const handleChangePerPage = (event) => {
    setPerPage(event.target.value);
  };

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleChangeSort = (event) => {
    setSort(event.target.value);
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
          {coins.map((coin) => (
              <tr key={coin.id} className='md:hover:scale-[1.03] shadow-xl rounded-lg h-16 overflow-hidden'>
                <td className='pl-2'><p class="flex justify-center">{coin.market_cap_rank}</p></td>
                <td>
                  <div className='flex items-center'>
                    <Link to={`/coin/${coin.id}`}>
                      <div className='ml-2 flex items-center hover:text-teal-400 dark:hover:text-[#FFD700]'>
                        <img className='px-2' src={coin.image} alt={coin.id} width="50" />
                        <div className='flex flex-col justify-center'>
                          <p className='font-semibold'>{coin.name}</p>
                          <p className='text-[#949494]'>{coin.symbol.toUpperCase()}</p>
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
                <td class="p-2 text-right hidden lg:table-cell">{(coin.total_volume==null?0:coin.total_volume).toLocaleString('pl-PL')} {currency.toUpperCase()}</td>
                <td class="p-2 text-right hidden md:table-cell">{(coin.market_cap==null?0:coin.market_cap).toLocaleString('pl-PL')} {currency.toUpperCase()}</td>
                <td className=''>
                  {coin.price_change_percentage_7d_in_currency > 0 ? (
                    <Sparklines data={coin.sparkline}>
                      <SparklinesLine color="green" />
                    </Sparklines>
                  ) : (
                    <Sparklines data={coin.sparkline}>
                      <SparklinesLine color="red" />
                    </Sparklines>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
  )

  return (
    <div className='my-8 rounded-div'>
      <div className='px-1 md:px-3 text-[12px]'>
        <div className='flex flex-col md:flex-row md:items-center justify-between pt-3 pb-3 text-center md:text-right'>
          <h1 className='text-2xl font-bold my-2'>Search Crypto</h1>
          <form className='flex justify-center h-10 md:w-1/3'>
            <input
              onChange={(e) => setSearchTextProxy(e.target.value)}
              className='w-full bg-primary border border-secondary px-4 py-2 rounded-2xl shadow-xl'
              type='text'
              placeholder='Search a coin' />
          </form>
        </div>
        <div className='flex justify-between'>
          <select defaultValue={"rankAsc"} className='h-10 bg-primary border border-secondary px-2 sm:px-3 py-1 rounded-2xl shadow-xl' onChange={handleChangeSort}>
            <option value={"rankAsc"}>Rank ASC</option>
            <option value={"rankDesc"}>Rank DESC</option>
            <option value={"nameAsc"}>Name ASC</option>
            <option value={"nameDesc"}>Name DESC</option>
            <option value={"priceAsc"}>Price ASC</option>
            <option value={"priceDesc"}>Price DESC</option>
            <option className='hidden sm:flex' value={"24HAsc"}>24H ASC</option>
            <option className='hidden sm:flex' value={"24HDesc"}>24H DESC</option>
            <option className='hidden sm:flex' value={"7DAsc"}>7D ASC</option>
            <option className='hidden sm:flex' value={"7DDesc"}>7D DESC</option>
          </select>
          <div className='flex justify-end'>
            <select defaultValue={10} className='h-10 bg-primary border border-secondary px-2 sm:px-3 py-1 rounded-2xl shadow-xl mr-2' onChange={handleChangePerPage}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
            </select>
            <select defaultValue={"usd"} className='h-10 bg-primary border border-secondary px-2 sm:px-3 py-1 rounded-2xl shadow-xl' onChange={handleChangeCurrency}>
              <option value={"usd"}>USD</option>
              <option value={"pln"}>PLN</option>
            </select>
          </div>
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