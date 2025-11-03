import React, { useState } from 'react';
import logo from '../assets/Logo-removed-bg.png';
import GoogleIcon from "../assets/GoogleIcon";
import AppleIcon from '../assets/AppleIcon';
import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // 🔹 Handle Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      showAlert("Signed in successfully!", "success");
      setTimeout(() => navigate("/home_page"), 1500);
    } catch (error) {
      showAlert("Invalid email or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      showAlert("Signed in with Google!", "success");
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
        <img src={logo} alt="App Logo" className="logo-bg" />
        <h1 className="Sign_in_to_X">Sign in to X</h1>

        {/* Google Login */}
        <div className="Signup-buttons hover-scale" onClick={handleGoogleLogin}>
          <GoogleIcon size={20} /> Sign in with Google
        </div>

        {/* Apple Login */}
        <div className="Signup-buttons hover-scale">
          <AppleIcon size={20} /> Sign in with Apple
        </div>

        <div className="or_divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="Phone_email_or_username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="Phone_email_or_username"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <div
          className="Signup-buttons hover-scale"
          onClick={!loading ? handleLogin : null}
          style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
        >
          {loading ? "Signing in..." : "Next"}
        </div>

        <div className="Dont_have_an_account">
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: "none", color: "#146BA6" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
