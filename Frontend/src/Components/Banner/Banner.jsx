import React, { useEffect, useState } from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import banner from '../../assets/banner.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Banner.css'

const Banner = () => {
  const [date, setDate] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [])
  return (
    <>
      <div className="banner">
        <div className="banner-img">
          <img src={banner} alt="banner" />
        </div>
        <div className="search">
          <div className="search-field hotel">
            <span className="input-icon"><IoLocationSharp /></span>
            <input type="text" placeholder="Search Hotel name or place" name="search" />
          </div>
          <div className="search-field date">
            <input type="date" name="date" id="" placeholder="Dates" value={date}/>
          </div>
          <div className="search-field persons">
            <span className="input-icon"><IoMdPerson /></span>
            <input type="number" name="persons" placeholder="How many persons?" />
          </div>
          <button>search</button>
        </div>
      </div>

      {/* Carousel */}
      
    </>
  )
}

export default Banner