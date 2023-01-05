let useState=React.useState; let useRef=React.useRef;
let Link=ReactRouterDOM.Link;
import Footer from '../components/Footer.jsx';
let logo='/images/logo.png';
import axios from '/third-party/esm/axios.min.js';

function getHash(str, algo = "SHA-256") {
	return crypto.subtle.digest(algo, Uint8Array.from(str)).then(hash => {
		return (new Uint8Array(hash)).reduce((a,b)=>{return b.toString(16).padStart(2, '0')+a},'');
	});
}

const Login = () => {
    const [getUserName,setUserName]=useState('');
    let navigate=ReactRouterDOM.useNavigate();
    function store_cookie(cookieName,value) {
        var date=new Date();
        date.setDate(date.getDate()+1);
        var expires='; expires='+date.toGMTString();
        let cookie=structuredClone(value);
        document.cookie=cookieName+'='+encodeURIComponent(JSON.stringify(cookie))+expires+";path=/";
    }
    const login=(e)=>{
        e.preventDefault();
        let inputs=document.getElementById('loginForm').getElementsByTagName('input');
        inputs=[...inputs].map(a=>a.value);
        getHash(inputs[1]).then((password)=>{
            axios.post(window.location.origin+"/login",{user:inputs[0],password}).then((response) => {
                if(response.status==200){
                    store_cookie("authToken",{user: inputs[0],password});
                    window.loggedAs=inputs[0];
                    navigate("/home");
                }
            });
        })
    }
    store_cookie("authToken",false);
    delete window.loggedAs;
    const signup=(e)=>{
        e.preventDefault();
        let inputs=document.getElementById('registryForm').getElementsByTagName('input');
        inputs=[...inputs].map(a=>a.value);
        let regexp1 = /^[a-zA-Z0-9]{8,32}$/;
        if(regexp1.test(inputs[0]) == false){
            setErrorMessage('Invalid login!!!');
            return;
        }
        let regexp2 = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}/;
        if(regexp2.test(inputs[1]) == false){
            setErrorMessage('Invalid password!!!');
            return;
        }
        if(inputs[0] == '' || inputs[1] == '' || inputs[2] == ''){
            setErrorMessage('Please enter all required data!!!');
            return;
        }
        if(inputs[1]!=inputs[2]){
            setErrorMessage('The passwords are different!!!');
            return;
        }
        getHash(inputs[1]).then((password)=>{
            axios.post(window.location.origin+"/register",{user:inputs[0],password}).then((response) => {
                if(response.status==200){
                    setErrorMessage('')
                    inputRefs.current.forEach(input => {
                        if(input != null) {
                            input.value = '';
                        }
                    });
                    setPassword1(false)
                    setPassword2(false)
                    setPassword3(false)
                    setPassword4(false)
                    setPassword5(false)
                    setLogin1(false)
                    setLogin2(false)
                    setIsLogin(true)
                    store_cookie("authToken",{user: inputs[0],password});
                    window.loggedAs=inputs[0];
                    navigate("/home");
                }
            });
        })
    }
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef([]);

    const handleChangeIsLogin = () => {
        setErrorMessage('')
        inputRefs.current.forEach(input => {
            if(input != null) {
                input.value = '';
            }
        });
        setPassword1(false)
        setPassword2(false)
        setPassword3(false)
        setPassword4(false)
        setPassword5(false)
        setLogin1(false)
        setLogin2(false)
        setIsLogin(!isLogin)
    }
    
    const [password1, setPassword1] = useState(false);
    const [password2, setPassword2] = useState(false);
    const [password3, setPassword3] = useState(false);
    const [password4, setPassword4] = useState(false);
    const [password5, setPassword5] = useState(false);

    const checkPassword = (event) => {
        let pass = event.target.value
        let r1 = /.{8,}/
        let r2 = /(?=.*[A-Z])/
        let r3 = /(?=.*[a-z])/
        let r4 = /(?=.*[0-9])/
        let r5 = /(?=.*[!@#\$%\^&\*])/

        if(r1.test(pass)) { setPassword1(true) } else { setPassword1(false) }
        if(r2.test(pass)) { setPassword2(true) } else { setPassword2(false) }
        if(r3.test(pass)) { setPassword3(true) } else { setPassword3(false) }
        if(r4.test(pass)) { setPassword4(true) } else { setPassword4(false) }
        if(r5.test(pass)) { setPassword5(true) } else { setPassword5(false) }
    }

    const [login1, setLogin1] = useState(false);
    const [login2, setLogin2] = useState(false);

    const checkLogin = (event) => {
        let log = event.target.value
        let rr1 = /^.{8,32}$/
        let rr2 = /^[a-zA-Z0-9]*$/

        if(rr1.test(log)) { setLogin1(true) } else { setLogin1(false) }
        if(log == '') { setLogin2(false) } else if(rr2.test(log)) { setLogin2(true) } else { setLogin2(false) }
    }

    const renderLogin = (
        <div className='mb-3 sm:my-8 border border-secondary shadow-[#aaaaaa] p-4 rounded-2xl shadow-sm bg-primary flex flex-col items-center'>
            <img src={logo} alt="Logo" className='pt-4 sm:pt-8 w-56 max-w-lg sm:w-4/6'></img>
            <div className='py-4 sm:py-8 w-2/5 min-w-min'>
                <form id='loginForm' className='flex flex-col font-medium items-center'>
                    <label className='pb-4 text-base sm:text-xl'>Login</label>
                    <input ref={el => inputRefs.current[0] = el} className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="text" />
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input ref={el => inputRefs.current[1] = el} className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" />
                </form>
            </div>
            <div className='pb-4 sm:pb-8'>
                <button onClick={login} className='text-sm sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-button text-black font-bold sm:hover:scale-110'>
                    <p>Login</p>
                </button>
            </div>
            <div className='sm:px-4 w-full'>
                <hr className='border w-full border-secondary'></hr>
            </div>
            <div className='pb-3 pt-6 sm:pb-6 sm:pt-9 flex text-xs sm:text-sm'>
                <p>Don't have an account?</p>
                <button className='pl-2 sm:pl-3 text-secondary font-bold dark:text-[#FFD700]' onClick={handleChangeIsLogin}>Sign Up</button>
            </div>
        </div>
    )
    
    const renderSignUp = (
        <div className='mb-3 sm:my-8 border border-secondary shadow-[#aaaaaa] p-4 rounded-2xl shadow-sm bg-primary flex flex-col items-center'>
            <img src={logo} alt="Logo" className='pt-4 sm:pt-8 w-56 max-w-lg sm:w-4/6'></img>
            <div className='pt-4 sm:pt-8 w-2/5 min-w-min'>
                <form id='registryForm' className='flex flex-col font-medium items-center'>
                    <label className='pb-4 text-base sm:text-xl'>Login</label>
                    <input ref={el => inputRefs.current[0] = el} className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="text" onChange={checkLogin}/>
                    <div className='text-[10px] sm:text-xs font-normal text-gray-600 dark:text-gray-400 pt-1'>
                        {login1 ? (<p className='text-green-600'>- 8 to 32 characters</p>) : (<p>- 8 to 32 characters</p>)}
                        {login2 ? (<p className='text-green-600'>- only letters and digits</p>) : (<p>- only letters and digits</p>)}
                    </div>
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input ref={el => inputRefs.current[1] = el} className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" onChange={checkPassword}/>
                    <div className='text-[10px] sm:text-xs font-normal text-gray-600 dark:text-gray-400 pt-1'>
                        {password1 ? (<p className='text-green-600'>- least 8 characters</p>) : (<p>- least 8 characters</p>)}
                        {password2 ? (<p className='text-green-600'>- least 1 uppercase letter</p>) : (<p>- least 1 uppercase letter</p>)}
                        {password3 ? (<p className='text-green-600'>- least 1 lowercase letter</p>) : (<p>- least 1 lowercase letter</p>)}
                        {password4 ? (<p className='text-green-600'>- least 1 digit</p>) : (<p>- least 1 digit</p>)}
                        {password5 ? (<p className='text-green-600'>- least 1 special character</p>) : (<p>- least 1 special character</p>)}
                    </div>
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input ref={el => inputRefs.current[2] = el} className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" />
                </form>
            </div>
            {errorMessage ? (
                <div className="text-[12px] sm:text-[16px] py-2 sm:py-3 text-red-700 dark:text-red-500 text-center">{errorMessage}</div>
            ) : (
                <div className="py-2 sm:py-3"></div>
            )}
            <div className='pb-4 sm:pb-8'>
                <button onClick={signup} className='text-sm sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-button text-black font-bold sm:hover:scale-110'>
                    <p>Sign Up</p>
                </button>
            </div>
            <div className='sm:px-4 w-full'>
                <hr className='border w-full border-secondary'></hr>
            </div>
            <div className='pb-3 pt-6 sm:pb-6 sm:pt-9 flex text-xs sm:text-sm'>
                <p>Already have an account?</p>
                <button className='pl-2 sm:pl-3 text-secondary font-bold dark:text-[#FFD700]' onClick={handleChangeIsLogin}>Login</button>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen flex flex-col p-3 items-center'>
            <div className='flex flex-grow justify-center items-center w-3/4 max-w-7xl'>
                {isLogin ? renderLogin : renderSignUp}
            </div>
            <Footer />
        </div>
    )
}

export default Login