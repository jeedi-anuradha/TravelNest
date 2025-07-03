import React, { useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '../../Context/WishlistContext';


const Main2 = () => {
  const [HotelCity,setHotelCity]=useState([])
  const {addToWishlist, removeFromWishlist, isInWishlist}=useWishlist();
    const scrollRef = useRef(null)
    const navigate=useNavigate()
    
    useEffect(()=>{
      const fetchData=async()=>{
        try {
          const res=await fetch('https://travelnest-3.onrender.com/api/hotels')
          const data=await res.json()
          // console.log(data)
          const uniqueCityHotels = [];
        const citiesAdded = new Set();
        
        data.forEach(hotel => {
          if (!citiesAdded.has(hotel.city)) {
            citiesAdded.add(hotel.city);
            uniqueCityHotels.push(hotel);
          }
        });
          setHotelCity(uniqueCityHotels)
        } catch (error) {
          console.log(error.message)
        }
      }
      fetchData();
    },[])
      const scroll = (direction) => {
        const { current } = scrollRef
        if (current) {
          current.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth',
          })
        }
      }

      // WishList
        const toggleWishlist=(hotel)=>{
          if (isInWishlist(hotel.id)){
            removeFromWishlist(hotel.id)
            toast.success(`${hotel.name} removed from wishlist`, {
              position: "top-right",
              autoClose: 2000,
            });
          }
          else{
            addToWishlist(hotel)
            toast.success(`${hotel.name} added to wishlist`, {
              position: "top-right",
              autoClose: 2000,
            });
          }
        }

  return (
    <>
    <div className="heading">
      <h2>Popular Cities</h2>
    </div>
    <div className="carousel-container">
      <button className="arrow left" onClick={() => scroll('left')}>&lt;</button>
      <div className="popular" ref={scrollRef}>
        {HotelCity.map(hotel=>{
          return(
            <div className='hotels'>
        <img src={hotel.images[0]} alt="hotel" onClick={()=>(navigate(`/city/${hotel.city.toLowerCase()}`))}/>
         <p>Rating:{hotel.rating}</p>
        <h4>{hotel.name}</h4>
        <p>place: {hotel.city}</p>
        <p>Price per Night {hotel.price}</p>
        <button className='wishlist-heart'
        style={{color:isInWishlist(hotel.id) ? "red" : "black"}}
        onClick={()=>toggleWishlist(hotel)}
        >❤︎</button>
        </div>
          )
        })}
        {/* {
          images.map((val, i) => (
            <div key={i} className="hotels">
              <img src={val} alt={`Hotel-${i}`} onClick={()=>(navigate(`/${hotels[i].toLowerCase()}`))}/>
              <p>{hotels[i]}</p>
            </div>
          ))
        } */}
      </div>
      <button className="arrow right" onClick={() => scroll('right')}>&gt;</button>
    </div>
    </>
  )
}

export default Main2