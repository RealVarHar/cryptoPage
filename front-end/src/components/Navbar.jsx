let useState=React.useState
let Link=ReactRouterDOM.Link;
let logo='/images/logo.png';
import ThemeToggle from './ThemeToggle.jsx'

const Navbar = () => {
  const [navbar, setNavbar] = useState(false);

  return (
    <div className='border border-secondary shadow-[#aaaaaa] p-4 rounded-2xl shadow-sm bg-primary max-w-7xl w-full mx-auto font-bold'>
      <div className='mx-5 my-1'>
        <nav className="w-full">
          <div className="justify-between md:items-center md:flex">
            <div>
              <div className="flex items-center justify-between md:block">
                <Link to="/home">
                  <div>
                    <img src={logo} alt="Logo" className='w-36'></img>
                  </div>
                </Link>
                <div className="md:hidden w-36 flex justify-end">
                  <button className="" onClick={() => setNavbar(!navbar)}>
                    {navbar ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8' viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${ navbar ? "block" : "hidden" }`} >
                <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                  <li className="">
                    <div className='hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
                      <Link to="/home">
                        <h1>Home</h1>
                      </Link>
                    </div>
                  </li>
                  <li className="">
                    <div className='hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
                      <Link to="/converter">
                        <h1>Converter</h1>
                      </Link>
                    </div>
                  </li>
                  <li className="">
                    <div className='hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
                      <h1>Profile</h1>
                    </div>
                  </li>
                  {navbar == false ? (<ThemeToggle />) : (<></>)}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar