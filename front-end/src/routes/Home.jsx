import Coins from '../components/Coins.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'


const Home = () => {
  return (
    <div className='p-3'>
      <Navbar />
      <Coins />
      <Footer />
    </div>
  )
}

export default Home