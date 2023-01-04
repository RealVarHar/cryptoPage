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
      <div className='mx-5 my-1'>
        <nav className="w-full">
          <div className="justify-between md:items-center md:flex">
            <div>
              <div className="flex items-center justify-between md:space-x-6">
                <Link to="/home">
                  <div>
                    <img src={logo} alt="Logo" className='w-36'></img>
                  </div>
                </Link>
                <h1>Logged in as {getUserName}</h1>
                <Link to="/">
                  <div>
                    <h1>Logout</h1>
                  </div>
                </Link>
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