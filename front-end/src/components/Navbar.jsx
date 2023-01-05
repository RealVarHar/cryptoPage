let useState=React.useState;
let Link=ReactRouterDOM.Link;
let logo='/images/logo.png';
import ThemeToggle from './ThemeToggle.jsx';
import axios from '/third-party/esm/axios.min.js';

const Navbar = () => {
  const [getUserName,setUserName]=useState('');
  let navigate=ReactRouterDOM.useNavigate();
  const [navbar, setNavbar] = useState(false);
  function restore_cookie(cookieName) {
    let cookies=document.cookie.split('; ');
    for(let cookie of cookies) {
      let split=cookie.split('=');
      if(split[0]==cookieName) {
        return JSON.parse(decodeURIComponent(split[1]));
      }
    }
    return false;
  }
  if(window.loggedAs==undefined||window.loggedAs!=getUserName){
    if(window.loggedAs==undefined) {
      //attempt to read cookie
      let cookie=restore_cookie("authToken");
      //if ok, authenticate /login
      if(cookie!=false) {
        axios.post(window.location.origin+"/login",{user: cookie.user,password: cookie.password}).then((response) => {
          if(response.status==200) {
            window.loggedAs=cookie.user;
            setUserName(cookie.user);
          } else {
            navigate("/");
            location.href=location.origin;
          }
        });
      } else {
        navigate("/");
        location.href=location.origin;
      }
    } else {
      setUserName(window.loggedAs);
    }
  }
  
  return (
    <div className='border border-secondary shadow-[#aaaaaa] p-4 rounded-2xl shadow-sm bg-primary max-w-7xl w-full mx-auto font-bold'>
      <div className='mx-3 my-1'>
        <nav className="w-full">
          <div className="justify-between md:items-center md:flex">
            <div>
              <div className="flex items-center justify-between md:block">
                <div className='flex'>
                  <Link to="/home">
                    <img src={logo} alt="Logo" className='w-36'></img>
                  </Link>
                </div>
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
                  <li>
                    <div className='text-green-700 dark:text-green-300'>
                      <h1>Hi, {getUserName}</h1>
                    </div>
                  </li>
                  <li>
                    <div className='hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
                      <Link to="/home">
                        <h1>Home</h1>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className='hover:text-[#14B8A6] dark:hover:text-[#FFD700]'>
                      <Link to="/converter">
                        <h1>Converter</h1>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className='text-red-500 dark:text-red-300'>
                      <Link to="/">
                        <h1>Logout</h1>
                      </Link>
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