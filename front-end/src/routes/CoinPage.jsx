let useEffect=React.useEffect, useState=React.useState;
import * as Chart from '/third-party/esm/chart/chart.esm.js'
import axios from '/third-party/esm/axios.min.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
let useParams=ReactRouterDOM.useParams;

const CoinPage = () => {
  const [coin, setCoin] = useState({})
  const params = useParams()

  const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}?localization=false`

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoin(response.data)
    })
  },[url])

  return (
    <div className='p-3'>
      <Navbar />
      <div className='my-8 rounded-div'>
        <img src={coin.image?.large} alt='/'/>
        <p>{coin.name}</p>
        
      </div>
      <Footer />
    </div>
  )
}

export default CoinPage