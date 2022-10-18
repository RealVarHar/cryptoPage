import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import logo from '../images/logo.png'

const Login = () => {
  return (
    <div class="min-h-screen flex flex-col">
        <div className="grid content-center justify-items-center pb-10 flex-grow">
            <div class="pb-10">
                <img src={logo} alt="Logo" width="300"></img>
            </div>
            <div class="pt-8">
                <form class="flex flex-col text-3xl font-medium">
                    <label class="mt-4">Login</label>
                    <input class="mb-4" type="text" placeholder='Enter your login' />
                    <label class="">Password</label>
                    <input class="mb-4" type="password" placeholder='Enter your password' />
                </form>
            </div>
            <div class="p-12">
                <Link to="/home">
                    <button class="bg-button text-2xl p-3 rounded-full">
                        <p>Enter without login :)</p>
                    </button>
                </Link>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default Login