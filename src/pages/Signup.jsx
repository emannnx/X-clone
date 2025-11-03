import React, { useState } from 'react';
import logo from '../assets/Logo-removed-bg.png';
import GoogleIcon from "../assets/GoogleIcon";
import AppleIcon from '../assets/AppleIcon';
import { Link, useNavigate } from "react-router-dom";
import '../css/SignUp.css';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // 🔹 Loading state

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

  // 🔹 Handle Email/Password Signup
  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      showAlert("Please fill in all fields.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Passwords do not match.", "error");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      showAlert("Account created successfully!", "success");
      setTimeout(() => navigate("/home_page"), 1500);
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google Signup
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      showAlert("Signed up with Google!", "success");
      setTimeout(() => navigate("/home_page"), 1500);
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper-middle">
        <img src={logo} alt="" className='logo-bg' />
        <h1 className='Sign_in_to_X'>Sign Up to X</h1>

        <div className="Signup-buttons hover-scale" onClick={handleGoogleSignup}>
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

        {/* Username Input */}
        <input
          type="text"
          placeholder='Username'
          className='Phone_email_or_username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder='Email'
          className='Phone_email_or_username'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder='Password'
          className='Phone_email_or_username'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          placeholder='Confirm Password'
          className='Phone_email_or_username'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Sign Up Button */}
        <div
          className="Signup-buttons hover-scale"
          onClick={!loading ? handleSignup : null}
          style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
        >
          {loading ? "Creating account..." : "Next"}
        </div>

        <div className='Dont_have_an_account'>
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: "none", color: '#146BA6' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
