import React, { useEffect, useState } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import { Carousel } from 'react-bootstrap';
import banner1 from '../../assets/carousel-2.jpg';
import banner2 from '../../assets/carousel-3.jpg';
import banner3 from '../../assets/carousel-4.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Banner.css';

const Banner = () => {
  const [date, setDate] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const banners = [
    { id: 1, image: banner1, alt: "Luxury hotel with pool" },
    { id: 2, image: banner2, alt: "Beautiful beach resort" },
    { id: 3, image: banner3, alt: "Mountain view hotel" }
  ];

  return (
    <div className="banner-container">
      {/* Fixed Search Form - Outside Carousel */}
      <div className="fixed-search-form">
        <div className="search">
          <div className="search-field hotel">
            <span className="input-icon"><IoLocationSharp /></span>
            <input type="text" placeholder="Search Hotel name or place" />
          </div>
          <div className="search-field date">
            <input type="date" value={date} />
          </div>
          <div className="search-field persons">
            <span className="input-icon"><IoMdPerson /></span>
            <input type="number" placeholder="How many persons?" />
          </div>
          <button>Search</button>
        </div>
      </div>

      {/* Carousel without Caption */}
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {banners.map((banner) => (
          <Carousel.Item key={banner.id} interval={3000}>
            <img
              className="d-block w-100 carousel-image"
              src={banner.image}
              alt={banner.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;