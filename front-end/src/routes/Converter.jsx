import CryptoToCrypto from '../components/CryptoToCrypto.jsx'
import CryptoToFiat from '../components/CryptoToFiat.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

const Converter = () => {
  return (
    <div className='p-3'>
      <Navbar />
        <div className='my-8 rounded-div'>
            <div className='flex justify-center'>
                <p className='text-2xl md:text-4xl text-center font-semibold'>Cryptocurrency Converter</p>
            </div>
            <div className='mt-16 mb-16'>
                <CryptoToFiat />
            </div>
            <div className='mb-8'>
                <CryptoToCrypto />
            </div>
        </div>
      <Footer />
    </div>
  )
}

export default Converter