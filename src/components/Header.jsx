import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__circle" />
        <span className="header__title">Local Ollama</span>
      </div>

      <nav className="header__nav">
        <Link to="/contact" className="nav__link">Contact</Link>
        <Link to="/signin" className="nav__link">Sign In</Link>
        <Link to="/signup" className="nav__link">Sign Up</Link>
      </nav>
    </header>
  );
}

export default Header;


