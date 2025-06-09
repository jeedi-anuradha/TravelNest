import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import beach from "../../assets/beach.jpeg";
import city from "../../assets/city.jpeg";
import lake from "../../assets/lake.jpg";
import resort from "../../assets/resort.jpg";
import pool from "../../assets/pool.jpeg";
import forest from "../../assets/forest.jpg";
import street from "../../assets/street.jpeg";
import skyline from "../../assets/skyline.jpg";
import mountain from "../../assets/mountain.jpeg";

const Main3 = () => {
  const hotels = [
    "Beach View",
    "City view",
    "Lake view",
    "Resort view",
    "Pool View",
    "Garden View",
    "Street view",
    "Skyline view",
    "Mountain View ",
  ];
  const images = [
    beach,
    city,
    lake,
    resort,
    pool,
    forest,
    street,
    skyline,
    mountain,
  ];
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
    if (isInWishlist(hotel.id)) {
      removeFromWishlist(hotel.id);
      toast.success(`${hotel.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      addToWishlist(hotel);
      toast.success(`${hotel.name} added to wishlist`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="heading">
        <h2>Type of Hotels</h2>
      </div>
      <div className="carousel-container">
        <button className="arrow left" onClick={() => scroll("left")}>
          &lt;
        </button>
        <div className="popular" ref={scrollRef}>
          {images.map((val, i) => (
            <div key={i} className="hotels">
              <img
                src={val}
                alt={`Hotel-${i}`}
                onClick={() =>
                  navigate(
                    `/hotel/${hotels[i].toLowerCase().replace(/\s/g, "-")}`
                  )
                }
              />
              <p>{hotels[i]}</p>
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={() => scroll("right")}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default Main3;
