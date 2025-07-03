import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./PopularHotels.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearch } from "../Context/SearchContext";
import { useWishlist } from "../Context/WishlistContext";
import HotelInfoModal from "./HotelInfoModal";
import Lottie from 'lottie-react';
import Loader from "../Components/Loaders/hotel.json";
import Error from '../Components/Loaders/Error.json';

const PopularHotels = () => {
  const navigate = useNavigate();
  const [popularHotels, setPopularHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useSearch();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hotelsPerPage = 6;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://travelnest-3.onrender.com/api/hotels");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        const filteredHotel = data.filter((hotel) => hotel.type === "5-star");
        setPopularHotels(filteredHotel);
        setFilteredHotels(filteredHotel);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = popularHotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowerCaseQuery) ||
        hotel.city.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredHotels(results);
    setCurrentPage(1);
  }, [searchQuery, popularHotels]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleWishlist = (hotel) => {
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
  };

  const handleBookNow = (hotel, e) => {
    e.stopPropagation();
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const handleReadyToBook = (hotel) => {
    setShowModal(false);
    navigate(`/booking/${hotel._id}`);
  };

  return (
    <div className="popular-page-wrapper">
      <Header />
      <main className="popular-main-content">
        {loading ? (
          <div className="popular-loader-container">
            <Lottie 
              animationData={Loader}
              loop
              autoplay
              style={{ width: 300, height: 300 }}
            />
          </div>
        ) : error ? (
          <div className="popular-error-container">
            <div className="popular-error-message">
              <p>Error: {error}</p>
            </div>
            <div className="popular-error-loader">
              <Lottie 
                animationData={Error}
                loop
                autoplay
                style={{ width: 200, height: 200 }}
              />
            </div>
          </div>
        ) : (
          <div className="popular-hotels-container">
            <div className="popular-heading">
              <h1>Popular 5-Star Hotels</h1>
              {searchQuery && (
                <p>Showing {filteredHotels.length} results for "{searchQuery}"</p>
              )}
            </div>

            <div className="popular-container">
              {currentHotels.length > 0 ? (
                currentHotels.map((hotel) => (
                  <div 
                    className="popular-hotels" 
                    key={hotel._id}
                    onClick={() => navigate(`/hotel-details/${hotel._id}`)}
                  >
                    <img
                      src={hotel.images?.[0] || "https://via.placeholder.com/300x200"}
                      alt={`${hotel.name}`}
                    />
                    <p>Rating: {hotel.rating}</p>
                    <h4>{hotel.name}</h4>
                    <p>Location: {hotel.city}</p>
                    <p>Price per Night: ₹{hotel.price}</p>
                    <button onClick={(e) => handleBookNow(hotel, e)}>
                      Book Now
                    </button>
                    <p
                      className="wishlist-heart"
                      style={{ color: isInWishlist(hotel.id) ? "red" : "black" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(hotel);
                      }}
                    >
                      ❤︎
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-results">No hotels found matching your search.</p>
              )}
            </div>

            {filteredHotels.length > hotelsPerPage && (
              <div className="popular-pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      backgroundColor: currentPage === index + 1 ? "#003664" : "grey",
                      color: currentPage === index + 1 ? "white" : "black",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {showModal && selectedHotel && (
        <HotelInfoModal
          hotel={selectedHotel}
          onClose={() => setShowModal(false)}
          onBookNow={handleReadyToBook}
        />
      )}
    </div>
  );
};

export default PopularHotels;