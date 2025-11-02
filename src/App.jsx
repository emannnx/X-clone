import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join_today from "./pages/Join_today";
import Home_page from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join_today />} />
        <Route path="/home_page" element={<Home_page />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
