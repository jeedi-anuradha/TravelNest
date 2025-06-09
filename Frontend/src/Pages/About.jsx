import React from 'react';
import nature from '../assets/nature.jpg'
import heritage from '../assets/heritage2.jpg'
import family from '../assets/family1.jpg'
import about from '../assets/about-bg.jpg'
import './About.css';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };
  return (
    <>
    <Header/>
    <button className="fixed-back-button" onClick={handleGoBack}>
        <FaArrowLeft />
        <span className='back-text'>Go Back</span>
      </button>
    <div className="about-container">
      <div className="about-heading-section">
        <h2 className="about-heading">WHY CHOOSE US</h2>
        <p className="about-subtext">TravelNest is your one-stop solution for seamless hotel bookings. Whether you're planning a weekend getaway or a long vacation, we help you find the perfect stay at the best prices.</p>
      </div>

      <div className="about-features">
        <div className="feature">
          <img src={nature} alt="" />
          <h3>Experience Nature's Embrace</h3>
          <p>Surround yourself with serene landscapes, fresh air, and the soothing sounds of the wild.</p>
        </div>
        <div className="feature">
          <img src={heritage} alt="" />
          <h3>Classic Country Homestay</h3>
          <p>Experience timeless charm and warm hospitality in the heart of the countryside.</p>
        </div>
        <div className="feature">
          <img src={family} alt="" />
          <h3>Fun for the Whole Family</h3>
          <p>Enjoy memorable moments together with activities, comfort, and space designed for all ages.</p>
        </div>
      </div>

      <div className="about-why-section">
        <div className="why-left">
          <img src={about} alt="About TravelNest" />
        </div>
        <div className="why-right">
          <h3>Why Choose TravelNest</h3>
          <ul>
            <li>High-standard rooms</li>
            <li>Well furnished</li>
            <li>Fully equipped kitchen</li>
            <li>Swimming pool</li>
            <li>Free restaurant</li>
            <li>Available pet care</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;
