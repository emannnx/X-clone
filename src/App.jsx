import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
 // make sure you have your firebase config set up
import Join_today from "./pages/Join_today";
import Home_page from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // optional: loading screen while checking auth
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "bold"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* If logged in → redirect to Home_page automatically */}
        <Route path="/" element={user ? <Navigate to="/home_page" /> : <Join_today />} />
        <Route path="/login" element={user ? <Navigate to="/home_page" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home_page" /> : <Signup />} />
        <Route path="/home_page" element={user ? <Home_page /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
