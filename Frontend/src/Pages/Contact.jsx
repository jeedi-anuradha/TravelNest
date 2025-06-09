import React from "react";
import image from '../assets/info-img.jpg'
import contact from '../assets/contact-icon.jpg'
import location from '../assets/location-icon.jpg' 
import './Contact.css'
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";

const Contact = () => {
  return (
   <>
   <Header/>
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>At TravelNest, your comfort is our priority. Let’s make your trip unforgettable get in touch today!</p>
      </header>

      <section className="contact-form-section">
        <h2>Love to hear from you Get in touch!</h2>
        <form className="contact-form">
          <label>
            Your Name
            <input type="text" name="name" placeholder="Your Name" />
          </label>
          <label>
            Your Email
            <input type="email" name="email" placeholder="Your Email" />
          </label>
          <label>
            Your Message
            <textarea name="message" placeholder="Message"></textarea>
          </label>
          <button type="submit">Send Message</button>
        </form>
        <div className="info-img">
            <img src={image} alt="Image" />
          </div>
      </section>

      <section className="contact-info-section">
      <h2>Connect With Us</h2>
        <div className="info-grid">
          <div className="info-card">
          <img src={contact} alt="contact" />
            <h3>TravelNest Info Center</h3>
            <p>Open Hours: Monday — Sunday</p>
            <p>Telephone: +125055509199</p>
            <p>Fax: +125055509199</p>
            <p>Email: info@moonlit.com</p>
          </div>
          <div className="info-card">
            <img src={location} alt="location" />
            <h3>TravelNest Location</h3>
            <p>Address: The Ritz-Carlton (California, USA)</p>
            <p>Telephone: +125055509199</p>
            <p>Fax: +125055509199</p>
            <p>Email: info@moonlit.com</p>
          </div>
        </div>
        <div className="map-container">
          <iframe
            title="Hotel Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.067115950612!2d98.29939897509373!3d7.889565992129717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30503c5190f914d3%3A0x85ff2780a5e6d0f7!2sPatong%20Beach%2C%20Phuket!5e0!3m2!1sen!2sth!4v1615467493491!5m2!1sen!2sth"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
    <Footer/>
   </>
  );
};

export default Contact;