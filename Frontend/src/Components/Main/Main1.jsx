import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Main1.css";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from "../../Context/WishlistContext";

const Main = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://travelnest-3.onrender.com/api/popular/popular");
        const data = await res.json();
        // console.log(data)
        setPopularHotels(data);
      } catch (error) {
        console.log(error, error.message);
      }
    };
    fetchData();
  }, []);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // WishList
  const toggleWishlist = (hotel) => {
    try {
      console.log("main", hotel);
    if (isInWishlist(hotel.id)) {
      removeFromWishlist(hotel.id);
      toast.success(`${hotel.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 1000,
      });
    } else {
      addToWishlist(hotel);
      toast.success(`${hotel.name} added to wishlist`, {
        position: "top-right",
        autoClose: 1000,
      });
    }
    }catch (error) {
      console.log(error.message)
    }
  };
  return (
    <>
      <div className="heading">
        <h2>Popular Hotels Available</h2>
      </div>
      <div className="carousel-container">
        <button className="arrow left" onClick={() => scroll("left")}>
          &lt;
        </button>
        <div className="popular" ref={scrollRef}>
          {popularHotels.map((hotel) => {
            return (
              <div className="hotels">
                <img
                  src={hotel.images[0]}
                  alt="hotel"
                  onClick={() => navigate("/popular")}
                />
                <p>Rating:{hotel.rating}</p>
                <h4>{hotel.name}</h4>
                <p>place: {hotel.city}</p>
                <p>Price per Night {hotel.price}</p>
                <button
                  className="wishlist-heart"
                  style={{ color: isInWishlist(hotel.id) ? "red" : "black" }}
                  onClick={() => toggleWishlist(hotel)}
                >
                  ❤︎
                </button>
              </div>
            );
          })}
        </div>
        <button className="arrow right" onClick={() => scroll("right")}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default Main;
