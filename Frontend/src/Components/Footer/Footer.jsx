import React from 'react'
import { SiFacebook, SiYoutube, SiInstagram, SiWhatsapp } from "react-icons/si";
import './Footer.css'


const Footer = () => {
  return (
    <footer>
      <div className="phone">
        <h1>Phone Support</h1>
        <p>24 HOURS A DAY</p>
        <h1>+91 7993793859</h1>
      </div>
      <div className="follow">
        <h1>Follow Us</h1>
        <p>SOCIAL MEDIA CHANNELS</p>
        <div className="icons">
        <SiFacebook /> <SiYoutube /> <SiInstagram/> <SiWhatsapp/>
        </div>
      </div>
      <div className="newsletter">
        <h1>Our Newsletter</h1>
        <p>SIGN UP FOR SPECIAL OFFERS</p>
        <input type="email" name='email' placeholder='Email' />
        <button>SUBSCRIBE</button>
      </div>
    </footer>
  )
}

export default Footer