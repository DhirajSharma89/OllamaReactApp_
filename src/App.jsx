import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./App.css"; // Ensure global styles are applied

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <hr className="header-divider" />

        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
