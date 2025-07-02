import React, { useState,useEffect,useRef } from 'react';
import {Link, useNavigate,useLocation} from 'react-router-dom'
import logo from '../../assets/travel-logo.jpg';
import './Header.css';
import { ImMenu } from "react-icons/im";
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { useSearch } from '../../Context/SearchContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useAuth } from '../../Context/AuthContext';

const Header = () => {
   const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {searchQuery,setSearchQuery}=useSearch();
  const navigate= useNavigate();
  const location=useLocation();
  const {wishlist}=useWishlist();

  const navRef=useRef(null)
  const menuToggleRef=useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault()
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout and go to home?");
      if (confirmLogout) {
        logout();
    navigate('/');
      }
    
  };

  const handleMyBookingsClick = (e) => {
    if (!user) {
      e.preventDefault();
      const shouldLogin = window.confirm("You need to login to view your bookings. Do you want to login now?");
      if (shouldLogin) {
        navigate('/login');
      }
    }
    // If user is logged in, the default Link behavior will proceed to /my-bookings
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          navRef.current && 
          !navRef.current.contains(event.target) && 
          !menuToggleRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      
      {/* Mobile Menu Button */}
      <button className="menu-toggle" onClick={toggleMenu} ref={menuToggleRef}>
        {isMenuOpen ? <IoClose size={24} /> : <ImMenu size={20} />}
      </button>

      <form className="header-search" onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          placeholder='Search here...' 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit"><IoSearch /></button>
      </form>

      <nav className={`nav ${isMenuOpen ? 'active' : ''}`} ref={navRef}>
        <Link to="/">Home</Link>
        <Link to='/about'>About</Link>
        <Link to="/contact">Contact</Link>
        <div className="booking-container">
          <Link to="/my-bookings" className='trips' onClick={handleMyBookingsClick}>My Bookings</Link>
          <span className="booking-text">Manage Your Bookings</span>
        </div>
        <div className="wishlist-count" onClick={() => {
  if (!user) {
    const shouldLogin = window.confirm("You need to login to view your wishlist. Do you want to login now?");
    if (shouldLogin) {
      navigate('/login', { state: { from: { pathname: '/wishlist' } } });
    }
  } else {
    navigate('/wishlist');
  }
}}>
  <span className="heart-icon">❤︎</span>
  {wishlist.length > 0 && (
    <span className="badge">{wishlist.length}</span>
  )}
</div>
        {user ? (
          <button className="login-btn" onClick={handleLogout}>Sign Out</button>
        ) : (
          <Link to="/login"><button className="login-btn">Sign In</button></Link>
        )}
      </nav>
    </header>
  )
}

export default Header;