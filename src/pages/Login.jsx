import React from 'react'
import '../css/Login.css'
import logo from '../assets/Logo-removed-bg.png'
import GoogleIcon from "../assets/GoogleIcon";
import AppleIcon from '../assets/AppleIcon';
import GrokIcon from '../assets/GrokIcon';
import { Link } from "react-router-dom";


const Login = () => {
  return (
    <div className="login-container">
     <div className="login-wrapper-middle">
      <img src={logo} alt="" className='logo-bg'/>
      <h1 className='Sign_in_to_X'>Sign in to X</h1>
          <div className="Signup-buttons hover-scale">
              <GoogleIcon size={20} /> Sign up with Google
            </div>
            <div className="Signup-buttons hover-scale">
              <AppleIcon size={20} /> Sign up with Apple
            </div>
            <div className='or_divider'>
              <hr />
              <span>or</span>
              <hr />
            </div>
            <input type="username" placeholder='Phone, email, or username' className='Phone_email_or_username' />
             <div className="Signup-buttons hover-scale">Next</div>
             <div className="Signup-buttons-2 hover-outline">Forgot password?</div>
             <div className='Dont_have_an_account'>Don't have an account? <Link to="/signup" style={{ textDecoration: "none", color: '#146BA6'}}>Sign up</Link></div>
     </div>
    </div>
  )
}

export default Login
