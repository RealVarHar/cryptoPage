let Link=ReactRouterDOM.Link;
let logo='/images/logo.png';
import ThemeToggle from './ThemeToggle.jsx'

const Navbar = () => {
  return (
    <div className='rounded-div flex items-center justify-between h-28 font-bold'>
      <Link to="/home">
        <div className='ml-5'>
          <img src={logo} alt="Logo" width="170"></img>
        </div>
      </Link>
      <div className='flex items-center'>
        <div className='mr-7 hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
          <Link to="/home">
            <h1>Home</h1>
          </Link>
        </div>
        <div className='mr-7 hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
          <Link to="/converter">
            <h1>Converter</h1>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Navbar