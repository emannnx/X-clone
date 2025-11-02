import React from 'react';
import '../css/join_page.css';
import logo from '../assets/Logo-removed-bg.png';
import GoogleIcon from "../assets/GoogleIcon";
import AppleIcon from '../assets/AppleIcon';
import GrokIcon from '../assets/GrokIcon';
import { Link } from "react-router-dom";


const Join_today = () => {
  return (
    // 🔹 Full-page wrapper with black background
    <div style={{ background: '#000' }}>
      <div className='join-page-container'>

        {/* 🔹 Top section split into left (logo) and right (text/buttons) */}
        <div className="join-page-container-top">

          {/* 🔹 Left: Logo area */}
          <div className='join-page-container-top-left fade-in'>
            <img src={logo} alt="Logo" className='join-page-container-top-left-img slide-in-left'/>
          </div>

          {/* 🔹 Right: Texts and signup buttons */}
          <div className='join-page-container-top-right slide-in-right'>
            <h1 className='Happening_now_text fade-up'>Happening now</h1>
            <h2 className='Join_today_text fade-up-delay'>Join today.</h2>

            {/* 🔹 Signup options */}
            <div className="Signup-buttons hover-scale">
              <GoogleIcon size={20} /> Sign up with Google
            </div>
            <div className="Signup-buttons hover-scale">
              <AppleIcon size={20} /> Sign up with Apple
            </div>

            {/* 🔹 OR divider */}
            <div className='or_divider'>
              <hr />
              <span>or</span>
              <hr />
            </div>

            {/* 🔹 Create account */}
            <div className="Signup-buttons hover-scale" style={{ fontWeight: 'bold' }}>
              Create account
            </div>

            {/* 🔹 Terms text */}
            <div className='terms-service'>
              By signing up, you agree to the 
              <span className='link-text'> Terms of Service</span> and 
              <span className='link-text'> Privacy Policy,</span> including 
              <span className='link-text'> Cookie Use.</span>
            </div>

            {/* 🔹 Already have an account */}
            <h3 className='Already-have-an-account-text fade-up'>Already have an account?</h3>

            {/* 🔹 Sign in + Grok buttons */}
            <Link to="/login" className="Signup-buttons-2 hover-outline" style={{ textDecoration: "none"}}>Sign in</Link>
            <div className="Signup-buttons-2 hover-outline">
              <GrokIcon size={17}/> Get Grok
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Footer */}
      <div className='footer_home fade-up'>
        About | Download the X app | Grok | Help Center | Terms of Service | Privacy Policy | Cookie Policy | 
        Accessibility | Ads info | Blog | Careers | Brand Resources | Advertising | Marketing | 
        X for Business | Developers | News | Settings | © 2025 X Corp.
      </div>
    </div>
  );
};

export default Join_today;
