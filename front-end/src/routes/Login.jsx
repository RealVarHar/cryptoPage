import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import logo from '../images/logo.png'

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleChangeIsLogin = () => {
        setIsLogin(!isLogin)
    }
    
    const renderLogin = (
        <div className='mb-3 sm:my-8 border border-secondary shadow-[#aaaaaa] p-4 rounded-2xl shadow-sm bg-primary flex flex-col items-center'>
            <img src={logo} alt="Logo" className='pt-4 sm:pt-8 w-56 max-w-lg sm:w-4/6'></img>
            <div className='py-4 sm:py-8 w-2/5 min-w-min'>
                <form className='flex flex-col font-medium items-center'>
                    <label className='pb-4 text-base sm:text-xl'>Login</label>
                    <input className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="text" />
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" />
                </form>
            </div>
            <div className='pb-4 sm:pb-8'>
                <Link to="/home">
                    <button className='text-sm sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-button text-black font-bold sm:hover:scale-110'>
                        <p>Login</p>
                    </button>
                </Link>
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
            <div className='py-4 sm:py-8 w-2/5 min-w-min'>
                <form className='flex flex-col font-medium items-center'>
                    <label className='pb-4 text-base sm:text-xl'>Login</label>
                    <input className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="text" />
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" />
                    <label className='pt-4 pb-4 text-base sm:text-xl'>Password</label>
                    <input className='text-xs sm:text-base border border-secondary shadow-[#aaaaaa] p-2 px-4 rounded-2xl shadow-sm bg-primary w-48 sm:w-max' type="password" />
                </form>
            </div>
            <div className='pb-4 sm:pb-8'>
                <Link to="/home">
                    <button className='text-sm sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-full bg-button text-black font-bold sm:hover:scale-110'>
                        <p>Sign Up</p>
                    </button>
                </Link>
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