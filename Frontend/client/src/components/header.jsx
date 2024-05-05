import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <div className="header-container">
      <div className="left-section">
        <div className="logo">MedTech</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">SignUp</Link>
        </div>
      </div>
      <div className="right-section">
        {/* Right side content */}
      </div>
    </div>
  );
}

export default Header;
