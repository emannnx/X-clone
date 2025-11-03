import React, { useState } from 'react';
import '../css/join_page.css';
import logo from '../assets/Logo-removed-bg.png';
import GoogleIcon from "../assets/GoogleIcon";
import AppleIcon from '../assets/AppleIcon';
import GrokIcon from '../assets/GrokIcon';
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Join_today = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 🔹 Custom Alert Function
  const showAlert = (message, type = "info") => {
    const colors = {
      success: "#4CAF50",
      error: "#F44336",
      info: "#2196F3"
    };
    const alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.style.position = "fixed";
    alertBox.style.bottom = "30px";
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.background = colors[type];
    alertBox.style.color = "white";
    alertBox.style.padding = "12px 20px";
    alertBox.style.borderRadius = "8px";
    alertBox.style.fontSize = "15px";
    alertBox.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    alertBox.style.zIndex = "1000";
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 2500);
  };

  // 🔹 Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      showAlert("Signed in successfully!", "success");
      setTimeout(() => navigate("/home_page"), 1500);
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

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
            <div
              className="Signup-buttons hover-scale"
              onClick={!loading ? handleGoogleSignIn : null}
              style={{
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
            >
              <GoogleIcon size={20} /> {loading ? "Signing in..." : "Sign up with Google"}
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
            <Link
              to="/signup"
              className="Signup-buttons hover-scale"
              style={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              Create account
            </Link>

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
            <Link to="/login" className="Signup-buttons-2 hover-outline" style={{ textDecoration: "none"}}>
              Sign in
            </Link>
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
