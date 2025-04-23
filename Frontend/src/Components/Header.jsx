import React, { useState } from 'react';
import logo from '../assets/travel-logo.jpg';
import './Header.css';
import { ImMenu } from "react-icons/im";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      
      {/* Mobile Menu Button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <IoClose size={24} /> : <ImMenu size={20} />}
      </button>
      
      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <a href="#">Home</a>
        <a href='#'>About</a>
        <a href="#">Contact</a>
        <a href="#" className='trips'>My Bookings <br/>Manage your bookings</a>
        <button className="login-btn">Login/Register</button>
      </nav>
    </header>
  )
}

export default Header;