import React from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import banner from '../../../images/banner.jpg'
import './Banner.css'

const Banner = () => {
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
            <input type="date" name="date" id="" placeholder="Dates" />
          </div>
          <div className="search-field persons">
            <span className="input-icon"><IoMdPerson /></span>
            <input type="number" name="persons" placeholder="How many persons?" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Banner